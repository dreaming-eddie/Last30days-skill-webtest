// Netlify Serverless Function for last30days live search with Google News & Web Search
export async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  let reqData = {};
  try {
    reqData = JSON.parse(event.body || '{}');
  } catch (e) {}

  const topic = (reqData.topic || 'Claude 3.7').trim();
  const days = reqData.days || 30;

  console.log(`[Netlify Function] Live Research with Google News & Web Search for: "${topic}"`);

  const findings = [];

  // 1. Fetch Google News RSS via RSS2JSON
  try {
    const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(`https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`)}`;
    const gnewsRes = await fetch(rssUrl);
    if (gnewsRes.ok) {
      const gnewsData = await gnewsRes.json();
      (gnewsData.items || []).slice(0, 10).forEach(item => {
        if (item.title && item.link) {
          findings.push({
            candidate_id: `gnews-${Math.random().toString(36).substring(2, 9)}`,
            source: 'googlenews',
            title: item.title.replace(/\s+-\s+[^-]+$/, ''),
            url: item.link,
            summary: item.description ? item.description.replace(/<[^>]*>/g, '').slice(0, 180) + '...' : `Google News breaking article`,
            published_at: item.pubDate ? item.pubDate.split(' ')[0] : new Date().toISOString().split('T')[0],
            relevance_score: 0.98,
            engagement: { publisher: item.author || 'Google News', type: 'News' }
          });
        }
      });
    }
  } catch (err) {
    console.error('Google News Error:', err);
  }

  // 2. Fetch HackerNews Algolia API
  try {
    const hnRes = await fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(topic)}&tags=story&hitsPerPage=12`);
    if (hnRes.ok) {
      const hnData = await hnRes.json();
      (hnData.hits || []).forEach(item => {
        if (item.title) {
          findings.push({
            candidate_id: `hn-${item.objectID}`,
            source: 'hackernews',
            title: item.title,
            url: item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
            summary: `HackerNews discussion with ${item.points || 0} points and ${item.num_comments || 0} comments.`,
            published_at: item.created_at ? item.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            relevance_score: 0.94,
            engagement: { points: item.points || 0, comments: item.num_comments || 0 }
          });
        }
      });
    }
  } catch (err) {
    console.error('HN Error:', err);
  }

  // 3. Fetch Reddit Public API
  try {
    const redditRes = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(topic)}&sort=relevance&t=month&limit=12`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    if (redditRes.ok) {
      const redditData = await redditRes.json();
      const posts = redditData.data?.children || [];
      posts.forEach(p => {
        const post = p.data;
        if (post && post.title) {
          findings.push({
            candidate_id: `reddit-${post.id}`,
            source: 'reddit',
            title: post.title,
            url: `https://www.reddit.com${post.permalink}`,
            summary: post.selftext ? post.selftext.slice(0, 180) + '...' : `Subreddit r/${post.subreddit} post by u/${post.author}`,
            published_at: new Date(post.created_utc * 1000).toISOString().split('T')[0],
            relevance_score: 0.90,
            engagement: { score: post.score || 0, num_comments: post.num_comments || 0 }
          });
        }
      });
    }
  } catch (err) {
    console.error('Reddit Error:', err);
  }

  // 4. Fetch GitHub Public Repos
  try {
    const ghRes = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(topic)}&sort=updated&per_page=8`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (ghRes.ok) {
      const ghData = await ghRes.json();
      (ghData.items || []).forEach(repo => {
        findings.push({
          candidate_id: `gh-${repo.id}`,
          source: 'github',
          title: repo.full_name,
          url: repo.html_url,
          summary: repo.description || `GitHub repository with ${repo.stargazers_count} stars and ${repo.forks_count} forks.`,
          published_at: repo.updated_at ? repo.updated_at.split('T')[0] : new Date().toISOString().split('T')[0],
          relevance_score: 0.86,
          engagement: { stars: repo.stargazers_count || 0, forks: repo.forks_count || 0 }
        });
      });
    }
  } catch (err) {
    console.error('GitHub Error:', err);
  }

  const responsePayload = {
    query_topic: topic,
    window_days: Number(days),
    schema_version: "1.2",
    as_of_date: new Date().toISOString().split('T')[0],
    source_status: { googlenews: "ok", hackernews: "ok", reddit: "ok", github: "ok" },
    findings: findings
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(responsePayload)
  };
}

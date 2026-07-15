export default async function handler(req, res) {
  const { subreddit, ...searchParams } = req.query;

  if (!subreddit) {
    res.status(400).json({ error: 'Parâmetro subreddit é obrigatório' });
    return;
  }

  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (key !== 'subreddit' && value != null) {
      params.set(key, String(value));
    }
  });

  const redditUrl = `https://www.reddit.com/r/${subreddit}/search.json?${params.toString()}`;

  try {
    const response = await fetch(redditUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'freela-finder/1.0',
      },
    });

    const body = await response.text();

    res.status(response.status);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.send(body);
  } catch (error) {
    res.status(502).json({
      error: error.message || 'Falha ao consultar Reddit',
    });
  }
}

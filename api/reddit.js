async function fetchFromReddit(subreddit, mode, params) {
  const path =
    mode === 'new'
      ? `https://www.reddit.com/r/${subreddit}/new.json?limit=50`
      : `https://www.reddit.com/r/${subreddit}/search.json?${params.toString()}`;

  const response = await fetch(path, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'web:freela-finder:1.1 (by /u/devRafaCoelho)',
    },
  });

  if (!response.ok) {
    return { ok: false, status: response.status };
  }

  return { ok: true, data: await response.json() };
}

async function fetchFromPullPush(subreddit, searchParams, mode) {
  const pullPushUrl = new URL('https://api.pullpush.io/reddit/search/submission/');
  pullPushUrl.searchParams.set('subreddit', subreddit);
  pullPushUrl.searchParams.set('size', '50');
  pullPushUrl.searchParams.set('sort', 'desc');
  pullPushUrl.searchParams.set('sort_type', 'created_utc');

  // Queries simples funcionam melhor no PullPush
  if (mode === 'new') {
    pullPushUrl.searchParams.set('q', '*');
  } else {
    const q = searchParams.get('q') || 'hiring OR freelance OR developer OR node OR react';
    // PullPush não gosta de queries longas; pega as primeiras palavras
    const shortQuery = q.split(/\s+OR\s+/i).slice(0, 3).join(' OR ');
    pullPushUrl.searchParams.set('q', shortQuery);
  }

  const response = await fetch(pullPushUrl.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`PullPush HTTP ${response.status}`);
  }

  const payload = await response.json();
  const submissions = payload?.data || [];

  return {
    data: {
      children: submissions.map((item) => ({
        data: {
          id: item.id,
          title: item.title,
          selftext: item.selftext || '',
          url: item.url,
          permalink: item.permalink?.startsWith('http')
            ? item.permalink
            : `https://www.reddit.com${item.permalink}`,
          subreddit: item.subreddit || subreddit,
          created_utc: item.created_utc,
        },
      })),
    },
  };
}

export default async function handler(req, res) {
  const { subreddit, mode = 'search', ...searchParams } = req.query;

  if (!subreddit) {
    res.status(400).json({ error: 'Parâmetro subreddit é obrigatório' });
    return;
  }

  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (key !== 'subreddit' && key !== 'mode' && value != null) {
      params.set(key, String(value));
    }
  });

  try {
    const redditResult = await fetchFromReddit(subreddit, mode, params);

    if (redditResult.ok) {
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate');
      res.setHeader('X-Reddit-Source', 'reddit');
      res.json(redditResult.data);
      return;
    }

    const fallbackData = await fetchFromPullPush(subreddit, params, mode);

    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate');
    res.setHeader('X-Reddit-Source', 'pullpush');
    res.json(fallbackData);
  } catch (error) {
    res.status(502).json({
      error: error.message || 'Falha ao consultar Reddit',
    });
  }
}

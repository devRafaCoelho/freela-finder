const SUBREDDITS = [
  'forhire',
  'slavelabour',
  'freelance',
  'hiring',
  'remotejs',
  'javascriptjobs',
  'brdev',
];

function buildRedditQuery(params) {
  // Query curta: só tecnologias — PullPush e Reddit lidam melhor
  const techTerms = (params.includeTech || []).slice(0, 3);
  if (techTerms.length > 0) {
    return techTerms.join(' OR ');
  }
  if (params.keyword) return params.keyword;
  return 'hiring OR freelance OR developer';
}

function getRedditUrl(subreddit, params, mode) {
  if (import.meta.env.DEV) {
    if (mode === 'new') {
      return `/api/reddit/r/${subreddit}/new.json?limit=50`;
    }
    const q = encodeURIComponent(buildRedditQuery(params));
    return `/api/reddit/r/${subreddit}/search.json?q=${q}&restrict_sr=1&sort=new&t=month&limit=50`;
  }

  if (mode === 'new') {
    return `/api/reddit?subreddit=${subreddit}&mode=new`;
  }

  const q = encodeURIComponent(buildRedditQuery(params));
  return `/api/reddit?subreddit=${subreddit}&mode=search&q=${q}&restrict_sr=1&sort=new&t=month&limit=50`;
}

async function fetchSubreddit(subreddit, params, mode) {
  const url = getRedditUrl(subreddit, params, mode);
  const res = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!res.ok) throw new Error(`${subreddit}/${mode}: HTTP ${res.status}`);

  const data = await res.json();
  return data?.data?.children?.map((child) => child.data) || [];
}

export async function collectReddit(params) {
  try {
    // Busca recente (new) + search por tech nos principais subs de freela
    const freelaSubs = ['forhire', 'slavelabour', 'freelance', 'hiring'];
    const techSubs = SUBREDDITS;

    const tasks = [
      ...freelaSubs.map((sub) => ({ sub, mode: 'new' })),
      ...techSubs.map((sub) => ({ sub, mode: 'search' })),
    ];

    const batches = await Promise.allSettled(
      tasks.map(({ sub, mode }) => fetchSubreddit(sub, params, mode)),
    );

    const items = [];
    const errors = [];
    const seen = new Set();

    batches.forEach((result, index) => {
      const { sub, mode } = tasks[index];
      if (result.status === 'fulfilled') {
        result.value.forEach((item) => {
          if (item?.id && !seen.has(item.id)) {
            seen.add(item.id);
            items.push(item);
          }
        });
      } else {
        errors.push(`${sub}/${mode}: ${result.reason?.message}`);
      }
    });

    if (items.length === 0 && errors.length > 0) {
      throw new Error(errors.slice(0, 4).join('; '));
    }

    return {
      source: 'reddit',
      items,
      error: errors.length > 0 ? `${errors.length} requests falharam` : null,
    };
  } catch (error) {
    return {
      source: 'reddit',
      items: [],
      error: error.message || 'Falha ao buscar Reddit',
    };
  }
}

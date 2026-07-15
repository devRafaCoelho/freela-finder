const SUBREDDITS = ['forhire', 'slavelabour', 'freelance', 'brdev'];

function buildRedditQuery(params) {
  const terms = [...(params.intentTerms || []), ...(params.includeTech || [])]
    .slice(0, 4)
    .join(' OR ');

  if (params.keyword) {
    return `${terms} ${params.keyword}`.trim();
  }

  return terms || 'freelance developer';
}

function getRedditSearchUrl(subreddit, params) {
  const q = encodeURIComponent(buildRedditQuery(params));
  const searchParams = `q=${q}&restrict_sr=1&sort=new&t=month&limit=25`;

  if (import.meta.env.DEV) {
    return `/api/reddit/r/${subreddit}/search.json?${searchParams}`;
  }

  return `/api/reddit?subreddit=${subreddit}&${searchParams}`;
}

async function fetchSubreddit(subreddit, params) {
  const url = getRedditSearchUrl(subreddit, params);

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) throw new Error(`Reddit ${subreddit}: HTTP ${res.status}`);

  const data = await res.json();
  return data?.data?.children?.map((child) => child.data) || [];
}

export async function collectReddit(params) {
  try {
    const batches = await Promise.allSettled(
      SUBREDDITS.map((sub) => fetchSubreddit(sub, params)),
    );

    const items = [];
    const errors = [];

    batches.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        items.push(...result.value);
      } else {
        errors.push(`${SUBREDDITS[index]}: ${result.reason?.message}`);
      }
    });

    if (items.length === 0 && errors.length > 0) {
      throw new Error(errors.join('; '));
    }

    return {
      source: 'reddit',
      items,
      error: errors.length > 0 ? errors.join('; ') : null,
    };
  } catch (error) {
    return {
      source: 'reddit',
      items: [],
      error: error.message || 'Falha ao buscar Reddit',
    };
  }
}

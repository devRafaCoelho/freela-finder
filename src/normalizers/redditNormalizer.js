import { hashId } from '../utils/hashId';
import { extractTechnologiesFromText } from '../utils/techExtract';

export function normalizeRedditItem(item) {
  const title = item.title || 'Sem título';
  const description = item.selftext || '';
  const url = item.url?.startsWith('http')
    ? item.url
    : `https://www.reddit.com${item.permalink}`;

  return {
    id: hashId('reddit', item.id),
    title,
    description,
    url,
    source: 'reddit',
    sourceLabel: `Reddit r/${item.subreddit}`,
    publishedAt: item.created_utc ? new Date(item.created_utc * 1000).toISOString() : null,
    technologies: extractTechnologiesFromText(title, description),
    intentSignals: [],
    matchScore: 0,
    tier: 'low',
    excludedReason: null,
  };
}

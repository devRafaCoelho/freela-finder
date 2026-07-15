import { hashId } from '../utils/hashId';
import { stripHtml } from '../utils/stripHtml';
import { extractTechnologiesFromText } from '../utils/techExtract';

export function normalizeArbeitnowItem(item) {
  const title = item.title || 'Sem título';
  const description = stripHtml(item.description || '');

  return {
    id: hashId('arbeitnow', item.slug || item.url),
    title,
    description,
    url: item.url,
    source: 'arbeitnow',
    sourceLabel: 'Arbeitnow',
    publishedAt: item.created_at || null,
    technologies: extractTechnologiesFromText(title, description, item.tags?.join(' ') || ''),
    intentSignals: [],
    matchScore: 0,
    tier: 'low',
    excludedReason: null,
  };
}

import { hashId } from '../utils/hashId';
import { stripHtml } from '../utils/stripHtml';
import { extractTechnologiesFromText } from '../utils/techExtract';

export function normalizeRemoteOkItem(item) {
  const title = item.position || item.title || 'Sem título';
  const description = stripHtml(item.description || '');

  return {
    id: hashId('remoteok', item.id),
    title,
    description,
    url: item.url || item.apply_url || `https://remoteok.com/remote-jobs/${item.id}`,
    source: 'remoteok',
    sourceLabel: 'RemoteOK',
    publishedAt: item.date || (item.epoch ? new Date(item.epoch * 1000).toISOString() : null),
    technologies: extractTechnologiesFromText(title, description, ...(item.tags || [])),
    intentSignals: [],
    matchScore: 0,
    tier: 'low',
    excludedReason: null,
  };
}

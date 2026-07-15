import { hashId } from '../utils/hashId';
import { stripHtml } from '../utils/stripHtml';
import { extractTechnologiesFromText } from '../utils/techExtract';

export function normalizeRemotiveItem(item) {
  const title = item.title || 'Sem título';
  const description = stripHtml(item.description || '');

  return {
    id: hashId('remotive', item.id),
    title,
    description,
    url: item.url || item.job_url,
    source: 'remotive',
    sourceLabel: 'Remotive',
    publishedAt: item.publication_date || null,
    jobType: [item.job_type, ...(item.tags || [])].filter(Boolean).join(' '),
    technologies: extractTechnologiesFromText(title, description, item.tags || item.job_type || ''),
    intentSignals: [],
    matchScore: 0,
    tier: 'low',
    excludedReason: null,
  };
}

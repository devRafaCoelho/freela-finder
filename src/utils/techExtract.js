import { getSynonyms, getAllCanonicalTechs } from '../engines/techSynonyms';
import { normalizeText, wordMatch } from '../utils/textMatch';

export function extractTechnologiesFromText(...parts) {
  const combined = parts.filter(Boolean).join(' ');
  const found = new Set();

  for (const canonical of getAllCanonicalTechs()) {
    const synonyms = getSynonyms(canonical);
    if (synonyms.some((syn) => wordMatch(combined, syn))) {
      found.add(canonical);
    }
  }

  return [...found];
}

export function extractTechnologies(tagsOrText) {
  if (Array.isArray(tagsOrText)) {
    return extractTechnologiesFromText(tagsOrText.join(' '));
  }
  return extractTechnologiesFromText(String(tagsOrText || ''));
}

export function getOpportunityFullText(opportunity) {
  return [
    opportunity.title,
    opportunity.description,
    ...(opportunity.technologies || []),
  ]
    .filter(Boolean)
    .join(' ');
}

export function detectIntentSignals(opportunity, intentTerms = []) {
  const text = getOpportunityFullText(opportunity);
  return intentTerms.filter((term) => normalizeText(text).includes(normalizeText(term)));
}

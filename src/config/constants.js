import { DEFAULT_INTENT_TERMS } from './defaultIntentTerms';
import { SOURCE_IDS } from './sources';

export const DEFAULT_SEARCH_VALUES = {
  includeTech: ['node', 'react', 'typescript'],
  excludeTech: ['python', 'php', 'wordpress'],
  intentTerms: DEFAULT_INTENT_TERMS,
  keyword: '',
  strictMode: true,
  region: 'remote',
  maxAgeDays: 14,
  sources: SOURCE_IDS,
  minMatchScore: 25,
  pitchTemplate: '',
};

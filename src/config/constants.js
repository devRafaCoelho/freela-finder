import { DEFAULT_INTENT_TERMS } from './defaultIntentTerms';
import { FREELA_FIRST_SOURCE_IDS } from './sources';

export const DEFAULT_SEARCH_VALUES = {
  includeTech: ['node', 'react', 'typescript'],
  excludeTech: ['python', 'php', 'wordpress'],
  intentTerms: DEFAULT_INTENT_TERMS,
  keyword: '',
  strictMode: true,
  prioritizeFreela: true,
  // Só remove full-time/CLT explícito — não descarta todo job board
  excludeFullTime: true,
  region: 'remote',
  maxAgeDays: 45,
  sources: FREELA_FIRST_SOURCE_IDS,
  minMatchScore: 15,
  pitchTemplate: '',
};

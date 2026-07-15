import { DEFAULT_PITCH_TEMPLATE } from '../config/defaultIntentTerms';

const STORAGE_KEY = 'freela-finder-preferences';

export function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePreferences(prefs) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      includeTech: prefs.includeTech,
      excludeTech: prefs.excludeTech,
      intentTerms: prefs.intentTerms,
      strictMode: prefs.strictMode,
      prioritizeFreela: prefs.prioritizeFreela,
      excludeFullTime: prefs.excludeFullTime,
      pitchTemplate: prefs.pitchTemplate || DEFAULT_PITCH_TEMPLATE,
      sources: prefs.sources,
      keyword: prefs.keyword,
      maxAgeDays: prefs.maxAgeDays,
      minMatchScore: prefs.minMatchScore,
      region: prefs.region,
    }),
  );
}

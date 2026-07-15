import { DEFAULT_PITCH_TEMPLATE } from '../config/defaultIntentTerms';

const STORAGE_KEY = 'freela-finder-preferences-v2';

export function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);

    // migra preferências antigas se existirem
    const legacy = localStorage.getItem('freela-finder-preferences');
    if (legacy) {
      const parsed = JSON.parse(legacy);
      localStorage.setItem(STORAGE_KEY, legacy);
      return parsed;
    }

    return null;
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

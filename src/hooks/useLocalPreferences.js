import { useCallback, useEffect, useState } from 'react';
import { loadPreferences, savePreferences } from '../services/preferencesService';

export function useLocalPreferences(defaultValues) {
  const [prefs, setPrefs] = useState(() => loadPreferences() || defaultValues);

  useEffect(() => {
    savePreferences(prefs);
  }, [prefs]);

  const updatePrefs = useCallback((partial) => {
    setPrefs((current) => ({ ...current, ...partial }));
  }, []);

  return { prefs, updatePrefs, setPrefs };
}

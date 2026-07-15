import { useCallback, useState } from 'react';
import { runSearch } from '../services/searchOrchestrator';

export function useSearch() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const search = useCallback(async (params) => {
    setStatus('loading');
    setError(null);

    try {
      const data = await runSearch(params);
      setResult(data);
      setStatus('success');
    } catch (e) {
      setError(e.message || 'Erro ao buscar oportunidades');
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, search, reset };
}

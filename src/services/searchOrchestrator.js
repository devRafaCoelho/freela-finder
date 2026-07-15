import { COLLECTORS } from '../collectors';
import { NORMALIZERS } from '../normalizers';
import { applyMatchEngine } from '../engines/matchEngine';

export async function runSearch(params) {
  const activeSources = params.sources?.length
    ? params.sources
    : Object.keys(COLLECTORS);

  const results = await Promise.allSettled(
    activeSources.map(async (source) => {
      const raw = await COLLECTORS[source](params);
      const normalize = NORMALIZERS[source];
      const items = (raw.items || []).map(normalize);

      if (raw.error && items.length === 0) {
        throw new Error(raw.error);
      }

      return { items, warning: raw.error };
    }),
  );

  const sourceErrors = [];
  const allOpportunities = [];

  results.forEach((result, index) => {
    const source = activeSources[index];

    if (result.status === 'fulfilled') {
      allOpportunities.push(...result.value.items);
      if (result.value.warning) {
        sourceErrors.push({ source, message: result.value.warning });
      }
    } else {
      sourceErrors.push({
        source,
        message: result.reason?.message || 'Erro desconhecido',
      });
    }
  });

  const { opportunities, stats } = applyMatchEngine(allOpportunities, params);
  stats.sourceErrors = sourceErrors;

  return {
    opportunities,
    stats,
    searchedAt: new Date().toISOString(),
  };
}

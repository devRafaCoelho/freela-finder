import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { SearchFiltersForm } from '../../components/search/SearchFiltersForm/SearchFiltersForm';
import { SearchStatsBar } from '../../components/results/SearchStatsBar/SearchStatsBar';
import { SourceErrorAlert } from '../../components/common/SourceErrorAlert/SourceErrorAlert';
import { OpportunityTable } from '../../components/results/OpportunityTable/OpportunityTable';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';
import { useSearch } from '../../hooks/useSearch';
import { useLocalPreferences } from '../../hooks/useLocalPreferences';
import { searchSchema } from '../../schemas/searchSchema';
import { DEFAULT_SEARCH_VALUES } from '../../config/constants';
import { DEFAULT_PITCH_TEMPLATE } from '../../config/defaultIntentTerms';
import { savePreferences } from '../../services/preferencesService';

export function SearchPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { prefs } = useLocalPreferences(DEFAULT_SEARCH_VALUES);
  const { status, result, error, search } = useSearch();

  const defaultValues = useMemo(
    () => ({
      ...DEFAULT_SEARCH_VALUES,
      ...prefs,
      pitchTemplate: prefs.pitchTemplate || DEFAULT_PITCH_TEMPLATE,
    }),
    [prefs],
  );

  const form = useForm({
    defaultValues,
    resolver: yupResolver(searchSchema),
  });

  const onSubmit = async (data) => {
    savePreferences(data);
    await search(data);
  };

  const loading = status === 'loading';

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Radar de oportunidades fora das plataformas saturadas. Busque, abra os links e contate na hora —
        nada fica salvo.
      </Typography>

      <SearchFiltersForm form={form} onSubmit={onSubmit} loading={loading} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <>
          <SearchStatsBar stats={result.stats} searchedAt={result.searchedAt} />
          <SourceErrorAlert errors={result.stats.sourceErrors} />

          {result.opportunities.length === 0 ? (
            <EmptyState message="Nenhuma oportunidade com esses filtros. Tente afrouxar exclusões ou incluir mais fontes." />
          ) : (
            <OpportunityTable
              opportunities={result.opportunities}
              pitchTemplate={form.watch('pitchTemplate')}
            />
          )}
        </>
      )}

      {!result && !loading && !error && (
        <EmptyState message="Configure os filtros e clique em Buscar oportunidades." />
      )}

      {isMobile && result?.opportunities?.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Em telas pequenas, role a tabela horizontalmente para ver todas as colunas.
        </Typography>
      )}
    </Box>
  );
}

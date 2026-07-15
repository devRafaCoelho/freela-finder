import { Alert, Box, Typography } from '@mui/material';

export function SearchStatsBar({ stats, searchedAt }) {
  if (!stats) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {stats.finalCount} resultados · {stats.excludedByTech} descartados por stack ·{' '}
        {stats.excludedByScore} por score · {stats.afterDedupe} após dedupe ·{' '}
        {stats.sourceErrors?.length || 0} fonte(s) com aviso
        {searchedAt ? ` · ${new Date(searchedAt).toLocaleString('pt-BR')}` : ''}
      </Typography>
    </Box>
  );
}

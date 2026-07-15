import { Alert, AlertTitle, Box, Typography } from '@mui/material';

export function SourceErrorAlert({ errors }) {
  if (!errors?.length) return null;

  const hasRedditError = errors.some((err) => err.source === 'reddit');

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="warning">
        <AlertTitle>Algumas fontes falharam ou retornaram parcialmente</AlertTitle>
        {errors.map((err) => (
          <Box key={`${err.source}-${err.message}`} component="div">
            <strong>{err.source}:</strong> {err.message}
          </Box>
        ))}
        {hasRedditError && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            O Reddit costuma bloquear acesso direto (HTTP 403). O app tenta um fallback
            automático; se persistir, desmarque Reddit e use as outras fontes.
          </Typography>
        )}
      </Alert>
    </Box>
  );
}

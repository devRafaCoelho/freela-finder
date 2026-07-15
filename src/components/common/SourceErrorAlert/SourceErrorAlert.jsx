import { Alert, AlertTitle, Box } from '@mui/material';

export function SourceErrorAlert({ errors }) {
  if (!errors?.length) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="warning">
        <AlertTitle>Algumas fontes falharam ou retornaram parcialmente</AlertTitle>
        {errors.map((err) => (
          <Box key={`${err.source}-${err.message}`} component="div">
            <strong>{err.source}:</strong> {err.message}
          </Box>
        ))}
      </Alert>
    </Box>
  );
}

import { Box, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export function EmptyState({ message }) {
  return (
    <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
      <SearchOffIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
      <Typography>{message}</Typography>
    </Box>
  );
}

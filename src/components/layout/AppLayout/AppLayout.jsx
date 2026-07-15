import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import RadarIcon from '@mui/icons-material/Radar';

export function AppLayout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <RadarIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="h1" fontWeight={700}>
            Freela Finder
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}

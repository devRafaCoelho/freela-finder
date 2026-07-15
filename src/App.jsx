import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppLayout } from './components/layout/AppLayout/AppLayout';
import { AppRouter } from './router/AppRouter';
import { SnackbarProvider } from './context/SnackbarProvider';
import { theme } from './theme/theme';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AppLayout>
          <AppRouter />
        </AppLayout>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

import { SnackbarProvider as NotistackProvider } from 'notistack';

export function SnackbarProvider({ children }) {
  return (
    <NotistackProvider maxSnack={3} autoHideDuration={3000}>
      {children}
    </NotistackProvider>
  );
}

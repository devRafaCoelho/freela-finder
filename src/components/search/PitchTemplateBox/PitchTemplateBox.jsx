import { TextField } from '@mui/material';

export function PitchTemplateBox({ value, onChange }) {
  return (
    <TextField
      label="Template de pitch (opcional)"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      multiline
      minRows={3}
      fullWidth
      helperText="Salvo localmente. Use ao copiar mensagem para contato."
    />
  );
}

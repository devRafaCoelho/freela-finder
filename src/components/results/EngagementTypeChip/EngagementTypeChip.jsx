import { Chip, Tooltip } from '@mui/material';

const TYPE_CONFIG = {
  freela: { label: 'Freela', color: 'success' },
  emprego: { label: 'Emprego', color: 'default' },
  indefinido: { label: 'Indefinido', color: 'warning' },
};

export function EngagementTypeChip({ type, signals = [] }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.indefinido;
  const tooltip = signals.length > 0 ? signals.join(', ') : config.label;

  return (
    <Tooltip title={tooltip}>
      <Chip size="small" color={config.color} label={config.label} variant="outlined" />
    </Tooltip>
  );
}

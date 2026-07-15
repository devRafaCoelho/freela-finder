import { Chip } from '@mui/material';

const TIER_COLOR = {
  high: 'success',
  medium: 'warning',
  low: 'default',
};

const TIER_LABEL = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
};

export function MatchTierChip({ tier, score }) {
  return (
    <Chip
      size="small"
      color={TIER_COLOR[tier] || 'default'}
      label={`${TIER_LABEL[tier] || tier} · ${score}`}
    />
  );
}

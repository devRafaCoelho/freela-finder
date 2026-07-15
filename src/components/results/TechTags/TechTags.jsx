import { Stack, Chip } from '@mui/material';

export function TechTags({ technologies }) {
  if (!technologies?.length) return null;

  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
      {technologies.map((tech) => (
        <Chip key={tech} label={tech} size="small" variant="outlined" />
      ))}
    </Stack>
  );
}

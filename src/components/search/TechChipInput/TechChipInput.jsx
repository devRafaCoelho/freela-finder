import { Autocomplete, Chip, TextField } from '@mui/material';

export function TechChipInput({ label, value, onChange, suggestions, helperText }) {
  return (
    <Autocomplete
      multiple
      freeSolo
      options={suggestions}
      value={value}
      onChange={(_, newValue) => onChange(newValue.map((v) => v.toLowerCase().trim()).filter(Boolean))}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return <Chip key={key} label={option} size="small" {...tagProps} />;
        })
      }
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="Digite e pressione Enter" helperText={helperText} />
      )}
    />
  );
}

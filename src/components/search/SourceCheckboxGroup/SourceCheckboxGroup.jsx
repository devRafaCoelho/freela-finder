import { FormControl, FormControlLabel, FormGroup, FormLabel, Checkbox } from '@mui/material';
import { SOURCES } from '../../../config/sources';

export function SourceCheckboxGroup({ value, onChange }) {
  const toggle = (sourceId) => {
    if (value.includes(sourceId)) {
      onChange(value.filter((id) => id !== sourceId));
    } else {
      onChange([...value, sourceId]);
    }
  };

  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend">Fontes</FormLabel>
      <FormGroup row>
        {SOURCES.map((source) => (
          <FormControlLabel
            key={source.id}
            control={
              <Checkbox
                checked={value.includes(source.id)}
                onChange={() => toggle(source.id)}
              />
            }
            label={source.label}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}

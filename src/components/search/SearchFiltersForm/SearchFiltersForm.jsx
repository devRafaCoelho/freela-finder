import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
  LinearProgress,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TechChipInput } from '../TechChipInput/TechChipInput';
import { IntentTermsInput } from '../IntentTermsInput/IntentTermsInput';
import { SourceCheckboxGroup } from '../SourceCheckboxGroup/SourceCheckboxGroup';
import { PitchTemplateBox } from '../PitchTemplateBox/PitchTemplateBox';
import { DEFAULT_TECH_SUGGESTIONS } from '../../../config/defaultTechSuggestions';

export function SearchFiltersForm({ form, onSubmit, loading }) {
  const { register, watch, setValue, handleSubmit, formState } = form;
  const values = watch();

  return (
    <Paper sx={{ p: 3, mb: 3 }} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" gutterBottom>
        Filtros de busca
      </Typography>

      <Stack spacing={2}>
        <TechChipInput
          label="Tecnologias incluir *"
          value={values.includeTech}
          onChange={(v) => setValue('includeTech', v, { shouldValidate: true })}
          suggestions={DEFAULT_TECH_SUGGESTIONS}
          helperText="Resultado precisa mencionar ao menos uma (modo estrito)."
        />
        <TechChipInput
          label="Tecnologias excluir"
          value={values.excludeTech}
          onChange={(v) => setValue('excludeTech', v)}
          suggestions={DEFAULT_TECH_SUGGESTIONS}
          helperText="Descarta se aparecer no título ou descrição."
        />
        <IntentTermsInput
          value={values.intentTerms}
          onChange={(v) => setValue('intentTerms', v)}
        />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField label="Palavra-chave extra" fullWidth {...register('keyword')} />
          <TextField
            label="Idade máxima (dias)"
            type="number"
            fullWidth
            {...register('maxAgeDays', { valueAsNumber: true })}
          />
          <TextField
            label="Score mínimo"
            type="number"
            fullWidth
            {...register('minMatchScore', { valueAsNumber: true })}
          />
        </Stack>
        <FormControlLabel
          control={
            <Switch
              checked={values.prioritizeFreela}
              onChange={(e) => setValue('prioritizeFreela', e.target.checked)}
            />
          }
          label="Priorizar freela (pontua contratos e pedidos informais)"
        />
        <FormControlLabel
          control={
            <Switch
              checked={values.excludeFullTime}
              onChange={(e) => setValue('excludeFullTime', e.target.checked)}
            />
          }
          label="Excluir vagas CLT / full-time"
        />
        <FormControlLabel
          control={
            <Switch
              checked={values.strictMode}
              onChange={(e) => setValue('strictMode', e.target.checked)}
            />
          }
          label="Modo estrito (descarta anúncios sem stack incluída)"
        />
        <SourceCheckboxGroup
          value={values.sources}
          onChange={(v) => setValue('sources', v)}
        />
        <PitchTemplateBox
          value={values.pitchTemplate}
          onChange={(v) => setValue('pitchTemplate', v)}
        />
      </Stack>

      {formState.errors.includeTech && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {formState.errors.includeTech.message}
        </Typography>
      )}

      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={<SearchIcon />}
          disabled={loading}
        >
          Buscar oportunidades
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mt: 2 }} />}
    </Paper>
  );
}

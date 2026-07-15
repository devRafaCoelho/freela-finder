import { TechChipInput } from '../TechChipInput/TechChipInput';

export function IntentTermsInput({ value, onChange }) {
  return (
    <TechChipInput
      label="Termos de intenção"
      value={value}
      onChange={onChange}
      suggestions={[
        'preciso de dev',
        'busco desenvolvedor',
        'contratar programador',
        'need a developer',
        'hiring developer',
      ]}
      helperText="Usados na busca (ex.: Reddit). Não substituem o filtro de tecnologia."
    />
  );
}

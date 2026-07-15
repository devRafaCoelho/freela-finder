export const SOURCES = [
  { id: 'reddit', label: 'Reddit', hint: 'Melhor para freela (requer Vercel em produção)' },
  { id: 'remoteok', label: 'RemoteOK', hint: 'Vagas remotas — filtradas por tipo' },
  { id: 'remotive', label: 'Remotive', hint: 'Vagas remotas — filtradas por tipo' },
  { id: 'arbeitnow', label: 'Arbeitnow', hint: 'Vagas remotas — filtradas por tipo' },
];

export const SOURCE_IDS = SOURCES.map((s) => s.id);

export const FREELA_FIRST_SOURCE_IDS = ['reddit', 'remoteok', 'remotive', 'arbeitnow'];

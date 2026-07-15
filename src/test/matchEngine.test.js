import { describe, expect, it } from 'vitest';
import { applyMatchEngine } from '../engines/matchEngine';

const baseParams = {
  includeTech: ['node'],
  excludeTech: ['python'],
  strictMode: true,
  minMatchScore: 0,
  intentTerms: [],
  maxAgeDays: 90,
};

function makeOpp(overrides) {
  return {
    id: '1',
    title: 'Dev',
    description: '',
    url: 'https://example.com/1',
    source: 'remoteok',
    sourceLabel: 'RemoteOK',
    publishedAt: new Date().toISOString(),
    technologies: [],
    intentSignals: [],
    matchScore: 0,
    tier: 'low',
    excludedReason: null,
    ...overrides,
  };
}

describe('matchEngine', () => {
  it('exclui oportunidade com python quando excludeTech inclui python', () => {
    const opps = [
      makeOpp({
        id: 'py',
        title: 'Desenvolvedor Python Django',
        description: 'Projeto web',
        url: 'https://example.com/py',
      }),
    ];

    const { opportunities } = applyMatchEngine(opps, baseParams);
    expect(opportunities).toHaveLength(0);
  });

  it('inclui oportunidade com node no título', () => {
    const opps = [
      makeOpp({
        id: 'node',
        title: 'Backend Node.js Developer',
        url: 'https://example.com/node',
      }),
    ];

    const { opportunities } = applyMatchEngine(opps, baseParams);
    expect(opportunities).toHaveLength(1);
    expect(opportunities[0].technologies).toContain('node');
  });

  it('modo estrito descarta anúncio sem stack incluída', () => {
    const opps = [
      makeOpp({
        id: 'generic',
        title: 'Preciso de um dev para meu projeto',
        description: 'Me chama no WhatsApp',
        url: 'https://example.com/generic',
      }),
    ];

    const { opportunities, stats } = applyMatchEngine(opps, baseParams);
    expect(opportunities).toHaveLength(0);
    expect(stats.excludedByScore).toBeGreaterThan(0);
  });

  it('reconhece sinônimo nodejs como node', () => {
    const opps = [
      makeOpp({
        id: 'nodejs',
        title: 'Senior NodeJS Engineer',
        url: 'https://example.com/nodejs',
      }),
    ];

    const { opportunities } = applyMatchEngine(opps, baseParams);
    expect(opportunities).toHaveLength(1);
  });
});

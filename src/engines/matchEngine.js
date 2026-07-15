import dayjs from 'dayjs';
import { dedupeByUrl } from './dedupe';
import { getSynonyms } from './techSynonyms';
import {
  detectIntentSignals,
  extractTechnologiesFromText,
  getOpportunityFullText,
} from '../utils/techExtract';
import { wordMatch } from '../utils/textMatch';

const SOURCE_PRIORITY = {
  reddit: 5,
  remoteok: 3,
  remotive: 3,
  arbeitnow: 3,
};

function toTier(score) {
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

function containsExcludedTech(text, excludeList) {
  return excludeList.some((tech) =>
    getSynonyms(tech).some((syn) => wordMatch(text, syn)),
  );
}

function countIncludedMatches(text, includeList) {
  let score = 0;
  const matched = [];

  for (const tech of includeList) {
    const synonyms = getSynonyms(tech);
    const inTitle = synonyms.some((syn) => wordMatch(text, syn));
    if (inTitle) {
      matched.push(tech);
      score += 25;
    }
  }

  return { score: Math.min(score, 80), matched };
}

function isTooOld(publishedAt, maxAgeDays) {
  if (!publishedAt || !maxAgeDays) return false;
  return dayjs().diff(dayjs(publishedAt), 'day') > maxAgeDays;
}

export function scoreOpportunity(opportunity, params) {
  const fullText = getOpportunityFullText(opportunity);
  const titleText = `${opportunity.title || ''}`;
  const technologies = extractTechnologiesFromText(
    titleText,
    opportunity.description,
    ...(opportunity.technologies || []),
  );

  let excludedReason = null;

  if (containsExcludedTech(fullText, params.excludeTech || [])) {
    excludedReason = 'exclude_tech';
  }

  if (!excludedReason && isTooOld(opportunity.publishedAt, params.maxAgeDays)) {
    excludedReason = 'max_age';
  }

  if (excludedReason) {
    return {
      ...opportunity,
      technologies,
      intentSignals: detectIntentSignals(opportunity, params.intentTerms || []),
      matchScore: 0,
      tier: 'low',
      excludedReason,
    };
  }

  let matchScore = 0;

  const titleMatches = countIncludedMatches(titleText, params.includeTech || []);
  matchScore += Math.min(titleMatches.score, 40) * 2;

  const descMatches = countIncludedMatches(
    opportunity.description || '',
    params.includeTech || [],
  );
  matchScore += Math.min(descMatches.score, 30);

  const allMatched = new Set([...titleMatches.matched, ...descMatches.matched, ...technologies]);
  const hasIncludeMatch = allMatched.size > 0;

  if (hasIncludeMatch) {
    matchScore += 10;
  }

  const intentSignals = detectIntentSignals(opportunity, params.intentTerms || []);
  if (intentSignals.length > 0) {
    matchScore += 20;
  }

  if (params.keyword && wordMatch(fullText, params.keyword)) {
    matchScore += 10;
  }

  if (opportunity.publishedAt && dayjs().diff(dayjs(opportunity.publishedAt), 'hour') < 24) {
    matchScore += 10;
  }

  matchScore += SOURCE_PRIORITY[opportunity.source] || 0;

  matchScore = Math.min(100, matchScore);

  if (params.strictMode && !hasIncludeMatch) {
    excludedReason = 'no_include_match';
  }

  return {
    ...opportunity,
    technologies: [...allMatched],
    intentSignals,
    matchScore,
    tier: toTier(matchScore),
    excludedReason,
  };
}

export function applyMatchEngine(opportunities, params) {
  const stats = {
    totalFetched: opportunities.length,
    afterDedupe: 0,
    excludedByTech: 0,
    excludedByAge: 0,
    excludedByScore: 0,
    finalCount: 0,
    sourceErrors: [],
  };

  const deduped = dedupeByUrl(opportunities);
  stats.afterDedupe = deduped.length;

  const scored = deduped
    .map((opp) => scoreOpportunity(opp, params))
    .filter((opp) => {
      if (opp.excludedReason === 'exclude_tech') {
        stats.excludedByTech++;
        return false;
      }
      if (opp.excludedReason === 'max_age') {
        stats.excludedByAge++;
        return false;
      }
      if (opp.excludedReason === 'no_include_match') {
        stats.excludedByScore++;
        return false;
      }
      if (opp.matchScore < (params.minMatchScore ?? 0)) {
        stats.excludedByScore++;
        return false;
      }
      return true;
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  stats.finalCount = scored.length;

  return { opportunities: scored, stats };
}

import { wordMatch } from '../utils/textMatch';

const EXPLICIT_FREELANCE_TERMS = [
  'freelance',
  'freelancer',
  'freela',
  'contractor',
  'contract',
  'part-time',
  'part time',
  'gig',
  'project based',
  'por projeto',
  'pj',
  'for hire',
  'short term',
  'hourly',
  'por hora',
  'consultoria',
];

const INTENT_FREELANCE_TERMS = [
  'preciso de dev',
  'preciso de um dev',
  'preciso de desenvolvedor',
  'busco desenvolvedor',
  'busco dev',
  'contratar programador',
  'mvp',
];

const STRONG_EMPLOYMENT_TERMS = [
  'full-time',
  'full time',
  'permanent',
  'clt',
  'benefits',
  'health insurance',
  'health care',
  'equity',
  'annual salary',
  'salary range',
  'w2',
  'join our team',
  'staff engineer',
  'engineering manager',
];

function hasAny(text, terms) {
  return terms.filter((term) => wordMatch(text, term));
}

export function analyzeEngagementType(opportunity) {
  const title = opportunity.title || '';
  const description = opportunity.description || '';
  const jobType = opportunity.jobType || '';
  const fullText = `${title} ${description} ${jobType}`;

  const freelanceSignals = hasAny(fullText, [
    ...EXPLICIT_FREELANCE_TERMS,
    ...INTENT_FREELANCE_TERMS,
  ]);
  const strongEmploymentSignals = hasAny(fullText, STRONG_EMPLOYMENT_TERMS);
  const explicitFreelance = freelanceSignals.some((s) =>
    EXPLICIT_FREELANCE_TERMS.includes(s),
  );

  let freelanceScore = freelanceSignals.length * 2;
  let employmentScore = strongEmploymentSignals.length * 2;

  if (opportunity.source === 'reddit') {
    freelanceScore += 4;
  }

  if (/^\[for hire\]/i.test(title) || /^\[hiring\]/i.test(title)) {
    freelanceScore += 8;
  }

  let type = 'indefinido';

  if (explicitFreelance || freelanceScore >= 6) {
    type = 'freela';
  } else if (strongEmploymentSignals.length >= 1 && !explicitFreelance) {
    type = 'emprego';
  } else if (opportunity.source === 'reddit') {
    type = 'freela';
  }

  return {
    type,
    freelanceScore,
    employmentScore,
    signals: freelanceSignals,
    employmentSignals: strongEmploymentSignals,
    isStrongEmployment: strongEmploymentSignals.length > 0 && !explicitFreelance,
  };
}

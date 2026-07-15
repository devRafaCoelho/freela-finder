import { wordMatch } from '../utils/textMatch';

const JOB_BOARD_SOURCES = ['remoteok', 'remotive', 'arbeitnow'];

const EXPLICIT_FREELANCE_TERMS = [
  'freelance',
  'freelancer',
  'freela',
  'contractor',
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
];

const FREELANCE_TERMS = [
  ...EXPLICIT_FREELANCE_TERMS,
  'preciso de dev',
  'preciso de um dev',
  'preciso de desenvolvedor',
  'busco desenvolvedor',
  'busco dev',
  'contratar programador',
  'consultoria',
  'mvp',
];

const EMPLOYMENT_TERMS = [
  'full-time',
  'full time',
  'permanent',
  'staff engineer',
  'staff software',
  'clt',
  'benefits',
  'health insurance',
  'health care',
  'equity',
  'annual salary',
  'salary range',
  'w2',
  'head of',
  'director of',
  'vice president',
  'employee',
  'join our team',
  'we are hiring',
];

const STRONG_EMPLOYMENT_TITLE = [
  'senior engineer',
  'senior software',
  'staff engineer',
  'principal engineer',
  'engineering manager',
  'product engineer',
  'software engineer',
  'backend engineer',
  'frontend engineer',
  'full stack engineer',
  'data analyst',
  'analyst',
  'drafter',
  'designer',
  'manager',
];

function hasExplicitFreelanceSignal(signals) {
  return signals.some((signal) => EXPLICIT_FREELANCE_TERMS.includes(signal));
}

export function analyzeEngagementType(opportunity) {
  const title = opportunity.title || '';
  const description = opportunity.description || '';
  const jobType = opportunity.jobType || '';
  const fullText = `${title} ${description} ${jobType}`;
  const isJobBoard = JOB_BOARD_SOURCES.includes(opportunity.source);

  const freelanceSignals = FREELANCE_TERMS.filter((term) => wordMatch(fullText, term));
  const employmentSignals = EMPLOYMENT_TERMS.filter((term) => wordMatch(fullText, term));
  const strongTitleEmployment = STRONG_EMPLOYMENT_TITLE.some((term) =>
    wordMatch(title, term),
  );

  let freelanceScore = freelanceSignals.length * 2;
  let employmentScore = employmentSignals.length * 2;

  if (opportunity.source === 'reddit') {
    freelanceScore += 3;
  }

  if (isJobBoard) {
    employmentScore += 2;
  }

  if (strongTitleEmployment && !hasExplicitFreelanceSignal(freelanceSignals)) {
    employmentScore += 4;
  }

  if (/^\[for hire\]/i.test(title) || /^\[hiring\]/i.test(title)) {
    freelanceScore += 6;
  }

  let type = 'indefinido';

  if (hasExplicitFreelanceSignal(freelanceSignals)) {
    type = 'freela';
  } else if (employmentScore > freelanceScore && employmentScore >= 2) {
    type = 'emprego';
  } else if (opportunity.source === 'reddit' && freelanceScore >= 2) {
    type = 'freela';
  } else if (isJobBoard) {
    type = 'emprego';
  } else if (employmentScore >= 4 || strongTitleEmployment) {
    type = 'emprego';
  }

  return {
    type,
    freelanceScore,
    employmentScore,
    signals: freelanceSignals,
    employmentSignals,
  };
}

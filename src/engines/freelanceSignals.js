import { wordMatch } from '../utils/textMatch';

const FREELANCE_TERMS = [
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
  'preciso de dev',
  'preciso de um dev',
  'preciso de desenvolvedor',
  'busco desenvolvedor',
  'busco dev',
  'contratar programador',
  'for hire',
  '[hiring]',
  'hiring',
  'consultoria',
  'mvp',
  'short term',
  'hourly',
  'por hora',
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
];

export function analyzeEngagementType(opportunity) {
  const title = opportunity.title || '';
  const description = opportunity.description || '';
  const jobType = opportunity.jobType || '';
  const fullText = `${title} ${description} ${jobType}`;

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

  if (strongTitleEmployment && freelanceSignals.length === 0) {
    employmentScore += 3;
  }

  if (/^\[for hire\]/i.test(title) || /^\[hiring\]/i.test(title)) {
    freelanceScore += 4;
  }

  let type = 'indefinido';

  if (freelanceScore > employmentScore && freelanceScore >= 2) {
    type = 'freela';
  } else if (employmentScore > freelanceScore && employmentScore >= 2) {
    type = 'emprego';
  } else if (freelanceScore >= 2) {
    type = 'freela';
  } else if (employmentScore >= 4 || (strongTitleEmployment && employmentScore >= 2)) {
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

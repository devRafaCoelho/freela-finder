export function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s.#+]/g, ' ');
}

export function wordMatch(text, term) {
  const normalized = normalizeText(text);
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
  return pattern.test(` ${normalized} `);
}

export function containsAnyTerm(text, terms) {
  return terms.some((term) => wordMatch(text, term));
}

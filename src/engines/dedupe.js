export function dedupeByUrl(opportunities) {
  const seen = new Set();
  return opportunities.filter((opp) => {
    const key = (opp.url || opp.id || '').trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

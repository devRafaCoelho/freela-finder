export async function collectArbeitnow() {
  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const items = data?.data || [];

    return { source: 'arbeitnow', items, error: null };
  } catch (error) {
    return {
      source: 'arbeitnow',
      items: [],
      error: error.message || 'Falha ao buscar Arbeitnow',
    };
  }
}

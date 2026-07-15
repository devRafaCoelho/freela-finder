export async function collectRemotive() {
  try {
    const res = await fetch('https://remotive.com/api/remote-jobs?category=software-dev');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const items = data?.jobs || [];

    return { source: 'remotive', items, error: null };
  } catch (error) {
    return {
      source: 'remotive',
      items: [],
      error: error.message || 'Falha ao buscar Remotive',
    };
  }
}

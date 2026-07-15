export async function collectRemoteOk() {
  try {
    const res = await fetch('https://remoteok.com/api');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const items = Array.isArray(data) ? data.filter((item) => item.id) : [];

    return { source: 'remoteok', items, error: null };
  } catch (error) {
    return {
      source: 'remoteok',
      items: [],
      error: error.message || 'Falha ao buscar RemoteOK',
    };
  }
}

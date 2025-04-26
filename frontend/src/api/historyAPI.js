const API_BASE = process.env.REACT_APP_API_URL;

export async function getHistory() {
  const response = await fetch(`${API_BASE}/api/sunrise/history`);
  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }
  return response.json();
}

export async function clearHistory() {
  const response = await fetch(`${API_BASE}/api/sunrise/history`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to clear history');
  }
  return response.json();
}
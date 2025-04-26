export async function getHistory() {
    const response = await fetch('http://localhost:5050/api/sunrise/history');
  
    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }
  
    return response.json();
  }

  export async function clearHistory() {
    const response = await fetch('http://localhost:5050/api/sunrise/history', {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      throw new Error('Failed to clear history');
    }
  
    return response.json();
  }
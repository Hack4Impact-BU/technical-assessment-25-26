export async function getHistory() {
    const response = await fetch('http://localhost:5050/api/sunrise/history');
  
    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }
  
    return response.json();
  }
import { getToken } from './authenticate';

async function makeRequest(url, method = 'GET', body = null) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const config = { method, headers };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, config);
    if (!response.ok) throw new Error('Failed to fetch data');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function addToFavourites(id) {
  return await makeRequest(`/favourites/${id}`, 'PUT');
}

export async function removeFromFavourites(id) {
  return await makeRequest(`/favourites/${id}`, 'DELETE');
}

export async function getFavourites() {
  return await makeRequest('/favourites');
}

export async function addToHistory(id) {
  return await makeRequest(`/history/${id}`, 'PUT');
}

export async function removeFromHistory(id) {
  return await makeRequest(`/history/${id}`, 'DELETE');
}

export async function getHistory() {
  return await makeRequest('/history');
}

import { API_PROVIDER, BASE_URL } from './apiConfig';

// Check-in to a location
export async function checkInAPI(token: string, data: { placeName: string; latitude: number; longitude: number }) {
  const response = await fetch(`${BASE_URL}/checkin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData?.message || 'Check-in failed');
  return responseData;
}

// Check-out from a location
export async function checkOutAPI(token: string) {
  const response = await fetch(`${BASE_URL}/checkin/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const responseData = await response.json();
  if (!response.ok) throw new Error('Check-out failed');
  return responseData;
}

// Update location for auto-checkout detection
export async function updateLocationAPI(token: string, data: { latitude: number; longitude: number }) {
  const response = await fetch(`${BASE_URL}/checkin/update-location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  if (!response.ok) throw new Error('Location update failed');
  return responseData;
}

// Get online users at a place
export async function getOnlineUsersAPI(token: string, placeName: string) {
  const response = await fetch(`${BASE_URL}/checkin/online-at-place/${encodeURIComponent(placeName)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData?.message || 'Failed to fetch online users');
  return responseData;
}

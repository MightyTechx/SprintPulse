const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3600';

interface UserPreferences {
  theme: string;
  timezone: string | null;
  language: string | null;
  dateFormat: string | null;
  timeFormat: string | null;
  slaWorkingCalendar: string | null;
  slaExceptionGroup: string | null;
}

interface AuthApiResponse {
  data?: UserPreferences;
  message: string;
}

export async function getUserPreferences(): Promise<UserPreferences> {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${API_BASE_URL}/api/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: 'get-my-settings' }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get preferences');
  }

  const result: AuthApiResponse = await response.json();
  return (
    result.data || {
      theme: 'light',
      timezone: null,
      language: null,
      dateFormat: null,
      timeFormat: null,
      slaWorkingCalendar: null,
      slaExceptionGroup: null,
    }
  );
}

export async function updateUserPreferences(
  preferences: Partial<UserPreferences>,
): Promise<UserPreferences> {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${API_BASE_URL}/api/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: 'update-my-settings', data: preferences }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update preferences');
  }

  const result: AuthApiResponse = await response.json();
  return result.data as UserPreferences;
}

export async function updateUserTheme(themeName: string): Promise<UserPreferences> {
  return updateUserPreferences({ theme: themeName });
}

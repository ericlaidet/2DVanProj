// apps/web/src/api/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Universal API fetch function
 * @param path - API endpoint (e.g., '/plans')
 * @param options - Fetch options including body, method, headers
 */
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const res = await fetch(`${API_URL}${path}`, config);

    // Handle HTTP errors
    if (!res.ok) {
      let errorMessage = `Erreur ${res.status}`;
      try {
        const data = await res.json();

        // Extract error message from various backend formats
        if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (Array.isArray(data.message)) {
          errorMessage = data.message.join(', ');
        } else if (data.message?.message) {
          errorMessage = data.message.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
      } catch (parseError) {
        console.warn('Failed to parse error response:', parseError);
      }

      throw new Error(errorMessage);
    }

    // Return JSON if available
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return res.json();
    }

    // Handle PDF / Blob
    if (contentType.includes('application/pdf')) {
      return res.blob();
    }

    return res.text();
  } catch (error) {
    console.error('❌ API Fetch Error:', error);
    throw error;
  }
}

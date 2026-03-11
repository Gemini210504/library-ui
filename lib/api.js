const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Enhanced fetcher utility with timeout and better error handling.
 */
export async function apiFetch(endpoint, options = {}) {
  // 1. Ensure the URL doesn't have double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL.replace(/\/$/, '')}${cleanEndpoint}`;

  // 2. Add a Timeout (Next.js 16 best practice to avoid hanging Turbopack builds)
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000); // 8-second timeout

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config = {
    ...options,
    signal: controller.signal,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(id);

    // Handle 204 No Content
    if (response.status === 204) return null;

    // Clone response to handle cases where json() might fail
    const contentType = response.headers.get('content-type');
    let data = {};
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      // Improved error reporting
      const error = new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    clearTimeout(id);

    // Differentiate the "Failed to fetch" errors
    if (error.name === 'AbortError') {
      console.error('❌ API Timeout: The server took too long to respond.');
    } else if (error.message === 'Failed to fetch') {
      console.error('❌ Network Error: Is the backend at 8080 running? Check CORS settings.');
    } else {
      console.error('❌ API Fetch Error:', error.message);
    }
    
    throw error;
  }
}
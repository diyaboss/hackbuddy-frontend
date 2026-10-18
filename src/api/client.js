const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.error) errorMsg = errorData.error;
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      // Not JSON or empty
    }
    const error = new Error(errorMsg);
    error.status = response.status;
    throw error;
  }
  
  try {
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    return null; // Empty or non-JSON success response
  }
}

export async function fetchApi(endpoint, options = {}) {
  const controller = new AbortController();
  let timedOut = false;
  const abort = () => controller.abort();
  if (options.signal?.aborted) abort();
  options.signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 20000);

  try {
    const response = await fetch(BASE_URL + endpoint, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      credentials: 'include',
      signal: controller.signal,
    });
    return await handleResponse(response);
  } catch (err) {
    if (timedOut) {
      throw new Error('The HackBuddy server is taking too long to respond. Please try again shortly.');
    }
    if (err.name === 'TypeError' || err.message === 'Failed to fetch') {
      throw new Error("Couldn't reach the HackBuddy server. Please try again shortly.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abort);
  }
}

export const fetchApiWithAuth = fetchApi;

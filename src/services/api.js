/**
 * Centralized API Client for NOVA PANEL
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  getToken() {
    return localStorage.getItem('nova_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('nova_token', token);
    } else {
      localStorage.removeItem('nova_token');
    }
  }

  getHeaders(customHeaders = {}, isFormData = false) {
    const headers = {
      ...customHeaders,
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const headers = this.getHeaders(options.headers, isFormData);

    const config = {
      ...options,
      headers,
    };


    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      // Enhance network or connection errors
      if (!error.status && error.name === 'TypeError') {
        const networkError = new Error('Unable to connect to NOVA PANEL server. Please ensure the backend is running.');
        networkError.status = 0;
        throw networkError;
      }
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });

    const queryString = query.toString();
    const finalEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(finalEndpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  upload(endpoint, formData, method = 'POST') {
    return this.request(endpoint, {
      method,
      body: formData,
    });
  }
}

export const api = new ApiClient(BASE_URL);
export default api;

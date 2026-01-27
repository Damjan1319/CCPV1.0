const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Get auth token from sessionStorage
function getToken(): string | null {
  return sessionStorage.getItem('auth_token');
}

// Set auth token
export function setToken(token: string) {
  sessionStorage.setItem('auth_token', token);
}

// Remove auth token
export function removeToken() {
  sessionStorage.removeItem('auth_token');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

// API request helper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Unauthorized - remove token and redirect to login
      removeToken();
      throw new Error('Authentication required');
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(`Cannot connect to server. Make sure backend is running on ${API_URL}`);
    }
    throw error;
  }
}

// Auth API
export const authAPI = {
  register: async (email: string) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  login: async (email: string, password: string) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  logout: () => {
    removeToken();
  },
};

// Alerts API
export const alertsAPI = {
  getAll: async () => {
    const data = await apiRequest('/api/alerts');
    return data.alerts || [];
  },

  create: async (alertData: {
    productId: string;
    productName: string;
    productUrl: string;
    productImageUrl?: string;
    currentPrice: number;
    targetPrice: number;
    storeId?: string;
    storeName?: string;
    currency?: string;
  }) => {
    return apiRequest('/api/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  },

  delete: async (alertId: number) => {
    return apiRequest(`/api/alerts/${alertId}`, {
      method: 'DELETE',
    });
  },
};


import { User, MenuItem, Order } from '@/types';

const API_URL = 'http://localhost:5000/api';

// Helper function for API calls
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'حدث خطأ في الاتصال بالخادم');
  }
  
  return response.json();
};

// User API
export const userApi = {
  login: (email: string, password: string) => {
    return fetchAPI('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  register: (name: string, email: string, password: string) => {
    return fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role: 'customer' }),
    });
  },
  
  getAllUsers: () => {
    return fetchAPI('/users');
  },
  
  updateUser: (id: string, userData: Partial<User>) => {
    return fetchAPI(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  deleteUser: (id: string) => {
    return fetchAPI(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Product API
export const productApi = {
  getAllProducts: () => {
    return fetchAPI('/products');
  },
  
  getProductById: (id: string) => {
    return fetchAPI(`/products/${id}`);
  },
  
  createProduct: (product: Omit<MenuItem, 'id'>) => {
    return fetchAPI('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },
  
  updateProduct: (id: string, product: Partial<MenuItem>) => {
    return fetchAPI(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },
  
  deleteProduct: (id: string) => {
    return fetchAPI(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Order API
export const orderApi = {
  getAllOrders: () => {
    return fetchAPI('/orders');
  },
  
  getCustomerOrders: (customerId: string) => {
    return fetchAPI(`/orders/customer/${customerId}`);
  },
  
  createOrder: (orderData: any) => {
    return fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  
  updateOrderStatus: (id: string, status: Order['status']) => {
    return fetchAPI(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

export default {
  user: userApi,
  product: productApi,
  order: orderApi,
};

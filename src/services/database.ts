
import { User, MenuItem, Order, UserRole } from '@/types';
import api from './api';

// Database operations now use the API
const db = {
  // Users
  getUsers: async (): Promise<User[]> => {
    try {
      return await api.user.getAllUsers();
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },
  
  getUserById: async (id: string): Promise<User | undefined> => {
    try {
      const users = await db.getUsers();
      return users.find(user => user.id === id);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return undefined;
    }
  },
  
  getUserByEmail: async (email: string): Promise<User | undefined> => {
    try {
      const users = await db.getUsers();
      return users.find(user => user.email === email);
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return undefined;
    }
  },
  
  addUser: async (user: Omit<User, 'id'>): Promise<User> => {
    try {
      return await api.user.register(user.name, user.email, 'defaultPassword');
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },
  
  updateUser: async (id: string, updates: Partial<User>): Promise<User | null> => {
    try {
      return await api.user.updateUser(id, updates);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  },
  
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      await api.user.deleteUser(id);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  },

  // Products
  getProducts: async (): Promise<MenuItem[]> => {
    try {
      return await api.product.getAllProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  
  getProductById: async (id: string): Promise<MenuItem | undefined> => {
    try {
      return await api.product.getProductById(id);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return undefined;
    }
  },
  
  addProduct: async (product: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    try {
      return await api.product.createProduct(product);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },
  
  updateProduct: async (id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> => {
    try {
      return await api.product.updateProduct(id, updates);
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  },
  
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      await api.product.deleteProduct(id);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    try {
      return await api.order.getAllOrders();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },
  
  getOrderById: async (id: string): Promise<Order | undefined> => {
    try {
      const orders = await db.getOrders();
      return orders.find(order => order.id === id);
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      return undefined;
    }
  },
  
  getOrdersByCustomerId: async (customerId: string): Promise<Order[]> => {
    try {
      return await api.order.getCustomerOrders(customerId);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      return [];
    }
  },
  
  addOrder: async (order: Omit<Order, 'id'>): Promise<Order> => {
    try {
      return await api.order.createOrder(order);
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },
  
  updateOrder: async (id: string, updates: Partial<Order>): Promise<Order | null> => {
    try {
      if (updates.status) {
        await api.order.updateOrderStatus(id, updates.status);
      }
      
      // For now, we only support updating status
      // Get the updated order
      const orders = await db.getOrders();
      const updatedOrder = orders.find(order => order.id === id);
      return updatedOrder || null;
    } catch (error) {
      console.error('Error updating order:', error);
      return null;
    }
  },
  
  deleteOrder: async (id: string): Promise<boolean> => {
    try {
      // Not implemented in API yet
      console.error('Delete order not implemented');
      return false;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  },
};

export default db;

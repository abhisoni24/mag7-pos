import { apiRequest } from './queryClient';

// Auth API
export const login = async (email: string, password: string, role?: string) => {
  const res = await apiRequest('POST', '/api/auth/login', { email, password, role });
  return res.json();
};

export const getProfile = async () => {
  const res = await apiRequest('GET', '/api/auth/profile');
  return res.json();
};

// Table API
export const getTables = async (params?: { status?: string, floor?: number, waiterId?: string }) => {
  let url = '/api/tables';
  if (params) {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.floor) queryParams.append('floor', params.floor.toString());
    if (params.waiterId) queryParams.append('waiterId', params.waiterId);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
  }
  
  const res = await apiRequest('GET', url);
  return res.json();
};

export const getTable = async (id: string) => {
  const res = await apiRequest('GET', `/api/tables/${id}`);
  return res.json();
};

export const createTable = async (data: { number: number, capacity: number, floor?: number }) => {
  const res = await apiRequest('POST', '/api/tables', data);
  return res.json();
};

export const updateTable = async (id: string, data: any) => {
  const res = await apiRequest('PUT', `/api/tables/${id}`, data);
  return res.json();
};

// Menu API
export const getMenuItems = async (category?: string) => {
  let url = '/api/menu';
  if (category) {
    url += `?category=${category}`;
  }
  
  const res = await apiRequest('GET', url);
  return res.json();
};

export const getMenuItem = async (id: string) => {
  const res = await apiRequest('GET', `/api/menu/${id}`);
  return res.json();
};

export const createMenuItem = async (data: any) => {
  const res = await apiRequest('POST', '/api/menu', data);
  return res.json();
};

export const updateMenuItem = async (id: string, data: any) => {
  const res = await apiRequest('PUT', `/api/menu/${id}`, data);
  return res.json();
};

export const deleteMenuItem = async (id: string) => {
  const res = await apiRequest('DELETE', `/api/menu/${id}`);
  return res.json();
};

// Order API
export const getOrders = async (params?: { status?: string, tableId?: string, waiterId?: string }) => {
  let url = '/api/orders';
  if (params) {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.tableId) queryParams.append('tableId', params.tableId);
    if (params.waiterId) queryParams.append('waiterId', params.waiterId);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
  }
  
  const res = await apiRequest('GET', url);
  return res.json();
};

export const getOrder = async (id: string) => {
  const res = await apiRequest('GET', `/api/orders/${id}`);
  return res.json();
};

export const createOrder = async (data: { tableId: string, waiterId?: string, items?: any[] }) => {
  const res = await apiRequest('POST', '/api/orders', data);
  return res.json();
};

export const updateOrderStatus = async (id: string, status: string) => {
  const res = await apiRequest('PUT', `/api/orders/${id}/status`, { status });
  return res.json();
};

export const addItemToOrder = async (orderId: string, item: any) => {
  const res = await apiRequest('POST', `/api/orders/${orderId}/items`, item);
  return res.json();
};

export const updateOrderItem = async (orderId: string, itemId: string, updates: any) => {
  const res = await apiRequest('PUT', `/api/orders/${orderId}/items/${itemId}`, updates);
  return res.json();
};

// Staff API
export const getStaff = async (role?: string) => {
  let url = '/api/staff';
  if (role) {
    url += `?role=${role}`;
  }
  
  const res = await apiRequest('GET', url);
  return res.json();
};

export const getStaffMember = async (id: string) => {
  const res = await apiRequest('GET', `/api/staff/${id}`);
  return res.json();
};

export const createStaffMember = async (data: any) => {
  const res = await apiRequest('POST', '/api/staff', data);
  return res.json();
};

export const updateStaffMember = async (id: string, data: any) => {
  const res = await apiRequest('PUT', `/api/staff/${id}`, data);
  return res.json();
};

export const deleteStaffMember = async (id: string) => {
  const res = await apiRequest('DELETE', `/api/staff/${id}`);
  return res.json();
};

// Payment API
export const createPayment = async (data: { orderId: string, amount: number, tip?: number, paymentMethod: string }) => {
  const res = await apiRequest('POST', '/api/payments', data);
  return res.json();
};

export const getPaymentByOrder = async (orderId: string) => {
  const res = await apiRequest('GET', `/api/payments?orderId=${orderId}`);
  return res.json();
};

// Report API
export const getItemOrderFrequency = async (startDate: string, endDate: string) => {
  const res = await apiRequest('GET', `/api/reports/item-frequency?startDate=${startDate}&endDate=${endDate}`);
  return res.json();
};

export const getRevenue = async (startDate: string, endDate: string) => {
  const res = await apiRequest('GET', `/api/reports/revenue?startDate=${startDate}&endDate=${endDate}`);
  return res.json();
};

export const getOrderStatistics = async (startDate: string, endDate: string) => {
  const res = await apiRequest('GET', `/api/reports/order-statistics?startDate=${startDate}&endDate=${endDate}`);
  return res.json();
};

// Admin API
export const registerUser = async (data: any) => {
  const res = await apiRequest('POST', '/api/admin/register', data);
  return res.json();
};

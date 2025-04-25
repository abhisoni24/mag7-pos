import { apiRequest } from "./queryClient";

/**
 * @function login
 * @description Authenticates a user with the provided credentials.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} [role] - The user's role (optional).
 * @returns {Promise<any>} - A promise that resolves with the login response.
 */
export const login = async (email: string, password: string, role?: string) => {
  const res = await apiRequest("POST", "/api/auth/login", {
    email,
    password,
    role,
  });
  return res.json();
};

/**
 * @function getProfile
 * @description Retrieves the user's profile information.
 * @returns {Promise<any>} - A promise that resolves with the user's profile data.
 */
export const getProfile = async () => {
  const res = await apiRequest("GET", "/api/auth/profile");
  return res.json();
};

/**
 * @function getTables
 * @description Retrieves a list of tables based on the provided parameters.
 * @param {object} [params] - An object containing filter parameters.
 * @param {string} [params.status] - The status of the tables to retrieve.
 * @param {number} [params.floor] - The floor number to filter tables by.
 * @param {string} [params.waiterId] - The ID of the waiter assigned to the tables.
 * @returns {Promise<any>} - A promise that resolves with the list of tables.
 */
export const getTables = async (params?: {
  status?: string;
  floor?: number;
  waiterId?: string;
}) => {
  let url = "/api/tables";
  if (params) {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.floor) queryParams.append("floor", params.floor.toString());
    if (params.waiterId) queryParams.append("waiterId", params.waiterId);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
  }

  const res = await apiRequest("GET", url);
  return res.json();
};

/**
 * @function getTable
 * @description Retrieves a single table by its ID.
 * @param {string} id - The ID of the table to retrieve.
 * @returns {Promise<any>} - A promise that resolves with the table data.
 */
export const getTable = async (id: string) => {
  const res = await apiRequest("GET", `/api/tables/${id}`);
  return res.json();
};

/**
 * @function createTable
 * @description Creates a new table with the provided data.
 * @param {object} data - The data for the new table.
 * @param {number} data.number - The table number.
 * @param {number} data.capacity - The table capacity.
 * @param {number} [data.floor] - The floor number (optional).
 * @returns {Promise<any>} - A promise that resolves with the created table data.
 */
export const createTable = async (data: {
  number: number;
  capacity: number;
  floor?: number;
}) => {
  const res = await apiRequest("POST", "/api/tables", data);
  return res.json();
};

/**
 * @function updateTable
 * @description Updates an existing table with the provided data.
 * @param {string} id - The ID of the table to update.
 * @param {object} data - The data to update the table with.
 * @returns {Promise<any>} - A promise that resolves with the updated table data.
 */
export const updateTable = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/tables/${id}`, data);
  return res.json();
};

/**
 * @function getMenuItems
 * @description Retrieves a list of menu items, optionally filtered by category.
 * @param {string} [category] - The category to filter menu items by (optional).
 * @returns {Promise<any>} - A promise that resolves with the list of menu items.
 */
export const getMenuItems = async (category?: string) => {
  let url = "/api/menu";
  if (category) {
    url += `?category=${category}`;
  }

  const res = await apiRequest("GET", url);
  return res.json();
};

/**
 * @function getMenuItem
 * @description Retrieves a single menu item by its ID.
 * @param {string} id - The ID of the menu item to retrieve.
 * @returns {Promise<any>} - A promise that resolves with the menu item data.
 */
export const getMenuItem = async (id: string) => {
  const res = await apiRequest("GET", `/api/menu/${id}`);
  return res.json();
};

/**
 * @function createMenuItem
 * @description Creates a new menu item with the provided data.
 * @param {object} data - The data for the new menu item.
 * @returns {Promise<any>} - A promise that resolves with the created menu item data.
 */
export const createMenuItem = async (data: any) => {
  const res = await apiRequest("POST", "/api/menu", data);
  return res.json();
};

/**
 * @function updateMenuItem
 * @description Updates an existing menu item with the provided data.
 * @param {string} id - The ID of the menu item to update.
 * @param {object} data - The data to update the menu item with.
 * @returns {Promise<any>} - A promise that resolves with the updated menu item data.
 */
export const updateMenuItem = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/menu/${id}`, data);
  return res.json();
};

/**
 * @function deleteMenuItem
 * @description Deletes a menu item by its ID.
 * @param {string} id - The ID of the menu item to delete.
 * @returns {Promise<any>} - A promise that resolves with the deletion response.
 */
export const deleteMenuItem = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/menu/${id}`);
  return res.json();
};

/**
 * @function getOrders
 * @description Retrieves a list of orders based on the provided parameters.
 * @param {object} [params] - An object containing filter parameters.
 * @param {string} [params.status] - The status of the orders to retrieve.
 * @param {string} [params.tableId] - The ID of the table to filter orders by.
 * @param {string} [params.waiterId] - The ID of the waiter assigned to the orders.
 * @returns {Promise<any>} - A promise that resolves with the list of orders.
 */
export const getOrders = async (params?: {
  status?: string;
  tableId?: string;
  waiterId?: string;
}) => {
  let url = "/api/orders";
  if (params) {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.tableId) queryParams.append("tableId", params.tableId);
    if (params.waiterId) queryParams.append("waiterId", params.waiterId);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
  }

  const res = await apiRequest("GET", url);
  return res.json();
};

/**
 * @function getOrder
 * @description Retrieves a single order by its ID.
 * @param {string} id - The ID of the order to retrieve.
 * @returns {Promise<any>} - A promise that resolves with the order data.
 */
export const getOrder = async (id: string) => {
  const res = await apiRequest("GET", `/api/orders/${id}`);
  return res.json();
};

/**
 * @function createOrder
 * @description Creates a new order with the provided data.
 * @param {object} data - The data for the new order.
 * @param {string} data.tableId - The ID of the table for the order.
 * @param {string} [data.waiterId] - The ID of the waiter assigned to the order (optional).
 * @param {any[]} [data.items] - The items included in the order (optional).
 * @returns {Promise<any>} - A promise that resolves with the created order data.
 */
export const createOrder = async (data: {
  tableId: string;
  waiterId?: string;
  items?: any[];
}) => {
  const res = await apiRequest("POST", "/api/orders", data);
  return res.json();
};

/**
 * @function updateOrderStatus
 * @description Updates the status of an existing order.
 * @param {string} id - The ID of the order to update.
 * @param {string} status - The new status for the order.
 * @returns {Promise<any>} - A promise that resolves with the updated order data.
 */
export const updateOrderStatus = async (id: string, status: string) => {
  const res = await apiRequest("PUT", `/api/orders/${id}/status`, { status });
  return res.json();
};

/**
 * @function addItemToOrder
 * @description Adds a new item to an existing order.
 * @param {string} orderId - The ID of the order to add the item to.
 * @param {object} item - The item to add to the order.
 * @returns {Promise<any>} - A promise that resolves with the updated order data.
 */
export const addItemToOrder = async (orderId: string, item: any) => {
  const res = await apiRequest("POST", `/api/orders/${orderId}/items`, item);
  return res.json();
};

/**
 * @function updateOrderItem
 * @description Updates an item in an existing order.
 * @param {string} orderId - The ID of the order containing the item.
 * @param {string} itemId - The ID of the item to update.
 * @param {object} updates - The updates to apply to the item.
 * @returns {Promise<any>} - A promise that resolves with the updated order data.
 */
export const updateOrderItem = async (
  orderId: string,
  itemId: string,
  updates: any
) => {
  const res = await apiRequest(
    "PUT",
    `/api/orders/${orderId}/items/${itemId}`,
    updates
  );
  return res.json();
};

/**
 * @function getStaff
 * @description Retrieves a list of staff members, optionally filtered by role.
 * @param {string} [role] - The role to filter staff members by (optional).
 * @returns {Promise<any>} - A promise that resolves with the list of staff members.
 */
export const getStaff = async (role?: string) => {
  let url = "/api/staff";
  if (role) {
    url += `?role=${role}`;
  }

  const res = await apiRequest("GET", url);
  return res.json();
};

/**
 * @function getStaffMember
 * @description Retrieves a single staff member by their ID.
 * @param {string} id - The ID of the staff member to retrieve.
 * @returns {Promise<any>} - A promise that resolves with the staff member data.
 */
export const getStaffMember = async (id: string) => {
  const res = await apiRequest("GET", `/api/staff/${id}`);
  return res.json();
};

/**
 * @function createStaffMember
 * @description Creates a new staff member with the provided data.
 * @param {object} data - The data for the new staff member.
 * @returns {Promise<any>} - A promise that resolves with the created staff member data.
 */
export const createStaffMember = async (data: any) => {
  const res = await apiRequest("POST", "/api/staff", data);
  return res.json();
};

/**
 * @function updateStaffMember
 * @description Updates an existing staff member with the provided data.
 * @param {string} id - The ID of the staff member to update.
 * @param {object} data - The data to update the staff member with.
 * @returns {Promise<any>} - A promise that resolves with the updated staff member data.
 */
export const updateStaffMember = async (id: string, data: any) => {
  const res = await apiRequest("PUT", `/api/staff/${id}`, data);
  return res.json();
};

/**
 * @function deleteStaffMember
 * @description Deletes a staff member by their ID.
 * @param {string} id - The ID of the staff member to delete.
 * @returns {Promise<any>} - A promise that resolves with the deletion response.
 */
export const deleteStaffMember = async (id: string) => {
  const res = await apiRequest("DELETE", `/api/staff/${id}`);
  return res.json();
};

/**
 * @function createPayment
 * @description Creates a new payment record.
 * @param {object} data - The data for the new payment.
 * @param {string} data.orderId - The ID of the order the payment is for.
 * @param {number} data.amount - The amount paid.
 * @param {number} [data.tip] - The tip amount (optional).
 * @param {string} data.paymentMethod - The payment method used.
 * @returns {Promise<any>} - A promise that resolves with the created payment data.
 */
export const createPayment = async (data: {
  orderId: string;
  amount: number;
  tip?: number;
  paymentMethod: string;
}) => {
  const res = await apiRequest("POST", "/api/payments", data);
  return res.json();
};

/**
 * @function getPaymentByOrder
 * @description Retrieves payment information for a specific order.
 * @param {string} orderId - The ID of the order to retrieve payment information for.
 * @returns {Promise<any>} - A promise that resolves with the payment data.
 */
export const getPaymentByOrder = async (orderId: string) => {
  const res = await apiRequest("GET", `/api/payments?orderId=${orderId}`);
  return res.json();
};

/**
 * @function getItemOrderFrequency
 * @description Retrieves the order frequency of items within a specified date range.
 * @param {string} startDate - The start date for the report.
 * @param {string} endDate - The end date for the report.
 * @returns {Promise<any>} - A promise that resolves with the item order frequency data.
 */
export const getItemOrderFrequency = async (
  startDate: string,
  endDate: string
) => {
  const res = await apiRequest(
    "GET",
    `/api/reports/item-frequency?startDate=${startDate}&endDate=${endDate}`
  );
  return res.json();
};

/**
 * @function getRevenue
 * @description Retrieves revenue data within a specified date range.
 * @param {string} startDate - The start date for the report.
 * @param {string} endDate - The end date for the report.
 * @returns {Promise<any>} - A promise that resolves with the revenue data.
 */
export const getRevenue = async (startDate: string, endDate: string) => {
  const res = await apiRequest(
    "GET",
    `/api/reports/revenue?startDate=${startDate}&endDate=${endDate}`
  );
  return res.json();
};

/**
 * @function getOrderStatistics
 * @description Retrieves order statistics within a specified date range.
 * @param {string} startDate - The start date for the report.
 * @param {string} endDate - The end date for the report.
 * @returns {Promise<any>} - A promise that resolves with the order statistics data.
 */
export const getOrderStatistics = async (
  startDate: string,
  endDate: string
) => {
  const res = await apiRequest(
    "GET",
    `/api/reports/order-statistics?startDate=${startDate}&endDate=${endDate}`
  );
  return res.json();
};

/**
 * @function registerUser
 * @description Registers a new user (Admin API).
 * @param {object} data - The data for the new user.
 * @returns {Promise<any>} - A promise that resolves with the registration response.
 */
export const registerUser = async (data: any) => {
  const res = await apiRequest("POST", "/api/admin/register", data);
  return res.json();
};

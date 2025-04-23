import { Request, Response } from 'express';
import { storage } from '../storage';
import { InsertOrder, InsertOrderItem, OrderStatus, TableStatus } from '@shared/schema';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { status, tableId, waiterId } = req.query;
    
    let orders;
    
    if (status) {
      orders = await storage.getOrdersByStatus(status as string);
    } else if (tableId) {
      orders = await storage.getOrdersByTable(tableId as string);
    } else if (waiterId) {
      orders = await storage.getOrdersByWaiter(waiterId as string);
    } else {
      orders = await storage.getOrders();
    }
    
    res.json({ orders });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const order = await storage.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ order });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { tableId, waiterId, items } = req.body;
    
    // Verify table exists and is occupied
    const table = await storage.getTable(tableId);
    
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    
    if (table.status !== TableStatus.OCCUPIED) {
      return res.status(400).json({ message: 'Cannot create order for a table that is not occupied' });
    }
    
    // Check if there's an existing active order for this table
    // Active orders: NEW, IN_PROGRESS, DONE, DELIVERED (not PAID or CANCELLED)
    const tableOrders = await storage.getOrdersByTable(tableId);
    const activeOrder = tableOrders.find(order => 
      order.status === OrderStatus.NEW || 
      order.status === OrderStatus.IN_PROGRESS || 
      order.status === OrderStatus.DONE || 
      order.status === OrderStatus.DELIVERED
    );
    
    let orderId: string;
    let createdOrder;
    
    if (activeOrder) {
      // Use existing order
      orderId = activeOrder._id as string;
      createdOrder = activeOrder;
    } else {
      // Create new order
      const newOrder: InsertOrder = {
        tableId,
        waiterId: waiterId || table.waiterId,
        status: OrderStatus.NEW
      };
      
      createdOrder = await storage.createOrder(newOrder);
      orderId = createdOrder._id as string;
    }
    
    // Add items to the order if provided
    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        await storage.addItemToOrder(orderId, item);
      }
      
      // Refresh order with items
      const updatedOrder = await storage.getOrder(orderId);
      res.status(201).json({ order: updatedOrder });
    } else {
      res.status(201).json({ order: createdOrder });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    if (!status || !Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }
    
    const updatedOrder = await storage.updateOrderStatus(orderId, status);
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ order: updatedOrder });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const addItemToOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const { menuItemId, quantity, price, notes } = req.body;
    
    // Verify menu item exists
    const menuItem = await storage.getMenuItem(menuItemId);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Verify order exists and is not paid
    const order = await storage.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status === OrderStatus.PAID) {
      return res.status(400).json({ message: 'Cannot add items to a paid order' });
    }
    
    // Add item to order
    const orderItem: InsertOrderItem = {
      menuItemId,
      quantity: quantity || 1,
      price: price || menuItem.price,
      notes,
      status: OrderStatus.NEW
    };
    
    const updatedOrder = await storage.addItemToOrder(orderId, orderItem);
    
    res.json({ order: updatedOrder });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const { orderId, itemId } = req.params;
    const updates = req.body;
    
    const updatedOrder = await storage.updateOrderItem(orderId, itemId, updates);
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order or item not found' });
    }
    
    res.json({ order: updatedOrder });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

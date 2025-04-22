import { Request, Response } from 'express';
import { storage } from '../storage';

export const getItemOrderFrequency = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD format.' });
    }
    
    const itemFrequency = await storage.getItemOrderFrequency(start, end);
    
    res.json({ itemFrequency });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const getRevenue = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD format.' });
    }
    
    const totalRevenue = await storage.getRevenueByDateRange(start, end);
    const payments = await storage.getPaymentsByDateRange(start, end);
    
    // Calculate revenue by payment method
    const revenueByMethod: Record<string, number> = {};
    payments.forEach(payment => {
      if (!revenueByMethod[payment.paymentMethod]) {
        revenueByMethod[payment.paymentMethod] = 0;
      }
      revenueByMethod[payment.paymentMethod] += payment.amount;
    });
    
    // Calculate total tips
    const totalTips = payments.reduce((sum, payment) => sum + payment.tip, 0);
    
    // Daily revenue
    const dailyRevenue: Record<string, number> = {};
    payments.forEach(payment => {
      const dateStr = payment.paymentDate.toISOString().split('T')[0];
      if (!dailyRevenue[dateStr]) {
        dailyRevenue[dateStr] = 0;
      }
      dailyRevenue[dateStr] += payment.amount;
    });
    
    res.json({ 
      totalRevenue,
      revenueByMethod,
      totalTips,
      dailyRevenue
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const getOrderStatistics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD format.' });
    }
    
    const orders = await storage.getOrdersByDateRange(start, end);
    
    // Calculate order statistics
    const totalOrders = orders.length;
    
    // Count orders by status
    const ordersByStatus: Record<string, number> = {};
    orders.forEach(order => {
      if (!ordersByStatus[order.status]) {
        ordersByStatus[order.status] = 0;
      }
      ordersByStatus[order.status]++;
    });
    
    // Calculate average order amount
    let totalAmount = 0;
    for (const order of orders) {
      // Calculate order total from items
      const orderTotal = order.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      totalAmount += orderTotal;
    }
    const averageOrderAmount = totalOrders > 0 ? totalAmount / totalOrders : 0;
    
    // Orders by day of week
    const ordersByDayOfWeek: Record<string, number> = {
      'Sunday': 0,
      'Monday': 0,
      'Tuesday': 0,
      'Wednesday': 0,
      'Thursday': 0,
      'Friday': 0,
      'Saturday': 0
    };
    
    orders.forEach(order => {
      const dayOfWeek = new Date(order.createdAt).toLocaleString('en-US', { weekday: 'long' });
      ordersByDayOfWeek[dayOfWeek]++;
    });
    
    res.json({
      totalOrders,
      ordersByStatus,
      averageOrderAmount,
      ordersByDayOfWeek
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

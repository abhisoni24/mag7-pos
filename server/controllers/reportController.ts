/**
 * Report Controller
 * 
 * This module handles generating various reports and analytics for the restaurant,
 * including item frequency, revenue, and order statistics.
 * 
 * @module controllers/reportController
 */
import { Request, Response } from 'express';
import { storage } from '../storage';

/**
 * GET /reports/item-frequency
 * Get frequency of ordered menu items within a date range
 * 
 * @param {Request} req - Express request object with startDate and endDate query params
 * @param {Response} res - Express response object
 * @returns {Array} Array of items with their order frequencies
 * @throws {400} If date params are missing or invalid
 * @throws {500} If there's a server error
 */
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

/**
 * GET /reports/revenue
 * Get revenue statistics within a date range
 * 
 * @param {Request} req - Express request object with startDate and endDate query params
 * @param {Response} res - Express response object
 * @returns {Object} Revenue data including total, by payment method, tips, and daily breakdown
 * @throws {400} If date params are missing or invalid
 * @throws {500} If there's a server error
 */
export const getRevenue = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    console.log("Revenue report for:", { startDate, endDate });
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    // Set time to beginning and end of day
    const start = new Date(startDate as string);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999);
    
    console.log("Date range:", { 
      start: start.toISOString(), 
      end: end.toISOString() 
    });
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD format.' });
    }
    
    // Check for payments - specifically get all payments regardless of date
    const allPayments = await storage.getAllPayments();
    console.log("All payments in DB:", allPayments);
    
    const totalRevenue = await storage.getRevenueByDateRange(start, end);
    const payments = await storage.getPaymentsByDateRange(start, end);
    
    console.log("Filtered payments:", payments);
    
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

/**
 * GET /reports/order-statistics
 * Get comprehensive order statistics within a date range
 * 
 * @param {Request} req - Express request object with startDate and endDate query params
 * @param {Response} res - Express response object
 * @returns {Object} Order statistics including total count, breakdown by status,
 *                   average order amount, and distribution by day of week
 * @throws {400} If date params are missing or invalid
 * @throws {500} If there's a server error
 */
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

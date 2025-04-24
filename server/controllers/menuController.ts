/**
 * Menu Controller
 * 
 * This module handles menu-related operations including retrieving, creating,
 * updating, and deleting menu items.
 * 
 * @module controllers/menuController
 */
import { Request, Response } from 'express';
import { storage } from '../storage';
import { InsertMenuItem } from '@shared/schema';

/**
 * GET /menu
 * Fetch menu items, optionally filtered by category
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Array} List of menu items
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
export const getMenuItems = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    let menuItems;
    
    if (category) {
      menuItems = await storage.getMenuItemsByCategory(category as string);
    } else {
      menuItems = await storage.getMenuItems();
    }
    
    res.json({ menuItems });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

/**
 * GET /menu/:id
 * Fetch a specific menu item by ID
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Menu item document
 * @throws {404} If menu item is not found
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
export const getMenuItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.id;
    const menuItem = await storage.getMenuItem(itemId);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({ menuItem });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

/**
 * POST /menu
 * Create a new menu item
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Created menu item
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, available, isSpecial } = req.body;
    
    const newMenuItem: InsertMenuItem = {
      name,
      description,
      price,
      category,
      available: available !== undefined ? available : true,
      isSpecial: isSpecial !== undefined ? isSpecial : false
    };
    
    const createdMenuItem = await storage.createMenuItem(newMenuItem);
    
    res.status(201).json({ menuItem: createdMenuItem });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

/**
 * PUT /menu/:id
 * Update an existing menu item
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Updated menu item
 * @throws {404} If menu item is not found
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.id;
    const updates = req.body;
    
    const updatedMenuItem = await storage.updateMenuItem(itemId, updates);
    
    if (!updatedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({ menuItem: updatedMenuItem });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

/**
 * DELETE /menu/:id
 * Delete a menu item
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Success message
 * @throws {404} If menu item is not found
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.id;
    
    const success = await storage.deleteMenuItem(itemId);
    
    if (!success) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

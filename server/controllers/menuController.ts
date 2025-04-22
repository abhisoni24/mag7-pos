import { Request, Response } from 'express';
import { storage } from '../storage';
import { InsertMenuItem } from '@shared/schema';

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

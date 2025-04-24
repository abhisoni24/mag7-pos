/**
 * Authentication Controller
 * 
 * This module handles user authentication functions including login, registration,
 * and fetching user profiles.
 * 
 * @module controllers/authController
 */
import { Request, Response } from 'express';
import { storage } from '../storage';
import { generateToken } from '../utils/jwt';
import { loginSchema, InsertUser } from '@shared/schema';
import bcrypt from 'bcryptjs';

/**
 * Authenticates a user and returns a JWT token
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);
    
    // Check if user exists
    const user = await storage.getUserByEmail(validatedData.email);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if user is active
    if (!user.active) {
      return res.status(401).json({ message: 'Account is inactive' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if there's a role restriction (for admin-only login or staff-only login)
    if (validatedData.role) {
      // If admin role is requested, only allow actual admins to log in
      if (validatedData.role === 'admin' && user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin login required.' });
      }
      
      // If non-admin role is requested, don't allow admins to log in through staff portal
      if (validatedData.role === 'staff' && user.role === 'admin') {
        return res.status(403).json({ message: 'Admins must use the admin login page.' });
      }
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user info and token
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
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
 * Registers a new user
 * This endpoint is restricted to managers, owners, or admins
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export const register = async (req: Request, res: Response) => {
  try {
    // This endpoint should only be used by managers, owners, or admins
    // Authorization is handled by middleware
    
    const { name, email, password, role } = req.body;
    
    // Check if email is already in use
    const existingUser = await storage.getUserByEmail(email);
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser: InsertUser = {
      name,
      email,
      password: hashedPassword,
      role,
      active: true
    };
    
    const createdUser = await storage.createUser(newUser);
    
    res.status(201).json({
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role
      }
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
 * Retrieves the authenticated user's profile
 * 
 * @param {Request} req - Express request object with user property from auth middleware
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await storage.getUser(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

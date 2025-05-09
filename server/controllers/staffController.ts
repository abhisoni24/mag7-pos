/**
 * Staff Controller
 * 
 * This module handles staff-related operations including retrieving, creating,
 * updating, and deleting staff members (users with various roles).
 * 
 * @module controllers/staffController
 */
import { Request, Response } from 'express';
import { storage } from '../storage';
import { InsertUser, UserRole } from '@shared/schema';
import bcrypt from 'bcryptjs';

/**
 * GET /staff
 * Fetch staff members, optionally filtered by role
 * Excludes admin users unless specifically requested by role
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Array} List of staff members with sanitized information (no passwords)
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
export const getStaff = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    
    let staff;
    
    if (role) {
      staff = await storage.getUsersByRole(role as string);
    } else {
      // Get all staff except admins
      const allUsers = await storage.getUsers();
      staff = allUsers.filter(user => user.role !== UserRole.ADMIN);
    }
    
    // Remove password from response
    const sanitizedStaff = staff.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    }));
    
    res.json({ staff: sanitizedStaff });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

/**
 * GET /staff/:id
 * Fetch a specific staff member by ID
 * Admin users can only be accessed by other admins
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Staff member details with sanitized information (no password)
 * @throws {403} If trying to access admin user without admin privileges
 * @throws {404} If staff member is not found
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
export const getStaffMember = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Admin can only be accessed by another admin
    if (user.role === UserRole.ADMIN && req.user?.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Remove password from response
    const sanitizedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    };
    
    res.json({ staff: sanitizedUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

/**
 * POST /staff
 * Create a new staff member
 * Permission based on role hierarchy: admin > owner > manager
 * 
 * @param {Request} req - Express request object with authenticated user
 * @param {Response} res - Express response object
 * @returns {Object} Created staff member with sanitized information (no password)
 * @throws {403} If user lacks permission to create staff with specified role
 * @throws {400} If email already exists or there's a validation error
 * @throws {500} If there's a server error
 */
export const createStaffMember = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate role based on user's role
    if (!validateRolePermission(req.user?.role, role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to create a staff member with this role' 
      });
    }
    
    // Check if email already exists
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
    
    // Remove password from response
    const sanitizedUser = {
      id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      active: createdUser.active
    };
    
    res.status(201).json({ staff: sanitizedUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

/**
 * PUT /staff/:id
 * Update an existing staff member
 * Permission based on role hierarchy: admin > owner > manager
 * 
 * @param {Request} req - Express request object with authenticated user
 * @param {Response} res - Express response object
 * @returns {Object} Updated staff member with sanitized information (no password)
 * @throws {403} If user lacks permission to update staff to specified role
 * @throws {404} If staff member is not found
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
export const updateStaffMember = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    
    // Get the user to update
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Check if updating role and validate permission
    if (updates.role && !validateRolePermission(req.user?.role, updates.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to update a staff member to this role' 
      });
    }
    
    // Admin can only be updated by another admin
    if (user.role === UserRole.ADMIN && req.user?.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Hash password if provided
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    const updatedUser = await storage.updateUser(userId, updates);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Remove password from response
    const sanitizedUser = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      active: updatedUser.active
    };
    
    res.json({ staff: sanitizedUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

/**
 * DELETE /staff/:id
 * Deactivate a staff member (not permanent deletion)
 * Permission based on role hierarchy: admin > owner > manager
 * 
 * @param {Request} req - Express request object with authenticated user
 * @param {Response} res - Express response object
 * @returns {Object} Success message
 * @throws {403} If user lacks permission to delete staff member
 * @throws {404} If staff member is not found
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
export const deleteStaffMember = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    // Get the user to delete
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Admin can only be deleted by another admin
    if (user.role === UserRole.ADMIN && req.user?.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Manager can only delete waiters, hosts, and chefs
    if (req.user?.role === UserRole.MANAGER && 
        ![UserRole.WAITER, UserRole.HOST, UserRole.CHEF].includes(user.role as any)) {
      return res.status(403).json({ 
        message: 'You do not have permission to delete this staff member' 
      });
    }
    
    // Owner can delete managers but not other owners or admins
    if (req.user?.role === UserRole.OWNER && 
        ![UserRole.WAITER, UserRole.HOST, UserRole.CHEF, UserRole.MANAGER].includes(user.role as any)) {
      return res.status(403).json({ 
        message: 'You do not have permission to delete this staff member' 
      });
    }
    
    // Instead of deleting, set the user as inactive
    await storage.updateUser(userId, { active: false });
    
    res.json({ message: 'Staff member deactivated successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

/**
 * Helper function to validate role permissions based on hierarchy
 * 
 * @param {string} userRole - The role of the authenticated user making the request
 * @param {string} targetRole - The role being assigned to or modified for a staff member
 * @returns {boolean} Whether the user has permission to manage the target role
 */
function validateRolePermission(userRole?: string, targetRole?: string): boolean {
  if (!userRole || !targetRole) return false;
  
  // Admin can create/update any role
  if (userRole === UserRole.ADMIN) return true;
  
  // Owner can create/update manager, waiter, host, chef
  if (userRole === UserRole.OWNER) {
    return [UserRole.MANAGER, UserRole.WAITER, UserRole.HOST, UserRole.CHEF].includes(targetRole as any);
  }
  
  // Manager can create/update waiter, host, chef
  if (userRole === UserRole.MANAGER) {
    return [UserRole.WAITER, UserRole.HOST, UserRole.CHEF].includes(targetRole as any);
  }
  
  return false;
}

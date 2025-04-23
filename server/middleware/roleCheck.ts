import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@shared/schema';

// Role hierarchy for authorization
const roleHierarchy: Record<string, number> = {
  [UserRole.HOST]: 1,
  [UserRole.WAITER]: 2,
  [UserRole.CHEF]: 2,
  [UserRole.MANAGER]: 3,
  [UserRole.OWNER]: 4,
  [UserRole.ADMIN]: 5
};

// Role-specific permissions matrix
const rolePermissions: Record<string, string[]> = {
  [UserRole.HOST]: ['tables', 'menu', 'view_staff'],
  [UserRole.WAITER]: ['tables', 'menu', 'orders', 'payments'],
  [UserRole.CHEF]: ['orders', 'menu'],
  [UserRole.MANAGER]: ['tables', 'menu', 'orders', 'payments', 'staff', 'assign_tables'],
  [UserRole.OWNER]: ['tables', 'menu', 'orders', 'payments', 'staff', 'reports', 'assign_tables'],
  [UserRole.ADMIN]: ['all']
};

export const checkRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const userRoleLevel = roleHierarchy[req.user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    
    // Admin can access everything
    if (req.user.role === UserRole.ADMIN) {
      return next();
    }
    
    // Owner can do everything a manager can do
    if (req.user.role === UserRole.OWNER && requiredRole === UserRole.MANAGER) {
      return next();
    }
    
    // Manager/Owner can do what waiters can do
    if ((req.user.role === UserRole.MANAGER || req.user.role === UserRole.OWNER) && 
        requiredRole === UserRole.WAITER) {
      return next();
    }
    
    // Special handling for chef role
    if (requiredRole === UserRole.CHEF && req.user.role === UserRole.CHEF) {
      return next();
    }
    
    // Check if user's role is high enough in the hierarchy
    if (userRoleLevel >= requiredRoleLevel) {
      return next();
    }
    
    return res.status(403).json({ 
      message: 'Access denied. You do not have the required permission.' 
    });
  };
};

// Helper function to check if a user has a specific permission
export const hasPermission = (userRole: string, permission: string): boolean => {
  if (userRole === UserRole.ADMIN || rolePermissions[userRole]?.includes('all')) {
    return true;
  }
  
  return rolePermissions[userRole]?.includes(permission) || false;
};

// Middleware to check for a specific permission
export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (hasPermission(req.user.role, permission)) {
      return next();
    }
    
    return res.status(403).json({ 
      message: 'Access denied. You do not have the required permission.' 
    });
  };
};

// Check if user is waiter or higher
export const isWaiter = (req: Request, res: Response, next: NextFunction) => {
  return checkRole(UserRole.WAITER)(req, res, next);
};

// Check if user is chef
export const isChef = (req: Request, res: Response, next: NextFunction) => {
  return checkRole(UserRole.CHEF)(req, res, next);
};

// Check if user is host
export const isHost = (req: Request, res: Response, next: NextFunction) => {
  return checkRole(UserRole.HOST)(req, res, next);
};

// Check if user is manager or higher
export const isManager = (req: Request, res: Response, next: NextFunction) => {
  return checkRole(UserRole.MANAGER)(req, res, next);
};

// Check if user is owner or higher
export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  return checkRole(UserRole.OWNER)(req, res, next);
};

// Check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  return checkRole(UserRole.ADMIN)(req, res, next);
};

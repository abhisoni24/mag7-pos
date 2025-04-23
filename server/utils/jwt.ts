/**
 * JWT Authentication Utilities
 * 
 * This module provides utilities for generating and verifying JSON Web Tokens (JWT)
 * for user authentication in the Mag7 POS system.
 * 
 * @module utils/jwt
 */
import jwt from 'jsonwebtoken';
import { MongoUser } from '@shared/schema';

// In a production app, this should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'mag7-pos-secret-key';
const JWT_EXPIRES_IN = '24h';

/**
 * JWT Payload interface
 */
interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Generates a JWT token for authenticated users
 * 
 * @param {MongoUser} user - The authenticated user object
 * @returns {string} The signed JWT token
 */
export const generateToken = (user: MongoUser): string => {
  const payload: JWTPayload = {
    id: user._id as string,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifies a JWT token and returns the decoded payload
 * 
 * @param {string} token - The JWT token to verify
 * @returns {JWTPayload} The decoded token payload
 * @throws {Error} If the token is invalid or expired
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

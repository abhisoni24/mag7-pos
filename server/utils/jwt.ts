import jwt from 'jsonwebtoken';
import { MongoUser } from '@shared/schema';

// In a production app, this should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'restaurant-pos-secret-key';
const JWT_EXPIRES_IN = '24h';

export const generateToken = (user: MongoUser): string => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

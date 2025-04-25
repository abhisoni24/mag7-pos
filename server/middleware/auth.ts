import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      /**
       * Custom user object added to the Express Request interface.
       * Populated after successful token verification.
       */
      user?: {
        id: string; // User ID
        email: string; // User email
        role: string; // User role (e.g., admin, user, etc.)
      };
    }
  }
}

/**
 * Middleware to authenticate requests using a JWT token.
 *
 * This middleware checks for the presence of a valid JWT token in the
 * `Authorization` header of the incoming request. If the token is valid,
 * it decodes the token and attaches the user information to the request object.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 *
 * @throws Returns a 401 status code if:
 * - The `Authorization` header is missing or improperly formatted.
 * - The token is invalid or expired.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);

    // Add user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};

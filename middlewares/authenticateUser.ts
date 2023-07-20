import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "";

// Define a custom interface for the Request object
export interface AuthenticatedRequest extends Request {
  jwtPayload?: IJwtPayload;
}

// Middleware to verify JWT and authenticate user
export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: Function
) => {
  // Get the JWT token from the request headers or query parameters
  // const token = req.headers.authorization?.split(" ")[1];

  // if you using cookies
  const cookieToken = req.cookies.token as string;

  if (!cookieToken) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Authentication failed" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(cookieToken, JWT_SECRET) as IJwtPayload;

    // Attach the authenticated user ID to the request object
    req.jwtPayload = decoded;

    next();
  } catch (error) {
    console.error("Error verifying JWT:", error);
    res.status(401).json({ error: "Invalid authorization token" });
  }
};

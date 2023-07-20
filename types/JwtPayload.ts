import { JwtPayload } from "jsonwebtoken";

// Define an interface for the JWT payload
export interface IJwtPayload extends JwtPayload {
  email: string;
  userId: string;
}

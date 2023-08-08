import { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";

// Define an interface for the JWT payload
export interface CustomJwtPayloadInterface extends JwtPayload {
  email: string;
  userId: string;
  username: string;
}

export interface CustomSocket extends Socket {
  jwtPayload?: CustomJwtPayloadInterface;
}
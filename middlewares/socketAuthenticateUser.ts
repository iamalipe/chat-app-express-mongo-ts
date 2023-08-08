import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { CustomJwtPayloadInterface, CustomSocket } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "";

type SocketAuthenticateUser = (
  socket: CustomSocket,
  next: (err?: Error | undefined) => void
) => void;

export const socketAuthenticateUser: SocketAuthenticateUser = (
  socket,
  next
) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    socket.emit("E401", "authentication failed");
    return next(new Error("authentication failed"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayloadInterface;
    socket.jwtPayload = decoded;
    next();
  } catch (error) {
    socket.emit("E401", "invalid authorization token");
    return next(new Error("invalid authorization token"));
  }
};

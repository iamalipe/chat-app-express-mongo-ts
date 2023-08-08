import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";

import {
  authRoute,
  conversationRoute,
  messagesRoute,
  usersRoute,
} from "./routes";
import { authenticateUser, socketAuthenticateUser } from "./middlewares";
import mongoConnect from "./config/mongoConnect";
import { CustomSocket } from "./types";

const EXPRESS_PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chat-app-react-ts-six.vercel.app",
    ],
  },
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chat-app-react-ts-six.vercel.app",
    ],
  })
);

// Connecting to the database
mongoConnect();

app.get("/", async (req, res) => {
  res.send("Hello World, Chat App");
});

app.use("/auth", authRoute);
app.use("/conversation", authenticateUser, conversationRoute);
app.use("/messages", authenticateUser, messagesRoute);
app.use("/users", authenticateUser, usersRoute);

io.on("connection", async (socket: CustomSocket) => {
  // add socket authenticate user middleware
  socket.use((packet, next) => socketAuthenticateUser(socket, next));

  socket.on("conversation", (data) => {
    console.log("User is : ", socket.jwtPayload);
  });

  try {
    if (socket.jwtPayload) {
      const userId = socket.jwtPayload.userId;
      const conversations = await getConversationsForUser(userId);
      socket.emit("conversationList", conversations);
    }
  } catch (error) {
    console.error("Error fetching conversation list:", error);
    socket.emit("conversation list", []);
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  // Handle custom events here
});

server.listen(EXPRESS_PORT, () => {
  console.log(`🟢 App is running on port ${EXPRESS_PORT}.`);
});

const getConversationsForUser = async (userId: string) => {};
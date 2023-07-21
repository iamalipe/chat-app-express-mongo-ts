import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import { authRoute, conversationRoute, messagesRoute } from "./routes";
import { authenticateUser } from "./middlewares";

const EXPRESS_PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL || "";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chat-app-react-ts-six.vercel.app",
    ],
  })
);

// Connecting to the database
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log(`🟢 successfully connected to database`);
  })
  .catch((error) => {
    console.log(`🔴 database connection failed. exiting now...`);
    console.error(error);
    process.exit(1);
  });

app.get("/", async (req, res) => {
  res.send("Hello World, Chat App");
});

app.use("/auth", authRoute);
app.use("/conversation", authenticateUser, conversationRoute);
app.use("/messages", authenticateUser, messagesRoute);

app.listen(EXPRESS_PORT, () => {
  console.log(`🟢 App is running on port ${EXPRESS_PORT}.`);
});

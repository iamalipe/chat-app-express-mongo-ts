import express, { Response } from "express";
import { IOnlyUser, IUser, conversationModel, userModel } from "../models";
import { AuthenticatedRequest } from "../middlewares";
export const conversationRoute = express.Router();

conversationRoute.post(
  "/",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Extract the array of user IDs from the request body
      const userIds: string[] = req.body;

      // Validate that the array contains exactly two user IDs
      if (!Array.isArray(userIds) || userIds.length < 2) {
        return res.status(400).json({
          error: "Request body must contain an array",
        });
      }
      // Check for duplicate users in the array
      const uniqueUsers: string[] = [];
      userIds.forEach((e) => !uniqueUsers.includes(e) && uniqueUsers.push(e));
      // Validate that the array contains exactly two user IDs
      if (!Array.isArray(uniqueUsers) || uniqueUsers.length < 2) {
        return res.status(400).json({
          error: "Request body must contain an array of exactly two user IDs",
        });
      }

      // Fetch the user details (including emails) from the 'User' collection
      const existingUsers = await userModel.find({ _id: { $in: uniqueUsers } });

      // Create the array of IOnlyUser objects with the fetched user details
      const users: IOnlyUser[] = existingUsers.map((e) => ({
        id: e.id,
        email: e.email,
      }));

      // Check if the conversation is already exist
      const existingConversation = await conversationModel.findOne({ users });
      if (existingConversation) {
        return res.status(200).json(existingConversation);
      }

      // Create a new conversation using the ConversationModel
      const newConversation = new conversationModel({
        users: users,
      });
      await newConversation.save();
      res.status(201).json(newConversation);
    } catch (error) {
      res.status(500).json({ error: "Failed to create conversation" });
    }
  }
);

conversationRoute.get("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const jwtPayload = req.jwtPayload;
    if (!jwtPayload) throw new Error("jwtPayload not found");

    const conversations = await conversationModel.find({
      "users.id": jwtPayload.userId,
    });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve TODOs" });
  }
});

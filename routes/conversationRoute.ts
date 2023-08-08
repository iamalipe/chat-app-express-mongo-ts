import express, { Response } from "express";
import { IUser, conversationModel, userModel } from "../models";
import { AuthenticatedRequest } from "../middlewares";
export const conversationRoute = express.Router();

conversationRoute.post(
  "/",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.jwtPayload) throw new Error("jwtPayload not found");
      // Extract the array of user IDs from the request body
      const userId: string = req.body.userId;

      // Fetch the user details
      const userDetails = await userModel.findById(userId);
      if (!userDetails)
        return res.status(401).json({ error: "user not found" });
      const newConversation = new conversationModel({
        users: [userDetails.id, req.jwtPayload.userId],
        newMessageCount: 0,
      });
      await newConversation.save();
      res
        .status(201)
        .json({ message: "user registered successfully", data: [] });
    } catch (error) {
      res.status(500).json({ error: "failed to create conversation" });
    }
  }
);

conversationRoute.get("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const jwtPayload = req.jwtPayload;
    if (!jwtPayload) throw new Error("jwtPayload not found");

    const conversations = await conversationModel
      .find({
        users: jwtPayload.userId,
      })
      .select("-__v");
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve TODOs" });
  }
});

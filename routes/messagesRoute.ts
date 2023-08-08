import express, { Response } from "express";
import { IUser, conversationModel, messagesModel } from "../models";
import { AuthenticatedRequest } from "../middlewares";
export const messagesRoute = express.Router();

messagesRoute.post("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.jwtPayload) throw new Error("jwtPayload not found");
    const { value, isImage } = req.body as {
      value?: string;
      isImage?: boolean;
    };
    const { id } = req.query as { id?: string };
    if (!value)
      return res.status(400).json({
        error: "value can't be undefine",
      });
    if (!id)
      return res.status(400).json({
        error: "id can't be undefine",
      });

    const conversation = await conversationModel.findByIdAndUpdate(id, {
      lastMessage: value,
      lastMessageTime: Date.now(),
    });
    const newMessage = new messagesModel({
      conversationId: id,
      value: value,
      isImage: isImage === undefined ? false : isImage,
      senderId: req.jwtPayload.userId,
      senderEmail: req.jwtPayload.email,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

messagesRoute.get("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.jwtPayload) throw new Error("jwtPayload not found");
    const { id } = req.query as { id?: string };
    if (!id)
      return res.status(400).json({
        error: "id can't be undefine",
      });

    const messages = await messagesModel.find({
      conversationId: id,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve TODOs" });
  }
});

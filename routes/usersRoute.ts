import express, { Response } from "express";
import { IUser, userModel } from "../models";
import { AuthenticatedRequest } from "../middlewares";
export const usersRoute = express.Router();

usersRoute.get("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { limit, page, search } = req.query;

    const _limit = limit === undefined ? 10 : limit;
    const _page = page === undefined ? 1 : page;

    const limit_value = parseInt(_limit as string) * 1;
    const page_value = (parseInt(_page as string) - 1) * limit_value;

    const users = await userModel
      .find({}, { __v: 0, password: 0, modifyTime: 0 })
      .limit(limit_value)
      .skip(page_value)
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

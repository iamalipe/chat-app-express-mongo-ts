import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models";

const JWT_SECRET = process.env.JWT_SECRET || "";
export const authRoute = express.Router();

// Regular expression for email validation
const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Route: Register a new user
authRoute.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if the email is already registered
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new userModel({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route: Log in a user
authRoute.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if the email and password are valid
    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, {
      expiresIn: "12h",
    });
    // For normal jwt token use
    res
      .status(200)
      .json({
        message: "User logged in successfully",
        token,
        userId: user._id,
        email,
      });

    // res.cookie("token", token);
    // res.status(200).json({ userId: user._id, email });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models";
import regexValidator from "../libs/regexValidator";

const JWT_SECRET = process.env.JWT_SECRET || "";
export const authRoute = express.Router();

interface ErrorMsg {
  [key: string]: string | null;
}

// /register
authRoute.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, username, password, repeatPassword } = req.body;

    let isFieldInvalid = false;
    const errorMsg: ErrorMsg = {
      email: null,
      password: null,
      repeatPassword: null,
      username: null,
    };
    if (!regexValidator.email(email)) {
      errorMsg.email = "invalid email";
      isFieldInvalid = true;
    }
    if (!regexValidator.password(password)) {
      errorMsg.password = "invalid password";
      isFieldInvalid = true;
    }
    if (password !== repeatPassword) {
      errorMsg.repeatPassword = "password not match";
      isFieldInvalid = true;
    }
    if (!regexValidator.username(username)) {
      errorMsg.username = "invalid username";
      isFieldInvalid = true;
    }

    if (isFieldInvalid) return res.status(400).json({ error: errorMsg });

    // Check if the email is already registered
    const existingUser = await userModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      errorMsg.email = "email already registered";
      return res.status(400).json({ error: errorMsg });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new userModel({
      email: email.toLowerCase(),
      password: hashedPassword,
      username: username.toLowerCase(),
    });
    await newUser.save();
    res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    console.error("error registering user:", error);
    res.status(500).json({ error: "internal server error" });
  }
});

// /login
authRoute.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    let isFieldInvalid = false;
    const errorMsg: ErrorMsg = {
      email: null,
      password: null,
    };
    if (!regexValidator.email(email)) {
      errorMsg.email = "invalid email";
      isFieldInvalid = true;
    }
    if (!regexValidator.password(password)) {
      errorMsg.password = "invalid password";
      isFieldInvalid = true;
    }
    if (isFieldInvalid) return res.status(400).json({ error: errorMsg });

    // Check if the email and password are present in database
    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      errorMsg.email = "email not registered";
      return res.status(400).json({ error: errorMsg });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      errorMsg.password = "password not match";
      return res.status(400).json({ error: errorMsg });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );

    res.status(200).json({
      message: "user logged in successfully",
      token,
      userId: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("error logging in user:", error);
    res.status(500).json({ error: "internal server error" });
  }
});

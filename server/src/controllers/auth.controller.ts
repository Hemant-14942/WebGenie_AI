import type { Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../repository/auth.repository.js";
import { generateToken } from "../services/auth.service.js";
import { Request as CustomRequest } from "../types/http.js";
import { cookiesConfig } from "../utils/cookies.js";

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { name, email, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const existingUser = await findUserByEmail(email);
    const user = existingUser
      ? existingUser
      : await createUser({ name, email, avatar });
    const token = await generateToken(user._id.toString());
    res.cookie("token", token, cookiesConfig);
    res
      .status(200)
      .json({ user, message: "User logged in successfully", token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", cookiesConfig);
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to logout" });
  }
};

export const getUser = async (req: CustomRequest, res: Response) => {
  try {
    const user = await findUserById(req.user?.id as string);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

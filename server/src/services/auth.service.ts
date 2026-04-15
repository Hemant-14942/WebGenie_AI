import jwt from "jsonwebtoken";
import { env } from "../config/index.js";

export const generateToken = async (userId: string) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: "2h" });
};

export const verifyToken = async (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};
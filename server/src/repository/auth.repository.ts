import { User } from "../models/index.js";
import type { IUser } from "../types/auth.js";

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const findUserById = async (id: string) => {
  return await User.findById(id);
};
export const createUser = async (user: IUser) => {
  return await User.create(user);
};
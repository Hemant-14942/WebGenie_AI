import axios from "axios";
import { serverUrl } from "@/helpers/constants";

export const getCurrentUser = async () => {
  const res = await axios.get(`${serverUrl}/api/auth/me`, {
    withCredentials: true,
  });
  return res.data.user;
};
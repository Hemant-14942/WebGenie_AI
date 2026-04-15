import { Response, NextFunction } from "express";
import { verifyToken } from "../services/auth.service.js";
import { Request as CustomRequest } from "../types/http.js";
import { JwtPayload } from "jsonwebtoken";


export const authenticate = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;
        
        if (!token) {
            return  res.status(401).json({ error: "Unauthorized" });
        }
      
        const decoded = await verifyToken(token) as JwtPayload; 
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
      
        req.user = { id: decoded.id };
        return next();
      } catch {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
};
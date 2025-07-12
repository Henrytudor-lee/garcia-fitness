import jwt from "jsonwebtoken";
import { VercelRequest, VercelResponse } from "@vercel/node";

export function verifyToken(req: VercelRequest, res: VercelResponse) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            error: "未提供认证令牌"
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, process.env.JWT_SECRET || 'garcia-jwt-secret');
        return true;
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: "无效的令牌"
        });
    }
}
// api/login.ts

import { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../lib/supabase.js";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只允许 POST 请求" });
  }

  const { email, password } = req.body;

  // 验证必填字段
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "email 和 password 为必填字段"
    });
  }

  try {
    // 查询用户是否存在：从 Supabase 中查找满足条件的用户记录
    const { data, error } = await supabase
      .from("users")
      .select("id, password, name, avatar, role")
      .eq("email", email)
      .limit(1);

    if (error || !data || data.length === 0) {
      return res.status(401).json({ error: "用户不存在或密码错误" });
    }

    const user = data[0];

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "用户不存在或密码错误" });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "garcia-jwt-secret",
      { expiresIn: "1d" }  // 将过期时间调整为1天
    );

    return res.status(200).json({
      success: true,
      token,
      data: {
        user_id: user.id,
        user_name: user.name,
        user_avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("数据库错误:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "数据库操作失败"
    });
  }
}
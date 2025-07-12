// api/register.ts

import { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { supabase } from "../lib/supabase.js";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只允许 POST 请求" });
  }

  const { email, password, name } = req.body;

  // 验证必填字段
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      error: "email, password 和 name 为必填字段"
    });
  }

  try {
    // 检查用户是否已存在
    const { data: users, error: selectError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (selectError) throw selectError;
    if (users && users.length > 0) {
      return res.status(409).json({ error: "用户已存在" });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入新用户
    const { data: insertData, error: insertError } = await supabase
      .from("users")
      .insert({ email, password: hashedPassword, name })
      .select(); // 返回插入记录

    if (insertError) throw insertError;

    const insertedUser = insertData && insertData[0];

    return res.status(201).json({
      success: true,
      data: { id: insertedUser?.id }
    });
  } catch (error) {
    console.error("数据库错误:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "数据库操作失败"
    });
  }
}
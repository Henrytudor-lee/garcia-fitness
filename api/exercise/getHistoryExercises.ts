import { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import { verifyToken } from "../../lib/utils.js";
import { supabase } from "../../lib/supabase.js";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "只允许 GET 请求" });
  }

  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: "user_id 为必填字段"
    });
  }

  try {
    verifyToken(req, res);

    // 使用 Supabase 查询指定用户的训练动作历史（去重 exercise_id 和 name 列）
    const { data, error } = await supabase
      .from("exercises")
      .select("exercise_id, name")
      .eq("user_id", user_id);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("数据库错误:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "数据库操作失败"
    });
  }
}
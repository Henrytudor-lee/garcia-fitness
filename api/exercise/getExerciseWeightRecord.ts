import { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import { verifyToken } from "../../lib/utils.js";
import { supabase } from "../../lib/supabase.js";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "只允许 GET 请求" });
  }

  const { user_id, exercise_id } = req.query;
  if (!user_id || !exercise_id) {
    return res.status(400).json({
      success: false,
      error: "user_id 和 exercise_id 为必填字段"
    });
  }

  try {
    verifyToken(req, res);
    // 查询指定用户和特定动作的所有记录
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("user_id", user_id)
      .eq("exercise_id", exercise_id);

    if (error) throw error;
    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error("数据库错误:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "数据库操作失败"
    });
  }
}
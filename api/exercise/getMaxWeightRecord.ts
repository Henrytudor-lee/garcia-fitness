import { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import { verifyToken } from "../../lib/utils.js";
import { supabase } from "../../lib/supabase.js";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "只允许 GET 请求" });
  }

  const { exercise_id } = req.query;
  if (!exercise_id) {
    return res.status(400).json({
      success: false,
      error: "exercise_id 为必填字段"
    });
  }

  try {
    verifyToken(req, res);

    // 查询指定 exercise_id 的记录，按 weight 降序排序，返回最高的那条记录
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("exercise_id", exercise_id)
      .order("weight", { ascending: false })
      .limit(1);

    if (error) throw error;

    // 如果没有返回数据，则返回空列表，否则返回记录
    const record = data && data.length > 0 ? data[0] : [];
    return res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error("数据库错误:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "数据库操作失败"
    });
  }
}
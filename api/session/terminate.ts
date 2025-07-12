import { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import { verifyToken } from "../../lib/utils.js";
import { supabase } from "../../lib/supabase.js";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只允许 POST 请求" });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: "id 为必填字段"
    });
  }

  try {
    verifyToken(req, res);

    // 更新 sessions 表，设置为已完成状态
    const { data, error } = await supabase
      .from("sessions")
      .update({
        is_done: 1,
        end_time: new Date().toISOString(),
        status: "finished"
      })
      .eq("id", id)
      .select("*") as { data: any[] | null, error: any };

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: "未找到指定的会话记录"
      });
    }

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
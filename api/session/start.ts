import { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import { verifyToken } from "../../lib/utils.js";
import { supabase } from "../../lib/supabase.js";

dotenv.config();

interface SessionData {
  user_id: number;
  end_time?: string;
  is_done?: boolean;
  status?: 'running' | 'paused' | 'finished';
  notes?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只允许 POST 请求" });
  }

  console.log('Received request body:', req.body);
  const data: SessionData = req.body;

  if (!data.user_id) {
    return res.status(400).json({
      success: false,
      error: "user_id 为必填字段"
    });
  }

  // 验证 status 字段的有效性
  if (data.status && !['running', 'paused', 'finished'].includes(data.status)) {
    return res.status(400).json({
      success: false,
      error: "status 必须是 running、paused 或 finished 之一"
    });
  }

  try {
    verifyToken(req, res);

    // 插入新 session，start_time 设为当前时间
    const { data: insertData, error } = await supabase
      .from("sessions")
      .insert({
        user_id: data.user_id,
        start_time: new Date().toISOString(),
        is_done: data.is_done ?? 0,
        status: data.status || 'running',
        notes: data.notes || null
      })
      .select();

    if (error) throw error;
    const insertedSession = insertData && insertData[0];

    return res.status(200).json({
      success: true,
      data: { id: insertedSession?.id }
    });

  } catch (error) {
    console.error("数据库错误:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "数据库操作失败"
    });
  }
}
import { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import { verifyToken } from "../../lib/utils.js";
import { supabase } from "../../lib/supabase.js";

dotenv.config();

interface ExerciseData {
  session_id: number;
  reps?: number;
  weight?: number;
  notes?: string;
  sequence?: number;
  exercise_id?: number;
  name?: string;
  user_id: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只允许 POST 请求" });
  }

  const data: ExerciseData = req.body;

  // 验证必填字段
  if (!data.session_id) {
    return res.status(400).json({
      success: false,
      error: "session_id 为必填字段"
    });
  }

  try {
    verifyToken(req, res);
    // 插入数据到 exercises 表
    const { data: insertData, error } = await supabase
      .from("exercises")
      .insert({
        session_id: data.session_id,
        sequence: data.sequence || 0,
        reps: data.reps || 0,
        weight: data.weight || 0,
        notes: data.notes || '',
        exercise_id: data.exercise_id,
        name: data.name,
        user_id: data.user_id
      })
      .select();

    if (error) throw error;
    const inserted = insertData && insertData[0];

    return res.status(200).json({
      success: true,
      data: { id: inserted?.id }
    });
  } catch (error) {
    console.error("数据库错误:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "数据库操作失败"
    });
  }
}
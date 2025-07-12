import { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import { verifyToken } from "../../lib/utils.js";
import { supabase } from "../../lib/supabase.js";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "只允许 GET 请求" });
  }

  try {
    verifyToken(req, res);
    const user_id = req.query.user_id;

    // 查询最近一条未完成的 session
    const { data: sessions, error: sessionError } = await supabase
      .from("sessions")
      .select("*")
      .eq("is_done", 0)
      .eq("user_id", user_id)
      .order("start_time", { ascending: false })
      .limit(1);

    if (sessionError) throw sessionError;
    if (!sessions || sessions.length === 0) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "没有未完成的 session"
      });
    }
    const session = sessions[0];

    // 查询该 session 下的所有 exercise
    const { data: exercises, error: exerciseError } = await supabase
      .from("exercises")
      .select("*")
      .eq("session_id", session.id)
      .order("sequence", { ascending: true })
      .order("id", { ascending: true });

    if (exerciseError) throw exerciseError;

    // 格式化 exercise 数据
    const realExercises = (exercises || []).map((exercise: any) => ({
      id: exercise.id,
      name: exercise.name,
      weight: exercise.weight,
      repetitions: exercise.reps,
      endTime: exercise.create_time,
      exerciseId: exercise.exercise_id
    }));

    // 如果需要也可以返回所有 exercise 的 id 列表
    session.exerciseIds = (exercises || []).map((exercise: any) => exercise.id);

    return res.status(200).json({
      success: true,
      data: {
        session,
        exercises: realExercises
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
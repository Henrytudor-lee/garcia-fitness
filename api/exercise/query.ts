import { ExerciseModel, ExerciseResponseModel } from "@/types/base.model";
import { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import { verifyToken } from "../../lib/utils.js";
import { supabase } from "../../lib/supabase.js";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "只允许 GET 请求" });
  }

  const { body_part_id, equipment_id } = req.query;
  if (!body_part_id || !equipment_id) {
    return res.status(400).json({
      success: false,
      error: "body_part_id 和 equipment_id 为必填字段"
    });
  }

  try {
    verifyToken(req, res);
    const { data: exercises, error } = await supabase
      .from("exercises_library")
      .select("*")
      .ilike("body_part_id", `%${body_part_id}%`)
      .ilike("equipment_id", `%${equipment_id}%`);

    if (error) throw error;
    return res.status(200).json({
      success: true,
      data: (exercises as ExerciseResponseModel[]).map((exercise: ExerciseResponseModel) => ({
        ...exercise,
        equipment_id: exercise.equipment_id ? exercise.equipment_id.split(",")[0] || 0 : 0,
        body_part_id: exercise.body_part_id ? exercise.body_part_id.split(",") : []
      }))
    });
  } catch (error) {
    console.error("数据库错误:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "数据库操作失败"
    });
  }
}
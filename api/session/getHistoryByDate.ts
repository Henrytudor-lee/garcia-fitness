import { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import { verifyToken } from "../../lib/utils.js";
import { supabase } from "../../lib/supabase.js";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {

  if (req.method !== "GET") {
    return res.status(405).json({ error: "只允许 GET 请求" });
  }

  const { date = new Date().toISOString().split('T')[0] } = req.query;
  try {
    verifyToken(req, res);

    // 一次查询返回 sessions 以及嵌入的 exercises 数据
    const { data, error } = await supabase
      .from('sessions')
      .select(`*, exercises(*)`)
      .eq('user_id', 2)
      .eq('is_done', 1)
      .eq('status', 'finished')
      .gte('start_time', req.query.date + 'T00:00:00+08:00')
      .lt('start_time', req.query.date + 'T23:59:59+08:00');

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data,
      meta: {
        date,
        total: data?.length || 0
      }
    });

  } catch (error) {
    console.error("数据库错误:", error);
    console.error("查询参数:", { date });
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "数据库操作失败"
    });
  }
}
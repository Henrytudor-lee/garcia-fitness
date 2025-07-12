// api/proxy/[...path].ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // return res.json("ok");
  try {
    // 构建请求URL
    const baseUrl =   'https://garcia-fitness-backend.vercel.app'
    const url = `${baseUrl}${req.query.path}`;
    // 发送请求到第三方API
    axios(url, {
      method: req.method,
      data: req.body,
    }).then((response) => {
      return res.status(200).json(response.data);
    });
    // 将第三方API的响应返回给客户端
  } catch (error) {
    console.error("代理请求错误:", error);

    // 返回详细的错误信息
    return res.status(500).json({
      error: "请求第三方API失败",
      message: error,
      details: error,
    });
  }
}

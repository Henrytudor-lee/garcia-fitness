
# GarciaFit - 移动端健身记录与指导应用

GarciaFit 是一款面向移动端的 Web 健身助手应用，旨在帮助用户记录日常健身训练数据，并提供标准化的健身动作教学视频。该应用专注于数据可视化、训练跟踪和健身教育的结合，使用现代前端技术与云原生架构，提供跨平台一致的用户体验。

## ✨ 核心特性

- 📈 用户训练记录管理：记录每次训练的动作、组数、重量、次数等核心数据。
- 🎥 教学视频支持：为常见健身动作提供教学视频，辅助用户标准化训练动作。
- 📱 移动端优先设计：基于 Ionic Framework，原生般的移动体验。
- 🔒 安全认证机制：采用 JWT Token 机制进行登录验证与用户信息隔离。
- ☁️ 无服务器架构：依托 Vercel Serverless Function 实现弹性后端接口。
- 📊 数据持久化：Supabase 提供 Postgres 数据库支持与实时同步能力。

---

## 🧱 技术栈概览

| 技术        | 角色描述                             |
|-------------|--------------------------------------|
| **Vite**    | 极速的前端开发与构建工具             |
| **Vue 3**   | 响应式组件式前端框架                 |
| **TypeScript** | 强类型支持，保障代码可维护性     |
| **Pinia**   | 状态管理方案，替代 Vuex              |
| **Ionic UI**| 移动端 UI 框架，提供原生体验组件      |
| **Supabase**| BaaS 平台：数据库、身份认证、文件存储等 |
| **Vercel**  | 部署 Serverless Function 与托管前端    |
| **JWT**     | 用户身份认证的核心机制               |

---

## 📂 项目结构

```bash
├── api/                      # Vercel Serverless Functions
├── public/                   # 静态资源
├── database/                 # 创建必要数据库脚本、内含样例数据
├── lib/                      # 后端服务器工具函数
├── src/
│   ├── assets/               # 项目资源（图标、图片等）
│   ├── components/           # 通用组件
│   ├── layouts/              # 页面布局
│   ├── pages/                # 独立页面
│   ├── services/             # 网络请求服务 & API 接口
│   ├── stores/               # Pinia 状态管理模块
│   ├── utils/                # 工具函数
│   ├── App.vue               # 根组件
│   ├── main.ts               # 入口文件
├── supabase/                # Supabase SQL 脚本或配置
├── vite.config.ts           # Vite 配置
└── README.md
```

---

## 🔐 身份认证机制

本项目采用 JWT Token 实现前后端的权限控制：

- 使用 Supabase Auth 进行用户注册 / 登录
- JWT 存储于 LocalStorage / Cookie 中，并在请求头中作为 Bearer Token
- 后端 Serverless Function 通过解析 JWT 实现用户资源权限校验

---

## 🧮 数据结构设计（简要）

以训练记录为例：

```sql
CREATE TABLE
  sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT (20) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    is_done TINYINT (1) NOT NULL,
    status VARCHAR(255) NOT NULL,
    notes VARCHAR(255)
  );
```

Supabase 数据库采用 PostgreSQL，表结构设计遵循范式，支持 RLS（Row Level Security） 保障用户数据隔离。

---

## ☁️ Serverless Function 示例

位于 `/api/` 目录的 API 可在 Vercel Serverless 环境中自动部署：

```ts
// api/session/start.ts
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

  const data: SessionData = req.body;

  if (!data.user_id) {
    return res.status(400).json({
      success: false,
      error: "user_id 为必填字段"
    });
  }
  //...
}
```

---

## 🧪 本地开发与运行

1. 安装依赖：

```bash
npm install
```

2. 启动开发环境：

```bash
vercel dev
```

---

## 🚀 部署指南

本项目已适配 Vercel 一键部署：

- 前端部署至 Vercel（支持自动 CI/CD）
- Serverless API 自动生效
- 环境变量通过 Vercel Dashboard 配置

---

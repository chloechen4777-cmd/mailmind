# MailMind — AI 邮件助手

按品牌/项目智能分类邮件，模仿你的风格起草回复（Reply All），一键翻译英文邮件。

## 技术栈

- 纯前端 HTML + CSS + Vanilla JS
- Gmail API（OAuth 2.0）
- Vercel Serverless Function 代理 AI API
- 任意 OpenAI 兼容 API（Sandbox Crew / DeepSeek / OpenRouter / OpenAI 等）

## 部署到 Vercel（免费）

### 1. 准备工作

- [Vercel](https://vercel.com) 账号（用 GitHub 登录）
- [Google Cloud Console](https://console.cloud.google.com) 项目，启用 Gmail API，创建 OAuth 客户端
- 一个 OpenAI 兼容的 API Key

### 2. 部署

1. 把项目文件夹上传到 GitHub 仓库
2. 在 Vercel 中导入该仓库，直接部署（无需构建命令）
3. 部署成功后得到 `https://xxx.vercel.app`

### 3. 配置 Google OAuth

1. 打开 [Google Cloud Console 凭据](https://console.cloud.google.com/apis/credentials)
2. 点击你的 OAuth 2.0 客户端 ID
3. **已授权的 JavaScript 来源** 添加：`https://你的域名.vercel.app`
4. **已授权的重定向 URI** 添加：`https://你的域名.vercel.app`
5. 保存

### 4. 使用

1. 打开 Vercel 网址
2. 填入 Google Client ID、API Key、API Base URL、模型名
3. 点击「连接 Gmail 账号」授权
4. 点「智能分类」整理收件箱
5. 点邮件用 AI 起草回复

## 本地运行

```bash
cd mailmind
npx serve .
```

打开 `http://localhost:3000`

## 修复记录

- ✅ AI API 代理支持动态 Base URL（之前硬编码导致 API 无法拉起）
- ✅ 修复中文邮件发送编码问题（之前用 unescape 导致乱码）
- ✅ 修复 Vercel 404 问题（SPA rewrite 规则修正）
- ✅ 修复 Google OAuth 重定向 URI 边界情况
- ✅ 改进错误提示和超时处理

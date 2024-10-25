# English Battle Bro

一個基於 MERN (MongoDB, Express, React, Node.js) 架構的英語學習對戰平台，支持 Google 帳號登入。

## 功能特點

- Google 帳號整合登入
- 單人練習模式
- 多人對戰模式
- 即時排行榜
- 個人進度追蹤

## 技術架構

### 前端
- React.js
- React Router DOM
- Google OAuth 2.0
- Vite

### 後端
- Node.js
- Express
- MongoDB
- Mongoose
- Cors

## 環境要求

- Node.js 16.x 或更高版本
- MongoDB
- Google OAuth 憑證

## 環境變量設置

創建 `.env` 文件：
- PORT=5000
- MONGODB_URI=你的MongoDB連接URL
- NODE_ENV=development


### 生產環境
bash
- npm run build
- npm start


## API 路由

- `GET /api/records` - 獲取記錄
- 更多 API 路由...

## 部署

本項目可以部署在 Render 等平台上。確保設置正確的環境變量。' > README.md

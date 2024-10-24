import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import recordRoutes from './routes/recordRoutes.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module 中獲取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API 路由
app.use('/api/records', recordRoutes);

// 判斷環境
if (process.env.NODE_ENV === 'production') {
    // 提供前端靜態檔案
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // 所有非 API 的請求都返回前端的 index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
} else {
    // 開發環境下的測試路由
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
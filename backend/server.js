import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import recordRoutes from './routes/recordRoutes.js';
import cors from 'cors'; // 引入 cors

dotenv.config();
connectDB();

const app = express();

app.use(cors()); // 使用 cors 中间件
app.use(express.json()); // 解析 JSON 请求体

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/records', recordRoutes); // 使用记录路由

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import recordRoutes from './routes/recordRoutes.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

// ES Module 中獲取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite 的默認端口
    methods: ["GET", "POST"]
  }
});

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

// Socket.io 連接處理
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id); // 當用戶連接時打印用戶ID

  // 當用戶加入房間時
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId); // 加入指定的房間
    console.log(`User ${socket.id} joined room ${roomId}`); // 打印用戶加入的房間ID
  });

  // 當用戶離開房間時
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId); // 離開指定的房間
    console.log(`User ${socket.id} left room ${roomId}`); // 打印用戶離開的房間ID
  });

  // 當用戶斷開連接時
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id); // 打印用戶斷開連接的ID
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
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

// 存儲等待匹配的玩家
let waitingPlayers = [];

// Socket.io 連接處理
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id); // 當用戶連接時打印用戶ID

  // 當用戶請求隨機匹配時
  socket.on('joinRandomMatch', (data) => {
    console.log('Player requesting match:', data);

    // 如果已經有玩家在等待
    if (waitingPlayers.length > 0) {
      const opponent = waitingPlayers.shift(); // 取出第一個等待的玩家
      const roomCode = `room_${Date.now()}`; // 生成房間代碼

      // 準備玩家信息
      const players = {
        playerA: {
          socketId: opponent.socketId,
          userInfo: opponent.userInfo
        },
        playerB: {
          socketId: data.socketId,
          userInfo: data.userInfo
        }
      };

      // 通知兩個玩家匹配成功
      io.to(opponent.socketId).emit('matchFound', roomCode, players);
      io.to(data.socketId).emit('matchFound', roomCode, players);
      
      console.log('Match found:', { roomCode, players });
    } else {
      // 如果沒有其他玩家，加入等待列表
      waitingPlayers.push(data);
      console.log('Player added to waiting list:', data);
    }
  });

  // 當玩家回答題目時
  socket.on('answerSubmitted', ({ roomCode, socketId, questionIndex, isCorrect }) => {
    // 通知房間內的其他玩家
    socket.to(roomCode).emit('rivalAnswered', {
      questionIndex,
      isCorrect
    });
    
    console.log(`Player ${socketId} answered question ${questionIndex} (correct: ${isCorrect})`);
  });

  // 當玩家重新加入房間時
  socket.on('rejoinRoom', ({ roomCode, socketId }) => {
    console.log(`Player ${socketId} rejoining room ${roomCode}`);
    socket.join(roomCode);
    });

  // 當用戶斷開連接時
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id); // 打印用戶斷開連接的ID
    // 從等待列表中移除斷開連接的玩家
    waitingPlayers = waitingPlayers.filter(player => player.socketId !== socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
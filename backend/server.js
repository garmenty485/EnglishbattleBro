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
    origin: [
      "http://localhost:5173",
      "http://172.20.10.3:5173", 
      "https://englishbattlebro.onrender.com"
    ],
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://172.20.10.3:5173",
    "https://englishbattlebro.onrender.com"
  ]
}));
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
// 存儲創建的房間
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  // 隨機配對邏輯
  socket.on('joinRandomMatch', (data) => {
    console.log('Player requesting match:', data);

    if (waitingPlayers.length > 0) {
      const opponent = waitingPlayers.shift();
      const roomCode = `room_${Date.now()}`;
      
      socket.join(roomCode);
      const opponentSocket = io.sockets.sockets.get(opponent.socketId);
      if (opponentSocket) {
        opponentSocket.join(roomCode);
      }

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

      // 改用 matchSuccess
      io.to(roomCode).emit('matchSuccess', { roomCode, players });
      console.log('Match found:', { roomCode, players });
    } else {
      waitingPlayers.push(data);
      console.log('Player added to waiting list:', data);
    }
  });

  // 創建房間邏輯
  socket.on('createRoom', ({ roomCode, userInfo, socketId }) => {
    rooms.set(roomCode, {
      playerA: { socketId, userInfo },
      playerB: null
    });
    socket.join(roomCode);
  });

  // 加入房間邏輯
  socket.on('joinRoom', ({ roomCode, userInfo, socketId }) => {
    const room = rooms.get(roomCode);
    if (!room) {
      socket.emit('error', { message: '房間不存在' });
      return;
    }
    
    if (room.playerB) {
      socket.emit('error', { message: '房間已滿' });
      return;
    }

    room.playerB = { socketId, userInfo };
    socket.join(roomCode);
    
    // 使用相同的 matchSuccess 事件
    io.to(roomCode).emit('matchSuccess', {
      roomCode,
      players: {
        playerA: room.playerA,
        playerB: room.playerB
      }
    });
  });

  // 當玩家回答題目時
  socket.on('answerSubmitted', ({ roomCode, socketId, questionIndex, isCorrect }) => {
    // 確保玩家在房間中
    const rooms = [...socket.rooms];
    if (!rooms.includes(roomCode)) {
      socket.join(roomCode);
    }

    // 通知房間內的其他玩家
    socket.to(roomCode).emit('rivalAnswered', {
      questionIndex,
      isCorrect,
      socketId
    });
    
    console.log(`Player ${socketId} answered question ${questionIndex} (correct: ${isCorrect}) in room ${roomCode}`);
  });

  // 當用戶斷開連接時
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id); // 打印用戶斷開連接的ID
    // 從等待列表中移除斷開連接的玩家
    waitingPlayers = waitingPlayers.filter(player => player.socketId !== socket.id);
    
    // 通知所有相關房間中的其他玩家
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.to(room).emit('playerDisconnected', socket.id);
      }
    });
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
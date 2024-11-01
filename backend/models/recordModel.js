import mongoose from 'mongoose';

const recordSchema = mongoose.Schema({
  // 遊戲基本資訊
  gameType: {
    type: String,
    enum: ['solo', 'battle'],
    required: true
  },
  battleId: {
    type: String,
    required: false,  // 只有對戰模式需要
    unique: true,     // 確保對戰ID唯一
    sparse: true      // 允許非對戰模式為 null
  },

  // 玩家資訊
  player1: {
    googleId: {
      type: String,
      required: true
    },
    googleName: {
      type: String,
      required: true
    },
    picture: String,
    score: {
      type: Number,
      required: true
    }
  },

  // 對手資訊（對戰模式用）
  player2: {
    googleId: String,
    googleName: String,
    picture: String,
    score: Number
  },

  // 遊戲內容
  words: [{
    word: String,
    definition1: String,
    definition2: String
  }],

  // 對戰相關（對戰模式用）
  winnerId: String,
  completed: {
    type: Boolean,
    default: true  // 單人模式直接設為 true
  }
}, {
  timestamps: true
});

const Record = mongoose.model('Record', recordSchema);
export default Record;
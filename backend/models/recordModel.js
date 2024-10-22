import mongoose from 'mongoose';

const recordSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  result: {
    type: String,
    required: false, // 在單人模式下，result 不是必需的
    enum: ['win', 'lose'], 
  },
  score: {
    type: Number,
    required: true,
  },
  opponentScore: {
    type: Number,
    required: false, // 在單人模式下，opponentScore 不是必需的
  },
  words: {
    type: [{
      word: { type: String, required: true },
      definition1: { type: String, required: true },
      definition2: { type: String, required: true }
    }],
    required: true,
  },
}, {
  timestamps: true,
});

const Record = mongoose.model('Record', recordSchema);

export default Record;
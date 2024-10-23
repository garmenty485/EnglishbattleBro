import mongoose from 'mongoose';

const recordSchema = mongoose.Schema({
  score: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
});

const Record = mongoose.model('Record', recordSchema);

export default Record;
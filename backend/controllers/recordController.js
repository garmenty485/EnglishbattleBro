import Record from '../models/recordModel.js';

// @desc    Create a new record
// @route   POST /api/records
// @access  Private
const createRecord = async (req, res) => {
  try {
    const { result, score, opponentScore, words } = req.body;

    const record = new Record({
      userId: req.user._id,
      result,
      score,
      opponentScore,
      words,
    });

    // 保存新记录
    const createdRecord = await record.save();

    // 获取用户的所有记录
    const userRecords = await Record.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // 如果记录超过三条，删除最旧的记录
    if (userRecords.length > 3) {
      const recordsToDelete = userRecords.slice(3);
      for (const record of recordsToDelete) {
        await Record.findByIdAndDelete(record._id);
      }
    }

    res.status(201).json(createdRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { createRecord };
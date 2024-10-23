import Record from '../models/recordModel.js';

// @desc    Create a new record
// @route   POST /api/records
// @access  Private
const createRecord = async (req, res) => {
  try {
    const { score } = req.body;
    
    console.log('Received request body:', req.body);
    console.log('Score value:', score, 'Type:', typeof score);

    // 更严格的类型检查
    if (score === undefined || score === null) {
      return res.status(400).json({ 
        message: 'Score is required',
        receivedValue: score 
      });
    }

    // 尝试转换为数字
    const numericScore = Number(score);
    
    if (isNaN(numericScore)) {
      return res.status(400).json({ 
        message: 'Score must be a valid number',
        receivedValue: score,
        receivedType: typeof score
      });
    }

    const record = new Record({
      score: numericScore
    });

    const createdRecord = await record.save();
    console.log('Record created:', createdRecord);
    
    res.status(201).json(createdRecord);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(400).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export { createRecord };
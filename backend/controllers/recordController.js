import Record from '../models/recordModel.js';

// @desc    Create a new record
// @route   POST /api/records
// @access  Private
const createRecord = async (req, res) => {
  try {
    const { gameType = 'solo', player1, words, battleId } = req.body;
    
    console.log('Received request body:', req.body);

    // 添加详细的验证
    if (!player1) {
      return res.status(400).json({ 
        message: 'Missing player1 data',
        receivedData: req.body
      });
    }

    if (!player1.googleId || !player1.googleName) {
      return res.status(400).json({ 
        message: 'Missing required player fields',
        required: ['googleId', 'googleName'],
        received: player1
      });
    }

    if (typeof player1.score !== 'number') {
      return res.status(400).json({ 
        message: 'Invalid score type',
        required: 'number',
        received: typeof player1.score
      });
    }

    if (!Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ 
        message: 'Invalid words data',
        required: 'non-empty array',
        received: words
      });
    }

    const recordData = {
      gameType,
      player1,
      words,
      ...(battleId && { battleId }),
      submitted: true
    };

    const record = new Record(recordData);
    const savedRecord = await record.save();
    
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(400).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export { createRecord };
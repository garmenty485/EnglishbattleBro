import Record from '../models/recordModel.js';

export const createRecord = async (req, res) => {
  try {
    // 改用更清楚的命名
    const { gameType, battleId, player1: currentPlayer, words, submitted } = req.body;

    if (gameType === 'battle' && battleId) {
      // 使用 findOneAndUpdate 来确保原子性操作
      const record = await Record.findOneAndUpdate(
        { battleId },
        {
          $setOnInsert: {  // 如果是新记录，设置这些字段
            gameType,
            battleId,
            words,
            player1: currentPlayer,  // 這裡比較清楚：把當前玩家設為 player1
            submitted: false
          }
        },
        { 
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );

      // 這裡的判斷邏輯更清晰了
      if (record.player1 && record.player1.googleId !== currentPlayer.googleId) {
        const finalRecord = await Record.findOneAndUpdate(
          { battleId },
          {
            player2: currentPlayer,  // 把當前玩家設為 player2
            submitted: true,
            winnerId: record.player1.score > currentPlayer.score 
              ? record.player1.googleId 
              : currentPlayer.googleId
          },
          { new: true }
        );
        return res.json(finalRecord);
      }

      return res.json(record);
    }

    // 單人模式
    const record = new Record({
      ...req.body,
      player1: currentPlayer  // 這裡也更清楚了
    });
    const savedRecord = await record.save();
    return res.json(savedRecord);

  } catch (error) {
    console.error('Error in createRecord:', error);
    return res.status(400).json({ 
      message: error.message,
      details: error.stack 
    });
  }
};

export const getBattleRecord = async (req, res) => {
  try {
    const { battleId } = req.params;
    const record = await Record.findOne({ battleId });
    
    if (!record) {
      return res.status(404).json({ message: 'Battle record not found' });
    }
    
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
import Record from '../models/recordModel.js';

export const createRecord = async (req, res) => {
  try {
    const { gameType, battleId, player1, words, submitted } = req.body;

    if (gameType === 'battle' && battleId) {
      // 使用 findOneAndUpdate 来确保原子性操作
      const record = await Record.findOneAndUpdate(
        { battleId },
        {
          $setOnInsert: {  // 如果是新记录，设置这些字段
            gameType,
            battleId,
            words,
            player1,
            submitted: false
          }
        },
        { 
          upsert: true,  // 如果记录不存在则创建
          new: true,     // 返回更新后的文档
          setDefaultsOnInsert: true  // 设置默认值
        }
      );

      // 如果记录已经有 player1，说明这是第二个玩家
      if (record.player1 && record.player1.googleId !== player1.googleId) {
        // 更新为完整的对战记录
        const finalRecord = await Record.findOneAndUpdate(
          { battleId },
          {
            player2: player1,
            submitted: true,
            winnerId: record.player1.score > player1.score 
              ? record.player1.googleId 
              : player1.googleId
          },
          { new: true }
        );
        return res.json(finalRecord);
      }

      return res.json(record);
    }

    // 单人模式逻辑保持不变
    const record = new Record(req.body);
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
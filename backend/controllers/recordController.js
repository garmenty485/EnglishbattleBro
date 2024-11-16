import Record from '../models/recordModel.js';

export const createRecord = async (req, res) => {
  try {
    // 改用更清楚的命名
    const { gameType, battleId, player1: currentPlayer, words, completed } = req.body;

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
            completed: false
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
            completed: true,
            winnerId: record.player1.score > currentPlayer.score
              ? record.player1.googleId
              : record.player1.score < currentPlayer.score
                ? currentPlayer.googleId
                : 'tie'  // 当分数相等时，设置为平手
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

export const getUserRecords = async (req, res) => {
  try {
    const { googleId } = req.params;
    console.log('Backend: Fetching records for googleId:', googleId);

    const records = await Record.find({
      $or: [
        { 'player1.googleId': googleId },
        { 'player2.googleId': googleId }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(10);

    console.log('Backend: Found records:', records.length);
    
    const formattedRecords = records.map(record => {
      const isPlayer1 = record.player1.googleId === googleId;
      return {
        date: record.createdAt,
        gameType: record.gameType,
        score: isPlayer1 ? record.player1.score : record.player2.score,
        rival: !isPlayer1 ? {
          name: record.player1.googleName,
          picture: record.player1.picture,
          score: record.player1.score
        } : record.player2 ? {
          name: record.player2.googleName,
          picture: record.player2.picture,
          score: record.player2.score
        } : null,
        words: record.words,
        winnerId: record.winnerId
      };
    });

    console.log('Backend: Sending formatted records');
    res.json(formattedRecords);
  } catch (error) {
    console.error('Backend Error:', error);
    res.status(500).json({ message: error.message });
  }
};

//export const deleteAllRecords = async (req, res) => {
//  try {
//    await Record.deleteMany({});
//    res.json({ message: '所有記錄已成功刪除' });
//  } catch (error) {
//    res.status(400).json({ message: error.message });
//  }
//};
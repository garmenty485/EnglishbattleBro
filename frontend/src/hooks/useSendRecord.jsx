import { useEffect } from 'react';
import axios from 'axios';
import questions from '../assets/questions.json';

function useSendRecord(isModalOpen, score, userInfo, gameType = 'solo', battleId = null) {
  useEffect(() => {
    if (!isModalOpen) return;

    const sendRecordToBackend = async () => {
      try {
        if (!userInfo) {
          console.log('Guest mode: record not saved');
          return;
        }

        // 从 questions.json 获取单词数据并转换格式
        const words = questions.map(q => ({
          word: q.question,
          definition1: q.definition1,
          definition2: q.definition2
        }));

        const recordData = {
          gameType,
          player1: {
            googleId: userInfo.email,
            googleName: userInfo.name,
            picture: userInfo.picture,
            score: score
          },
          words,
          ...(battleId && { battleId })  // 只在對戰模式添加 battleId
        };

        console.log('Sending record data:', recordData); // 添加调试日志

        const response = await axios.post('/api/records', recordData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Record sent successfully:', response.data);
        console.log('userInfo check', userInfo);
      } catch (error) {
        console.error('Error sending record:', error);
        if (error.response) {
          console.error('Server response:', error.response.data);
        }
      }
    };

    sendRecordToBackend();
  }, [isModalOpen, score, userInfo, gameType, battleId]);
}

export default useSendRecord;
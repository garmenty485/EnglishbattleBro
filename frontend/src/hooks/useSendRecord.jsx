import { useEffect } from 'react';
import axios from 'axios';
import questions from '../assets/questions.json';

function useSendRecord(isModalOpen, score, userInfo, gameType = 'solo', battleId = null, rival = null) {
  useEffect(() => {
    if (!isModalOpen) return;

    const sendRecordToBackend = async () => {
      try {
        // 在对战模式下，即使是访客也需要发送记录
        if (
          (!userInfo && gameType === 'solo') ||
          (gameType === 'battle' && !userInfo && (!rival?.userInfo))
        ) {
          console.log('Record not saved: Either solo guest or both players are guests');
          return;
        }

        const words = questions.map(q => ({
          word: q.question,
          definition1: q.definition1,
          definition2: q.definition2
        }));

        const recordData = {
          gameType,
          ...(battleId && { battleId }),
          player1: {
            googleId: userInfo?.email || 'guest',
            googleName: userInfo?.name || 'Guest Player',
            picture: userInfo?.picture || null,
            score: score
          },
          words,
          completed: gameType === 'solo'
        };

        console.log('Sending record data:', recordData);

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
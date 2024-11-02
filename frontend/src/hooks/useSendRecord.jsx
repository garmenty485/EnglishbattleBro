import { useEffect } from 'react';
import axios from 'axios';

function useSendRecord(isModalOpen, score, userInfo, gameType = 'solo', battleId = null, rival = null, questions = null) {
  useEffect(() => {
    if (!isModalOpen || !questions) return;

    const sendRecordToBackend = async () => {
      try {
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
        const response = await axios.post('/api/records', recordData);
        console.log('Record sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending record:', error);
      }
    };

    sendRecordToBackend();
  }, [isModalOpen, score, userInfo, gameType, battleId, questions]);
}

export default useSendRecord;
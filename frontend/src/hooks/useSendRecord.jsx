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

        const words = questions.map(q => ({
          word: q.question,
          definition1: q.definition1,
          definition2: q.definition2
        }));

        const recordData = {
          gameType,
          ...(battleId && { battleId }),
          player1: {
            googleId: userInfo.email,
            googleName: userInfo.name,
            picture: userInfo.picture,
            score: score
          },
          words,
          submitted: gameType === 'solo'
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
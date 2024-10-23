import { useEffect } from 'react';
import axios from 'axios';

const useSendRecord = (isModalOpen, score) => {
  useEffect(() => {
    const sendRecordToBackend = async () => {
      try {
        // 檢查 score 是否為數字
        if (typeof score !== 'number') {
          console.error('Invalid score type:', typeof score);
          return;
        }

        const recordData = {
          score: score
        };

        const response = await axios.post('http://localhost:5000/api/records', recordData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Record sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending record:', error.response?.data || error.message);
      }
    };

    if (isModalOpen && typeof score === 'number') {
      sendRecordToBackend();
    }
  }, [isModalOpen, score]);
};

export default useSendRecord;
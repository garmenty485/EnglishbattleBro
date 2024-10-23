import { useEffect } from 'react';
import axios from 'axios';

// 添加 userInfo 參數
const useSendRecord = (isModalOpen, score, userInfo) => {
  useEffect(() => {
    // 先在外層檢查是否為 guest mode
    if (isModalOpen && typeof score === 'number') {
      if (!userInfo) {
        console.log('Guest mode: record not saved');  // 這樣就會打印出來
        return;
      }
      
      // 只有登入用戶才會執行這個函數
      const sendRecordToBackend = async () => {
        try {
          const recordData = {
            score: score
          };
          
          const response = await axios.post('/api/records', recordData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          console.log('Record sent successfully:', response.data);
        } catch (error) {
          console.error('Error sending record:', error);
        }
      };

      sendRecordToBackend();
    }
  }, [isModalOpen]);  //只有modal改變時才會執行
};

export default useSendRecord;
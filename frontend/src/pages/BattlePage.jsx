//暫時為空 未來使用
// // 對戰模式 useSendRecord

import useSendRecord from '../hooks/useSendRecord';

function BattlePage() {
  // 模拟小华的数据
  const xiaohuaData = {
    email: 'xiaohua@gmail.com',
    name: '小华',
    picture: 'https://example.com/xiaohua.jpg'
  };

  // 模拟小明的数据
  const xiaomingData = {
    email: 'xiaoming@gmail.com',
    name: '小明',
    picture: 'https://example.com/xiaoming.jpg'
  };

  // 模拟对战ID
  const battleId = 'test_battle_66';

  // 模拟小华先完成游戏，得分450
  useSendRecord(true, 450, xiaohuaData, 'battle', battleId);

  // 模拟小明后完成游戏，得分380
  useSendRecord(true, 451, xiaomingData, 'battle', battleId);

  return (
    <div>Testing Battle Mode...</div>
  );
}

export default BattlePage;
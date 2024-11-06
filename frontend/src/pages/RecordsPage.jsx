// ... 其他 imports 保持不變

import { useState } from 'react';
import { Box, Image, Text, Table, Thead, Tbody, Tr, Td, Th, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';

function RecordsPage({ userInfo }) {  // 添加 userInfo 參數
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]);

  // 創建10個空的記錄
  const emptyRecords = Array(10).fill({
    date: '-',
    score: '-',
    rival: {
      image: '',
      name: '-'
    },
    rivalScore: '-',
    winner: {
      image: ''
    },
    words: ['apple', 'banana', 'orange', 'grape', 'watermelon'] // 測試用單字
  });

  const handleWordsClick = (words) => {
    setSelectedWords(words);
    setIsModalOpen(true);
  };

  return (
    <Box p={5}>
      {/* 玩家資訊區 */}
      <Box display="flex" mb={6}>
        <Box
          w="100px"
          h="100px"
          bg="orange.400"
          mr={4}
          borderRadius="md"
          overflow="hidden"
        >
          <Image
            src={userInfo?.picture}
            alt={userInfo?.name}
            fallbackSrc="https://via.placeholder.com/100"
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </Box>
        <Box
          flex={1}
          bg="blue.400"
          p={4}
          borderRadius="md"
          display="flex"
          alignItems="center"
        >
          <Text color="white" fontSize="xl">
            {userInfo?.name || 'Unknown Player'}
          </Text>
        </Box>
      </Box>

      {/* 對戰記錄表格 */}
      <Table
        variant="simple"
        size="sm"  // 改為 sm 使行高變小
        borderRadius="lg"
        overflow="hidden"
      >
        <Thead>
          <Tr bg="blue.400">
            <Th color="white" py={3}>Date</Th>
            <Th color="white" py={3}>Score</Th>
            <Th color="white" py={3}>Rival</Th>
            <Th color="white" py={3}>Rival's Score</Th>
            <Th color="white" py={3}>Winner</Th>
            <Th color="white" py={3}>Words</Th>
          </Tr>
        </Thead>
        <Tbody>
          {emptyRecords.map((record, index) => (
            <Tr
              key={index}
              bg={index % 2 === 0 ? 'gray.50' : 'white'}
              _hover={{ bg: 'gray.100' }}
            >
              <Td py={2}>{record.date}</Td>
              <Td py={2}>{record.score}</Td>
              <Td py={2}>
                <Box display="flex" alignItems="center">
                  <Image
                    src={record.rival.image}
                    alt="Rival"
                    fallbackSrc="https://via.placeholder.com/30"  // 縮小圖片
                    boxSize="30px"  // 縮小圖片
                    borderRadius="full"
                    mr={2}
                  />
                  <Text fontSize="sm">{record.rival.name}</Text>
                </Box>
              </Td>
              <Td py={2}>{record.rivalScore}</Td>
              <Td py={2}>
                <Image
                  src={record.winner.image}
                  alt="Winner"
                  fallbackSrc="https://via.placeholder.com/30"  // 縮小圖片
                  boxSize="30px"  // 縮小圖片
                  borderRadius="full"
                />
              </Td>
              <Td py={2}>
                <Button
                  colorScheme="blue"
                  size="xs"  // 改為 xs 使按鈕變小
                  onClick={() => handleWordsClick(record.words)}
                  isDisabled={false} // 移除禁用條件
                >
                  Words
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* 單字列表 Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>單字列表</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedWords.map((word, index) => (
              <Text key={index} fontSize="lg" mb={2}>
                {word}
              </Text>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default RecordsPage;
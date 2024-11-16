import { useState } from 'react';
import {
  Box,
  Image,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Center,
  Spinner,
  Flex,
  Container,
  TableContainer
} from '@chakra-ui/react';
import { useRecords } from '../hooks/useRecords';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

function RecordsPage({ userInfo }) {
  const { records, isLoading } = useRecords(userInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]);

  const handleWordsClick = (words) => {
    setSelectedWords(words);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <Center h="100vh"><Spinner size="xl" /></Center>;
  }

  return (
    <Container
      maxWidth={{ base: "95%", md: "1200px" }}
      width="100%"
      margin="0 auto"
      padding={{ base: "10px", md: "20px" }}
      border="4px solid"
      borderColor="black"
      borderRadius="8px"
      minH={{ base: "100vh", md: "90vh" }}
      bg="yellow.100"
    >
      {/* Player Info Section */}
      <Flex
        direction={{ base: "column", sm: "row" }}
        align="center"
        justify="center"
        gap={4}
        mb={6}
        bg="orange.400"
        p={6}
        borderRadius="md"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      >
        <Image
          src={userInfo?.picture}
          alt={userInfo?.name}
          fallbackSrc="https://via.placeholder.com/100"
          boxSize={{ base: "80px", sm: "100px" }}
          borderRadius="full"
          border="3px solid"
          borderColor="white"
          boxShadow="0 0 0 4px rgba(0,0,0,0.2)"
        />
        <Text
          color="white"
          fontSize={{ base: "xl", sm: "3xl" }}
          fontWeight="bold"
          textShadow="2px 2px #000"
          textAlign="center"
        >
          {userInfo?.name || 'Unknown Player'}
        </Text>
      </Flex>

      {/* Battle Records Table */}
      <TableContainer
        overflowX="auto"
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        border="3px solid black"
      >
        <Table variant="simple" size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr bg="orange.400">
              <Th color="white" display={{ base: "none", md: "table-cell" }} 
                textShadow="1px 1px #000" fontSize={{ base: "xs", md: "md" }}>Time</Th>
              <Th color="white" textShadow="1px 1px #000" fontSize={{ base: "xs", md: "md" }}>Score</Th>
              <Th color="white" textShadow="1px 1px #000" fontSize={{ base: "xs", md: "md" }}>Rival</Th>
              <Th color="white" textShadow="1px 1px #000" fontSize={{ base: "xs", md: "md" }}>Rival Score</Th>
              <Th color="white" textShadow="1px 1px #000" fontSize={{ base: "xs", md: "md" }}>Result</Th>
              <Th color="white" textShadow="1px 1px #000" fontSize={{ base: "xs", md: "md" }}>Words</Th>
            </Tr>
          </Thead>
          <Tbody>
            {records.map((record, index) => (
              <Tr
                key={index}
                bg={index % 2 === 0 ? 'gray.50' : 'white'}
                _hover={{ bg: 'gray.100' }}
              >
                <Td display={{ base: "none", md: "table-cell" }} 
                    fontSize={{ base: "xs", md: "md" }}
                    fontWeight="bold">
                  {formatDistanceToNow(new Date(record.date), { locale: enUS, addSuffix: true })}
                </Td>
                <Td fontSize={{ base: "xs", md: "md" }} fontWeight="bold">{record.score}</Td>
                <Td>
                  {record.gameType === 'solo' ? (
                    <Text fontSize={{ base: "xs", md: "md" }} fontWeight="bold">Solo</Text>
                  ) : record.rival ? (
                    <Flex align="center">
                      <Image
                        src={record.rival.picture}
                        alt={record.rival.name}
                        fallbackSrc="https://via.placeholder.com/30"
                        boxSize={{ base: "20px", md: "30px" }}
                        borderRadius="full"
                        mr={2}
                        border="2px solid"
                        borderColor="orange.400"
                      />
                      <Text fontSize={{ base: "xs", md: "md" }} fontWeight="bold">{record.rival.name}</Text>
                    </Flex>
                  ) : (
                    '-'
                  )}
                </Td>
                <Td fontSize={{ base: "xs", md: "md" }} fontWeight="bold">
                  {record.rival ? record.rival.score : '-'}
                </Td>
                <Td fontSize={{ base: "xs", md: "md" }} fontWeight="bold">
                  <Text
                    color={record.gameType === 'battle' ? 
                      (record.winnerId === userInfo.email ? 'green.500' : 
                       record.winnerId === 'tie' ? 'orange.500' : 'red.500') 
                      : 'black'}
                  >
                    {record.gameType === 'battle' ? (
                      record.winnerId === userInfo.email ? 'Win' :
                      record.winnerId === 'tie' ? 'Tie' : 'Loss'
                    ) : '-'}
                  </Text>
                </Td>
                <Td>
                  <Button
                    colorScheme="orange"
                    size={{ base: "xs", md: "sm" }}
                    onClick={() => handleWordsClick(record.words)}
                    fontWeight="bold"
                    boxShadow="md"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  >
                    Words
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Word List Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent mx={4}>
          <ModalHeader bg="blue.400" color="white" borderTopRadius="md">
            Word List
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            {selectedWords.map((word, index) => (
              <Text
                key={index}
                fontSize={{ base: "md", md: "lg" }}
                mb={2}
                p={2}
                bg={index % 2 === 0 ? 'gray.50' : 'white'}
                borderRadius="md"
              >
                {word.word}
              </Text>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default RecordsPage;
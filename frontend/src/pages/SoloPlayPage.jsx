import { Text, Flex, Box, Container, Button, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react";
import useSoloPlayLogic from '../hooks/useSoloPlayLogic';
import useSendRecord from '../hooks/useSendRecord';


function SoloPlayPage({ userInfo }) {
  const {
    currentQuestionIndex,
    answer,
    score,
    isButtonDisabled,
    isFirstLetterRevealed,
    showScoreBonus,
    showScorePenalty,
    isSecondDefinitionRevealed,
    isModalOpen,
    showHint,
    currentQuestion,
    revealFirstLetter,
    revealSecondDefinition,
    skipQuestion,
    handleCloseModal
  } = useSoloPlayLogic(userInfo);

  // 使用 useSendRecord hook
  useSendRecord(isModalOpen, score, userInfo);

  return (
    <Container
      maxWidth="500px"
      width="100%"
      margin="0 auto"
      padding="20px"
      border="4px solid"
      borderColor="black"
      borderRadius="8px"
      minH="90vh"
      bg="yellow.100"
    >
      {/* 视图代码保持不变 */}
      <Flex justify="space-between" align="center" mb={4} position="relative">
        <Box>
          {userInfo ? (
            <Image src={userInfo.picture} boxSize="40px" borderRadius="full" />
          ) : (
            <Text fontFamily="Comic Sans MS" color="pink.600" fontSize="xl" fontWeight="bold">
              Guest Mode
            </Text>
          )}
        </Box>
        <Flex
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
          justify="center"
          align="center"
        >
          <Text fontFamily="Comic Sans MS" color="pink.600" textShadow="2px 2px #FFA07A" fontSize="3xl" fontWeight="bold">
            #{currentQuestionIndex + 1}
          </Text>
        </Flex>
      </Flex>

      <Box bg="yellow.400" color="white" p={4} borderRadius="md" mb={4} w="450px">
        <Text fontSize="3xl">
          💰 <Text as="span" fontWeight="bold" color="black">{score}</Text>
          {showScoreBonus && (
            <Text
              as="span"
              fontWeight="bold"
              ml={2}
              bgGradient="linear(to-r, red.500, yellow.500, green.500, blue.500, purple.500)"
              bgClip="text"
            >
              + $100
            </Text>
          )}
          {showScorePenalty && (
            <Text
              as="span"
              fontWeight="bold"
              ml={2}
              color="red.600"
            >
              - $30
            </Text>
          )}
        </Text>
      </Box>

      <Flex justify="center" mb={4} position="relative">
        <Box bg="pink.500" color="black" p={4} borderRadius="md" position="relative">
          <Box
            as="input"
            fontSize="2xl"
            letterSpacing={4}
            textAlign="center"
            border="none"
            bg="transparent"
            color="black"
            width="100%"
            outline="none"
            value={
              (isFirstLetterRevealed ? answer.charAt(0) : answer.charAt(0)) +
              answer.slice(1) +
              Array(currentQuestion.question.length - answer.length).fill("_").join("")
            }
            readOnly
            sx={{
              '::placeholder': {
                color: 'black',
              },
              WebkitTapHighlightColor: 'transparent',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
          />
          <Box
            as="input"
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            opacity={0}
            type="text"
            autoComplete="off"
            // 防止输入框获得焦点时页面滚动
            onFocus={(e) => {
              e.target.style.transform = 'translateY(-100vh)';
              e.target.style.position = 'absolute';
            }}
            // 失去焦点时恢复位置
            onBlur={(e) => {
              e.target.style.transform = 'none';
              e.target.style.position = 'absolute';
            }}
          />
        </Box>
        {showHint && (
          <Box position="absolute" right="-30px" top="-30%" transform="translateY(-50%)" bg="pink.500" color="black" p={2} borderRadius="md" border="2px solid white" boxShadow="5px 5px 0px #000">
            Type the Answer
          </Box>
        )}
      </Flex>

      <Flex justify="center" mb={1} mt={10}>
        <Box bg="pink.500" color="black" p={4} borderRadius="md" mb={4} w="90%" maxW="700px" textAlign="center">
          <Text fontSize="lg" whiteSpace="pre-wrap" fontFamily="Comic Sans MS" color="yellow.300">{currentQuestion.definition1}</Text>
        </Box>
      </Flex>

      <Flex justify="center" mb={4}>
        <Box bg="pink.500" color="black" p={4} borderRadius="md" mb={2} w="90%" maxW="700px" textAlign="center" opacity={isSecondDefinitionRevealed ? 1 : 0.5}>
          <Text fontSize="lg" whiteSpace="pre-wrap" fontFamily="Comic Sans MS" color="yellow.300">{isSecondDefinitionRevealed ? currentQuestion.definition2 : "** another definition **"}</Text>
        </Box>
      </Flex>

      <Box p={4} borderRadius="md" mb={4} textAlign="center">
        <Text fontSize="lg" fontWeight="bold" fontFamily="Comic Sans MS" color="pink.500">🛎️ Options 🛎️</Text>
        <Flex justify="center">
          <Box textAlign="center">
            <Button
              size="md"
              colorScheme="teal"
              borderRadius="full"
              boxShadow="md"
              m={2}
              position="relative"
              _hover={{
                _after: {
                  content: '"Reveal a letter (cost: $30)"',
                  position: "absolute",
                  bg: "gray.700",
                  color: "white",
                  p: 2,
                  borderRadius: "md",
                  mt: 16,
                  fontSize: "sm",
                  whiteSpace: "nowrap",
                  zIndex: 9999
                }
              }}
              onClick={revealFirstLetter}
              disabled={isButtonDisabled}
            >
              💡
            </Button>
            <Text
              position="relative"
              opacity={isButtonDisabled ? 0.5 : 1}
              _hover={{
                _after: {
                  content: '"Hotkey"',
                  position: "absolute",
                  bg: "gray.700",
                  color: "white",
                  p: 2,
                  borderRadius: "md",
                  mt: 2,
                  fontSize: "sm",
                  whiteSpace: "nowrap",
                  zIndex: 9999,
                  fontWeight: "bold"
                }
              }}
            >
              ⬅️
            </Text>
          </Box>
          <Box textAlign="center">
            <Button
              size="md"
              colorScheme="yellow"
              borderRadius="full"
              boxShadow="md"
              m={2}
              position="relative"
              _hover={{
                _after: {
                  content: '"Show another definition (cost: $30)"',
                  position: "absolute",
                  bg: "gray.700",
                  color: "white",
                  p: 2,
                  borderRadius: "md",
                  mt: 16,
                  fontSize: "sm",
                  whiteSpace: "nowrap",
                  zIndex: 9999
                }
              }}
              onClick={revealSecondDefinition}
              disabled={isSecondDefinitionRevealed}
            >
              📖
            </Button>
            <Text
              position="relative"
              opacity={isSecondDefinitionRevealed ? 0.5 : 1}
              _hover={{
                _after: {
                  content: '"Hotkey"',
                  position: "absolute",
                  bg: "gray.700",
                  color: "white",
                  p: 2,
                  borderRadius: "md",
                  mt: 2,
                  fontSize: "sm",
                  whiteSpace: "nowrap",
                  zIndex: 9999,
                  fontWeight: "bold"
                }
              }}
            >
              ⬇️
            </Text>
          </Box>
          <Box textAlign="center">
            <Button
              size="md"
              colorScheme="red"
              borderRadius="full"
              boxShadow="md"
              m={2}
              position="relative"
              _hover={{
                _after: {
                  content: '"Skip this question"',
                  position: "absolute",
                  bg: "gray.700",
                  color: "white",
                  p: 2,
                  borderRadius: "md",
                  mt: 16,
                  fontSize: "sm",
                  whiteSpace: "nowrap",
                  zIndex: 9999
                }
              }}
              onClick={skipQuestion}
            >
              ⏭️
            </Button>
            <Text
              position="relative"
              _hover={{
                _after: {
                  content: '"Hotkey"',
                  position: "absolute",
                  bg: "gray.700",
                  color: "white",
                  p: 2,
                  borderRadius: "md",
                  mt: 2,
                  fontSize: "sm",
                  whiteSpace: "nowrap",
                  zIndex: 9999,
                  fontWeight: "bold"
                }
              }}
            >
              ➡️
            </Text>
          </Box>
        </Flex>
      </Box>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent bg="yellow.100" textAlign="center" border="4px solid" borderColor="yellow.300">
          <ModalHeader fontFamily="Comic Sans MS" color="pink.600">
            🎉🎉🎉&nbsp;&nbsp;&nbsp;&nbsp;COMPLETE&nbsp;&nbsp;&nbsp;&nbsp;🎉🎉🎉
          </ModalHeader>
          <ModalBody>
            <Text fontSize="2xl" fontFamily="Comic Sans MS" color="pink.600">Your Score: {score}</Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button colorScheme="pink" fontFamily="Comic Sans MS" color="yellow.300" onClick={handleCloseModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default SoloPlayPage;
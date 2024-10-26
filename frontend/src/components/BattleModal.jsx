import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  VStack,
  HStack,
  Text,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import CustomButton from './CustomButton';
import LoadingDots from './LoadingDots';

function BattleModal({ isOpen, onClose }) {
  const [battleCode, setBattleCode] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [isRandomMatch, setIsRandomMatch] = useState(false);

  // 生成隨機代碼
  const generateBattleCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreate = () => {
    const newCode = generateBattleCode();
    setBattleCode(newCode);
    setIsWaiting(true);
    setIsRandomMatch(false);
  };

  const handleMatchRandom = () => {
    setIsWaiting(true);
    setIsRandomMatch(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(battleCode);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px)"
      />
      <ModalContent
        bg="yellow.100"
        border="4px solid"
        borderColor="black"
        borderRadius="8px"
        p={4}
        mx={4}
      >
        <ModalHeader
          textAlign="center"
          fontFamily="Comic Sans MS"
          fontSize="2xl"
          color="pink.600"
          pb={2}
        >
          ⚔️ Battle Mode ⚔️
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          {!isWaiting ? (
            <VStack spacing={6}>
              <CustomButton
                icon="🎯"
                text="Build a room"
                onClick={handleCreate}
                width="100%"
              />

              <HStack width="100%" spacing={2}>
                <Input
                  placeholder="Enter Code"
                  onChange={(e) => setBattleCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  textAlign="center"
                  fontSize="24px"
                  bg="white"
                  border="2px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                  height="60px"
                  fontFamily="Comic Sans MS"
                  flex="1"
                />
                <CustomButton
                  icon="🔍"
                  text="Join"
                  width="145px"
                  height="60px"
                  colorScheme="red"
                />
              </HStack>
              
              <Text
                fontFamily="Comic Sans MS"
                fontSize="lg"
                color="gray.700"
                textAlign="center"
              >
                - OR -
              </Text>
              <CustomButton
                icon="🎲"
                text="Match a random player"
                width="100%"
                colorScheme="teal"
                onClick={handleMatchRandom}
              />
            </VStack>
          ) : (
            <VStack spacing={6}>
              {!isRandomMatch && (
                <CustomButton
                  icon="📋"
                  text={
                    <span>
                      {battleCode}
                      <br />
                      (press to copy code)
                    </span>
                  }
                  onClick={handleCopyCode}
                  width="100%"
                />
              )}
              <Text
                fontFamily="Comic Sans MS"
                fontSize="xl"
                color="gray.700"
                textAlign="center"
                display="flex"
                alignItems="center"
              >
                Waiting for a match
                <LoadingDots />
              </Text>
              {!isRandomMatch && (
                <Text
                  fontSize="md"
                  color="gray.600"
                  textAlign="center"
                >
                  Share this code with your friend!
                </Text>
              )}
              <CustomButton
                icon="❌"
                text="Cancel"
                onClick={() => {
                  setIsWaiting(false);
                  setBattleCode("");
                  setIsRandomMatch(false);
                }}
                colorScheme="red"
                width="100%"
              />
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default BattleModal;
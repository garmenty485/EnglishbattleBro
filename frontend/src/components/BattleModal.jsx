import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  VStack,
  Text,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import CustomButton from './CustomButton';
import LoadingDots from './LoadingDots';

function BattleModal({ isOpen, onClose }) {
  const [battleCode, setBattleCode] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const handleCreate = () => {
    if (battleCode) {
      setIsWaiting(true);
    }
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
              <Text
                fontFamily="Comic Sans MS"
                fontSize="lg"
                color="gray.700"
                textAlign="center"
              >
                Enter a battle code to create or join a game:
              </Text>
              
              <Box
                w="100%"
                bg="white"
                borderRadius="md"
                p={2}
                border="2px solid"
                borderColor="gray.300"
              >
                <Input
                  placeholder="Battle Code"
                  value={battleCode}
                  onChange={(e) => setBattleCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  textAlign="center"
                  fontSize="24px"
                  letterSpacing="0.5em"
                  border="none"
                  fontFamily="Comic Sans MS"
                  _focus={{
                    border: "none",
                    boxShadow: "none"
                  }}
                />
              </Box>

              <CustomButton
                icon="🎯"
                text="Create Battle"
                onClick={handleCreate}
                width="100%"
              />

              <CustomButton
                icon="🎪"
                text="Join Battle"
                width="100%"
                colorScheme="teal"
              />
            </VStack>
          ) : (
            <VStack spacing={6}>
              <CustomButton
                icon="📋"
                text={`Code: ${battleCode}`}
                onClick={handleCopyCode}
                width="100%"
              />
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
              <Text
                fontSize="md"
                color="gray.600"
                textAlign="center"
              >
                Share this code with your friend!
              </Text>
              <CustomButton
                icon="❌"
                text="Cancel"
                onClick={() => {
                  setIsWaiting(false);
                  setBattleCode("");
                }}
                colorScheme="red"
                width="100%"
                textAlign="center"
              />
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default BattleModal;
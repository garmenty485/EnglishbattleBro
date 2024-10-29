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
import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';  // 添加這行
import CustomButton from './CustomButton';
import LoadingDots from './LoadingDots';
import { useSocket } from '../context/SocketContext';

function BattleModal({ isOpen, onClose, userInfo }) {
  const navigate = useNavigate();  // 添加這行
  const socket = useSocket();
  const [battleCode, setBattleCode] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [isRandomMatch, setIsRandomMatch] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // 生成隨機代碼
  const genCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreate = () => {
    const newCode = genCode();
    setBattleCode(newCode);
    setIsWaiting(true);
    setIsRandomMatch(false);
  };

  const matchRandom = () => {
    if (!socket) return;
    
    setIsWaiting(true);
    setIsRandomMatch(true);
    
    // 發送匹配請求
    socket.emit('joinRandomMatch', { 
      userInfo,
      socketId: socket.id 
    });

    // 監聽匹配成功事件
    socket.on('matchFound', (roomCode, players) => {
      navigate('/battle', { 
        state: { 
          userInfo,
          battleCode: roomCode,
          players,
          socketId: socket.id,
        } 
      });
    });
  };

  const copyCode = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(battleCode)
        .then(() => {
          setCopySuccess(true);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          fallbackCopy(battleCode);
        });
    } else {
      fallbackCopy(battleCode);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopySuccess(true);
      } else {
        alert("Unable to copy battle code. Please copy it manually: " + battleCode);
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
      alert("Unable to copy battle code. Please copy it manually: " + battleCode);
    }

    document.body.removeChild(textArea);
  };

  // 當用戶取消匹配或關閉 Modal 時斷開連接
  const cancel = () => {
    if (socket) {
      console.log('Disconnecting socket...');
      socket.disconnect();
      console.log('Socket disconnected');
    }
    setIsWaiting(false);
    setIsRandomMatch(false);
    setCopySuccess(false);
    setBattleCode("");
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
                  placeholder="Code"
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
                onClick={matchRandom}
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
                      {copySuccess ? "(Copied!!!)" : "(Tap to copy code)"}
                    </span>
                  }
                  onClick={copyCode}
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
                onClick={cancel}
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
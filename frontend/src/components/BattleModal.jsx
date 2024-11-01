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
  useToast,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CustomButton from './CustomButton';
import LoadingDots from './LoadingDots';
import { useSocket } from '../context/SocketContext';

function BattleModal({ isOpen, onClose, userInfo }) {
  const navigate = useNavigate();
  const socket = useSocket();
  const toast = useToast();
  const [battleCode, setBattleCode] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [isRandomMatch, setIsRandomMatch] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [inputCode, setInputCode] = useState("");

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
    
    // 發送創建房間請求到服務器
    socket.emit('createRoom', {
      roomCode: newCode,
      userInfo,
      socketId: socket.id
    });
  };

  const joinRoom = () => {
    if (!inputCode) {
      toast({
        title: "Enter the room code, please.",
        status: "warning",
        duration: 2000,
      });
      return;
    }
    
    socket.emit('joinRoom', {
      roomCode: inputCode,
      userInfo,
      socketId: socket.id
    });
  };

  const matchRandom = () => {
    if (!socket) return;
    
    setIsWaiting(true);
    setIsRandomMatch(true);
    
    socket.emit('joinRandomMatch', { 
      userInfo,
      socketId: socket.id 
    });
  };

  // 監聽匹配成功事件
  useEffect(() => {
    if (!socket) return;

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to game server",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });

    socket.on('matchSuccess', ({ roomCode, players, questions }) => {
      navigate('/battle', {
        state: {
          userInfo,
          battleCode: roomCode,
          players,
          socketId: socket.id,
          questions
        }
      });
    });

    return () => {
      socket.off('matchSuccess');
      socket.off('connect_error');
      socket.off('error');
    };
  }, [socket, navigate, userInfo, toast]);

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
      document.execCommand('copy');
      setCopySuccess(true);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }
    document.body.removeChild(textArea);
  };

  const cancel = () => {
    setIsWaiting(false);
    setIsRandomMatch(false);
    setBattleCode("");
    setCopySuccess(false);
    if (socket) {
      socket.emit('cancelMatch');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent
        bg="yellow.100"
        border="4px solid"
        borderColor="black"
        borderRadius="8px"
        p={4}
        mx={4}
      >
        <ModalHeader textAlign="center">Battle Mode ⚔️</ModalHeader>
        <ModalBody>
          {!isWaiting ? (
            <VStack spacing={6}>
              <CustomButton
                icon="🎮"
                text="Create Room"
                onClick={handleCreate}
                width="100%"
                colorScheme="blue"
              />
              
              <Text fontSize="lg" color="gray.700" textAlign="center">
                - OR -
              </Text>
              
              <HStack width="100%" spacing={2}>
                <Input
                  placeholder="Code"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
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
                  onClick={joinRoom}
                  width="145px"
                  height="60px"
                  colorScheme="red"
                />
              </HStack>
              
              <Text fontSize="lg" color="gray.700" textAlign="center">
                - OR -
              </Text>
              
              <CustomButton
                icon="🎲"
                text="Match a random player"
                onClick={matchRandom}
                width="100%"
                colorScheme="teal"
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
                <Text fontSize="md" color="gray.600" textAlign="center">
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
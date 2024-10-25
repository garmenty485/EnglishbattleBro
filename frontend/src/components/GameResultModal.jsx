import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text
} from "@chakra-ui/react";

const modalStyles = {
  content: {
    bg: "yellow.100",
    width: { base: "90%", md: "400px" },
    mx: "auto",
    textAlign: "center",
    border: "4px solid",
    borderColor: "yellow.300"
  },
  header: {
    fontFamily: "Comic Sans MS",
    color: "pink.600",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 2
  },
  score: {
    fontSize: "2xl",
    fontFamily: "Comic Sans MS",
    color: "pink.600"
  },
  button: {
    colorScheme: "pink",
    fontFamily: "Comic Sans MS",
    color: "yellow.300"
  }
};

function GameResultModal({ isOpen, onClose, score }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent {...modalStyles.content}>
        <ModalHeader {...modalStyles.header}>
          🎉🎉🎉 COMPLETE 🎉🎉🎉
        </ModalHeader>
        <ModalBody>
          <Text {...modalStyles.score}>
            Your Score: {score}
          </Text>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button {...modalStyles.button} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default GameResultModal;
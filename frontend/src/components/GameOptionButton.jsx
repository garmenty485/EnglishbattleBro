import { Box, Button, Text } from "@chakra-ui/react";

function GameOptionButton({
  icon,
  tooltipText,
  hotKeyIcon,
  onClick,
  isDisabled,
  colorScheme
}) {
  // 簡化文字
  const getSimplifiedText = (text) => {
    if (text.includes("Reveal")) return "Reveal\nletter";
    if (text.includes("definition")) return "Show\ndefinition";
    return "Skip\nquestion";
  };

  return (
    <Box>
      {/* 電腦版顯示 - 保持原樣 */}
      <Box display={{ base: "none", lg: "block" }}>
        <Box textAlign="center">
          <Button
            size="md"
            colorScheme={colorScheme}
            borderRadius="full"
            boxShadow="md"
            m={2}
            position="relative"
            _hover={{
              _after: {
                content: `"${tooltipText}"`,
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
            onClick={onClick}
            disabled={isDisabled}
          >
            {icon}
          </Button>
          <Text
            position="relative"
            opacity={isDisabled ? 0.5 : 1}
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
            {hotKeyIcon}
          </Text>
        </Box>
      </Box>

      {/* 手機和平板版顯示 */}
      <Box display={{ base: "block", lg: "none" }}>
        <Button
          onClick={onClick}
          isDisabled={isDisabled}
          colorScheme={colorScheme}
          width="90px"
          height="90px"
          p={2}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Text fontSize="3xl">{icon}</Text>
          <Text 
            fontSize="sm" 
            whiteSpace="pre-line"
            textAlign="center"
          >
            {getSimplifiedText(tooltipText)}
          </Text>
        </Button>
      </Box>
    </Box>
  );
}

export default GameOptionButton;
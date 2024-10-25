import { Box, Button, Text } from "@chakra-ui/react";

function GameOptionButton({
  icon,
  tooltipText,
  hotKeyIcon,
  onClick,
  isDisabled,
  colorScheme
}) {
  return (
    <Box textAlign="center">
      <Button
        size={{ base: "sm", md: "md" }}
        colorScheme={colorScheme}
        borderRadius="full"
        boxShadow="md"
        m={{ base: 1, md: 2 }}
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
  );
}

export default GameOptionButton;
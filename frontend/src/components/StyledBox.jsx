import { Box } from "@chakra-ui/react";

function StyledBox({ children, ...props }) {
  return (
    <Box
      textAlign="center"  // 文字對齊方式為居中
      py={10}  // 元素的垂直內邊距為10
      px={6}  // 元素的水平內邊距為6
      bg="yellow.100"  // 背景顏色為黃色
      minH="90vh"  // 最小高度為視窗高度的90%
      maxW="500px"  // 設置最大寬度為800px
      w="100%"  // 寬度為100%
      border="4px"  // 邊框寬度為4px
      borderColor="black"  // 邊框顏色為黑色
      borderRadius="8px"  // 邊角設置為鈍角
      display="flex"  // 設置為彈性盒子布局
      flexDirection="column"  // 彈性盒子的方向為縱向
      alignItems="center"  // 子元素在交叉軸上的對齊方式為居中
      justifyContent="center"  // 子元素在主軸上的對齊方式為居中
      mx="auto"  // 水平外邊距為自動
      {...props}
    >
      {children}
    </Box>
  );
}

export default StyledBox;
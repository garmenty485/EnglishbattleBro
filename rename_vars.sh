#!/bin/bash

# 設置目標目錄
TARGET_DIR="frontend/src"
SERVER_DIR="backend"

# 變數重命名列表
declare -A replacements=(
  ["currentQuestionIndex"]="qIndex"
  ["currentQuestion"]="question"
  ["answeredQuestions"]="answeredQ"
  ["currentSocketId"]="socketId"
  ["fallbackCopyTextToClipboard"]="fallbackCopy"
)

# 遍歷前端文件
find "$TARGET_DIR" -type f \( -name "*.js" -o -name "*.jsx" \) | while read -r file; do
  for old_name in "${!replacements[@]}"; do
    new_name="${replacements[$old_name]}"
    sed -i "s/$old_name/$new_name/g" "$file"
  done
done

# 遍歷後端文件
find "$SERVER_DIR" -type f -name "*.js" | while read -r file; do
  for old_name in "${!replacements[@]}"; do
    new_name="${replacements[$old_name]}"
    sed -i "s/$old_name/$new_name/g" "$file"
  done
done

echo "變數重命名完成！"
import React from "react";
import { View, Platform } from "react-native";
import styles from "./styles";

export const Cell = (props) => {
  const { keyIndex, type, value, width, height, color, AppRNText } = props;
  const textboxStyle =
    Platform.OS === "android"
      ? [styles.textBox, color && { color }, height && { height }]
      : [styles.textBoxIos, color && { color }];
  return (
    <View
      style={[styles.cellTextBox, { width: width, height: height }]}
      key={keyIndex}
    >
      <AppRNText size={14} style={textboxStyle}>
        {value}
      </AppRNText>
    </View>
  );
};

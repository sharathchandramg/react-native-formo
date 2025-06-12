import React from "react";
import styles from "./styles";

const StarIcon = (props) => {
  const { AppNBText } = props;
  const required = props["required"];
  if (typeof required !== "undefined" && required) {
    return (
      <AppNBText size={12} style={styles.iconStyle}>
        {"*"}
      </AppNBText>
    );
  }
  return null;
};

export default StarIcon;

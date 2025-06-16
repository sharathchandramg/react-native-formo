import React from "react";
import { View, ArrowBackIcon } from "native-base";
import { TouchableOpacity } from "react-native";
import LinearGradientHeader from "./linearGradientHeader";

import styles from "../../fields/userDirectory/styles";

const CustomHeader = (props) => {
  const { theme, toggleModalVisible, attributes, AppNBText } = props;
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.headerLeft}
            onPress={() => toggleModalVisible()}
          >
            <ArrowBackIcon size={"6"} color={"rgb(0,151,235)"} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <AppNBText size={18} style={theme.headerText}>
            {attributes.label || "Select"}
          </AppNBText>
        </View>
      </View>
      <LinearGradientHeader />
    </View>
  );
};

export default CustomHeader;

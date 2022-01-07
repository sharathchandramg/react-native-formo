import React from "react";
import { View, ArrowBackIcon, Text } from "native-base";
import { TouchableOpacity } from "react-native";

import styles from "../../fields/userDirectory/styles";

const CustomHeader = (props) => {
  const { theme, toggleModalVisible, attributes } = props;
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
          <Text style={theme.headerText}>{attributes.label || "Select"}</Text>
        </View>
      </View>
    </View>
  );
};

export default CustomHeader;

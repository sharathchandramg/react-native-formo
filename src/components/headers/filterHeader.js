import React from "react";
import { View, ArrowBackIcon, Text } from "native-base";
import { TouchableOpacity } from "react-native";

import LinearGradientHeader from './linearGradientHeader';
import styles from "./../../fields/userDirectory/styles";

const FilterHeader = (props) => {
  const { theme, toggleFilterModalVisible } = props;
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.headerLeft}
            onPress={() => toggleFilterModalVisible()}
          >
            <ArrowBackIcon size={"6"} color={"rgb(0,151,235)"} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={theme.headerText}>{"Filter"}</Text>
        </View>
      </View>
      <LinearGradientHeader />
    </View>
  );
};

export default FilterHeader;

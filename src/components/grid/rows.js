import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Cell } from "./cell";
import { sum } from "../../utils/validators";

import styles from "./styles";

export const Row = (props) => {
  const {
    data,
    widthArr,
    height,
    backgroundColor,
    rowNumber,
    toggleEditModal,
    AppRNText,
  } = props;
  let width = widthArr ? sum(widthArr) : 0;

  return data.length ? (
    <TouchableOpacity
      style={[
        styles.row,
        height && { height },
        width && { width },
        backgroundColor && { backgroundColor },
      ]}
      onPress={() =>
        typeof toggleEditModal === "function" &&
        toggleEditModal(data, rowNumber)
      }
      key={rowNumber.toString()}
    >
      {data.map((item, i) => {
        const wth = widthArr && widthArr[i];
        return (
          <View key={`${item["rowKey"] + "" + item["colKey"]}`}>
            <Cell
              type={item["type"]}
              value={item["value"]}
              width={wth}
              height={height}
              color={"black"}
              keyIndex={`${item["rowKey"] + "" + item["colKey"]}`}
              AppRNText={AppRNText}
            />
          </View>
        );
      })}
    </TouchableOpacity>
  ) : null;
};

export const Rows = (props) => {
  const { data, theme, toggleEditModal, widthArr, height, AppRNText } = props;
  return data ? (
    <View style={{ paddingTop: 1 }}>
      {data.map((item, i) => {
        return (
          <View key={i.toString()}>
            <Row
              data={item["data"]}
              theme={theme}
              widthArr={widthArr}
              height={height}
              backgroundColor={i % 2 == 0 ? "#E1FBFF" : "white"}
              toggleEditModal={toggleEditModal}
              rowNumber={i + 1}
              AppRNText={AppRNText}
            />
          </View>
        );
      })}
    </View>
  ) : null;
};

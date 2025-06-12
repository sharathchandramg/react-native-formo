import React from "react";
import { View } from "react-native";
import { Cell } from "./cell";

export const Col = (props) => {
  const { data, wth, height, AppRNText } = props;
  return data ? (
    <View>
      {data.map((item, i) => {
        return (
          <View
            key={`${item["rowKey"]}`}
            style={{
              backgroundColor: i % 2 === 0 ? "#E1FBFF" : "white",
              color: "#989898",
            }}
          >
            <Cell
              type={item["type"]}
              value={item["value"]}
              width={wth}
              height={height}
              color={"black"}
              keyIndex={`${item["rowKey"]}`}
              AppRNText={AppRNText}
            />
          </View>
        );
      })}
    </View>
  ) : null;
};

import React from "react";
import { View } from "react-native";

import styles from "./styles";

export const Table = (props) => {
  _renderChildren = (props) => {
    return React.Children.map(props.children, (child) =>
      React.cloneElement(
        child,
        props.borderStyle && child.type.displayName !== "ScrollView"
          ? { borderStyle: props.borderStyle }
          : {}
      )
    );
  };

  const { borderStyle } = props;
  const backgroundColor = (borderStyle && borderStyle.backgroundColor) || "";

  return (
    <View
      style={[
        styles.tableStyle,
        {
          backgroundColor,
        },
      ]}
    >
      {_renderChildren(props)}
    </View>
  );
};

export const TableWrapper = (props) => {
  _renderChildren = (props) => {
    return React.Children.map(props.children, (child) =>
      React.cloneElement(
        child,
        props.borderStyle ? { borderStyle: props.borderStyle } : {}
      )
    );
  };

  const { style } = props;
  return <View style={style}>{this._renderChildren(props)}</View>;
};

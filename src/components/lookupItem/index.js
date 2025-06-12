import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { CheckBox } from "native-base";
import styles from "./styles";

const Item = (props) => {
  renderIcon = () => {
    return (
      <View style={{ width: 50, paddingHorizontal: 5 }}>
        <CheckBox
          onPress={() => props.toggleSelect(props.item)}
          checked={props.isSelected}
          accessibilityLabel={
            props.attributes.objectType
              ? props.item[props.attributes.labelKey]
              : props.item
          }
        />
      </View>
    );
  };
  renderTitle = () => {
    const {AppRNText} = props;
    return (
      <View style={styles.labelContainer}>
        <AppRNText size={16} style={styles.labelText}>
          {props.attributes.objectType
            ? props.item[props.attributes.labelKey]
            : props.item}
        </AppRNText>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => props.toggleSelect(props.item)}
    >
      {props.attributes.multiple && renderIcon()}
      {renderTitle()}
    </TouchableOpacity>
  );
};

export default Item;

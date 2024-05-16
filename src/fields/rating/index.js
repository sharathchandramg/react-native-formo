import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, Text } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";

import styles from "./../../styles";
import StarIcon from "../../components/starIcon";
import { isEmpty } from "../../utils/validators";

export default class RatingField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    theme: PropTypes.object,
    updateValue: PropTypes.func,
    ErrorComponent: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (value) => {
    this.props.updateValue(this.props.attributes.name, value);
  };

  renderLabel = () => {
    const { theme, attributes } = this.props;
    return (
      <View
        style={{
          flex: 5,
          flexDirection: "row",
          alignItems: "center",
          paddingStart: 5,
        }}
      >
        {attributes["required"] && (
          <StarIcon required={attributes["required"]} />
        )}
        <Text
          style={{
            color: theme.inputColorPlaceholder,
            paddingStart: 5,
            fontSize: 16,
          }}
        >
          {attributes.label}
        </Text>
      </View>
    );
  };

  renderIcon = () => {
    return (
      <View>
        <View
          style={{
            width: "95%",
            flexDirection: "row",
            paddingStart: 10,
            // justifyContent: "space-between",
            paddingVertical: 10,
          }}
        >
          <Icon name="star" size={25} color={"#828282"} />
          <Icon name="star" size={25} color={"rgb(255, 212, 59)"} solid />
          <Icon name="thumbs-up" size={25} color={"#828282"} />
          <Icon name="thumbs-up" size={25} color={"rgb(255, 212, 59)"} solid />
          <Icon name="flag" size={25} color={"#828282"} />
          <Icon name="flag" size={25} color={"rgb(255, 212, 59)"} solid />
          <Icon name="circle" size={25} color={"#828282"} />
          <Icon name="circle" size={25} color={"rgb(255, 212, 59)"} solid />
          <Icon name="heart" size={25} color={"#828282"} />
          <Icon name="heart" size={25} color={"rgb(255, 212, 59)"} solid />
          <Icon name="smile" size={25} color={"#828282"} />
          <Icon name="smile" size={25} color={"rgb(255, 212, 59)"} solid />
        </View>
      </View>
    );
  };

  render() {
    const { theme, attributes, ErrorComponent } = this.props;
    const value = attributes["value"] || "";

    return (
      <View style={{ paddingHorizontal: 15, paddingTop: 5 }}>
        <View
          style={{
            ...styles.pickerStyle,
            ...{
              backgroundColor: theme.pickerBgColor,
              borderBottomColor: attributes["error"]
                ? theme.errorMsgColor
                : theme.inputBorderColor,
              borderBottomWidth: theme.borderWidth,
            },
          }}
        >
          {this.renderLabel()}
          {this.renderIcon()}
        </View>
        <View>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}

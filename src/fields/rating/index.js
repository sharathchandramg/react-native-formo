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
    this.state = {
      noOfIcons: 5,
      icon: "star",
    };
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
    const { attributes } = this.props;
    const value = attributes["value"] || 0;
    const noOfIcons =
      attributes?.additional_config?.no_of_icons || this.state.noOfIcons;
    const icon = attributes?.additional_config?.icon || this.state.icon;
    return (
      <View>
        <View
          style={[
            {
              width: "100%",
              flexDirection: "row",
              paddingStart: 10,
              paddingVertical: 10,
              // borderColor: "#41E1FD",
              // borderWidth: 2,
              // borderRadius: 4,
            },
            noOfIcons > 5 && { justifyContent: "space-between" },
          ]}
        >
          {Array.from(Array(noOfIcons).keys()).map((item) => {
            return (
              <View style={[noOfIcons <= 5 && { paddingRight: 10 }]}>
                <Icon
                  name={icon}
                  size={25}
                  color={
                    value > 0 && item + 1 <= value
                      ? "rgb(255, 212, 59)"
                      : "#828282"
                  }
                  solid={value > 0 && item + 1 <= value ? true : false}
                  onPress={() => this.handleChange(item + 1)}
                />
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  render() {
    const { theme, attributes, ErrorComponent } = this.props;

    return (
      <View style={{ paddingHorizontal: 15, paddingTop: 5 }}>
        <View
          style={{
            ...styles.pickerStyle,
            ...{
              backgroundColor: theme.pickerBgColor,
              // borderBottomColor: attributes["error"]
              //   ? theme.errorMsgColor
              //   : theme.inputBorderColor,
              // borderBottomWidth: theme.borderWidth,
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

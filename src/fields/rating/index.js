import PropTypes from "prop-types";
import React, { Component } from "react";
import { View } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";

import styles from "./styles";
import StarIcon from "../../components/starIcon";

export default class RatingField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    theme: PropTypes.object,
    updateValue: PropTypes.func,
    ErrorComponent: PropTypes.func,
  };

  handleChange = (value) => {
    this.props.updateValue(this.props.attributes.name, value);
  };

  renderLabel = () => {
    const { theme, attributes, AppNBText } = this.props;
    return (
      <View style={styles.labelWrapper}>
        {attributes["required"] && (
          <StarIcon required={attributes["required"]} AppNBText={AppNBText} />
        )}
        <AppNBText
          size={16}
          style={[
            styles.labelText,
            {
              color: theme.inputColorPlaceholder,
            },
          ]}
        >
          {attributes.label}
        </AppNBText>
      </View>
    );
  };

  getIcon = (attributes) => {
    const icon = attributes?.additional_config?.icon;
    switch (icon) {
      case "smile":
      case "face-smile":
        return "smile";
      default:
        return icon;
    }
  };

  renderIcon = () => {
    const { theme, attributes } = this.props;
    const value = attributes["value"] || 0;
    const noOfIcons = attributes?.additional_config?.no_of_icons;
    const icon = this.getIcon(attributes);
    return (
      <View>
        <View
          style={[
            styles.iconWrapper,
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
                      ? theme.sunglowColor
                      : theme.Gray51Color
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
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: theme.pickerBgColor,
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

import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, Animated } from "react-native";
import math from "mathjs";
import { View, Input } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";

import { getKeyboardType } from "./../../utils/helper";
import { isEmpty } from "./../../utils/validators";
import StarIcon from "../../components/starIcon";
import LongLabel from "./longLabel";

export default class TextInputField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    theme: PropTypes.object,
    onSummitTextInput: PropTypes.func,
    ErrorComponent: PropTypes.func,
    updateValue: PropTypes.func,
  };

  state = {
    isFocused: false,
    numOfLines: 2,
  };

  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(
      this.props.isCreateForm ? 0 : 1
    );
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.getInputValue() ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  handleChange = (text) => {
    this.props.updateValue(this.props.attributes.name, text);
  };

  getInputValue = () => {
    return !isEmpty(this.props.attributes) &&
      !isEmpty(this.props.attributes["value"])
      ? true
      : false;
  };

  getCalculatedValue = (attributes) => {
    let calculateOnFields = attributes.fields;
    let expression = attributes.expression;
    let value = "";
    if (typeof calculateOnFields === "object") {
      let scope = {};
      for (let i = 0; i < calculateOnFields.length; i++) {
        scope[calculateOnFields[i]] = parseFloat(
          this.props.getValue(calculateOnFields[i])
        );
      }
      if (Object.values(scope).length === calculateOnFields.length) {
        value = math.eval(expression, scope);
        if (!isNaN(value) && value.toString() !== attributes.value.toString()) {
          this.props.updateValue(attributes.name, value.toString());
        }
      }
    }
    return isNaN(value) ? "" : value.toString();
  };

  renderCalculatedField = (attributes, theme) => {
    const inputProps = attributes.props;
    const keyboardType = getKeyboardType(attributes.type);
    return (
      <Input
        style={{
          height: this.state.numOfLines > 1 ? 40 : 60,
          borderTopWidth: 0,
          borderRightWidth: 0,
          borderLeftWidth: 0,
          borderBottomColor: attributes["error"]
            ? theme.errorMsgColor
            : theme.inputBorderColor,
          borderBottomWidth: theme.borderWidth,
          fontSize: 18,
          ...Platform.select({
            ios: {
              lineHeight: this.state.numOfLines > 1 ? 0 : 30,
            },
            android: {
              textAlignVertical: "bottom",
            },
          }),
        }}
        ref={(c) => {
          this.textInputCalculated = c;
        }}
        keyboardType={keyboardType}
        underlineColorAndroid="transparent"
        placeholder={attributes.label}
        placeholderTextColor={theme.inputColorPlaceholder}
        editable={attributes.editable}
        value={this.getCalculatedValue(attributes)}
        {...inputProps}
      />
    );
  };

  renderInputField = (attributes, theme) => {
    const inputProps = attributes.props;
    let keyboardType = getKeyboardType(attributes.type);

    if (attributes.type === "number") {
      const additionalConfig = attributes.additional_config;
      if (additionalConfig && additionalConfig.allow_negative)
        keyboardType =
          Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric";
    }

    let value = "";
    if (attributes["type"] === "number") {
      if (!isEmpty(attributes["value"])) {
        value = attributes["value"].toString();
      }
    } else {
      if (!isEmpty(attributes["value"])) {
        value = attributes["value"].toString();
      }
    }

    return (
      <Input
        style={{
          height: this.state.numOfLines > 1 ? 40 : 60,
          borderTopWidth: 0,
          borderRightWidth: 0,
          borderLeftWidth: 0,
          borderBottomColor: attributes["error"]
            ? theme.errorMsgColor
            : theme.inputBorderColor,
          borderBottomWidth: theme.borderWidth,
          fontSize: 18,
          ...Platform.select({
            ios: {
              lineHeight: this.state.numOfLines > 1 ? 0 : 30,
            },
            android: {
              textAlignVertical: "bottom",
            },
          }),
        }}
        ref={(c) => {
          this.textInput = c;
        }}
        keyboardType={keyboardType}
        underlineColorAndroid="transparent"
        secureTextEntry={
          attributes.secureTextEntry || attributes.type === "password"
        }
        blurOnSubmit={false}
        editable={attributes.editable}
        onChangeText={(text) => this.handleChange(text)}
        value={value}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        {...inputProps}
      />
    );
  };

  getLabelStyles = () => {
    const { theme } = this.props;
    return {
      position: "absolute",
      left: 0,
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 16],
      }),
      paddingStart: 5,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [25, Platform.OS === "ios" ? 0 : 5],
      }),
      color: theme.inputColorPlaceholder,
    };
  };

  handleChangeNoOfLines = (lines) => {
    this.setState({ numOfLines: lines });
  };

  render() {
    const { theme, attributes, ErrorComponent } = this.props;
    return (
      <View>
        <View
          style={{
            borderBottomWidth: 0,
            paddingHorizontal: 15,
          }}
        >
          <View style={{ flex: 1, position: "relative" }}>
            {this.state.numOfLines > 1 ? (
              <LongLabel
                attributes={attributes}
                text={attributes.label}
                theme={theme}
                handleChangeNoOfLines={this.handleChangeNoOfLines}
              />
            ) : (
              <Animated.Text style={this.getLabelStyles()} numberOfLines={1}>
                {attributes["required"] && (
                  <StarIcon required={attributes["required"]} />
                )}{" "}
                {attributes.label}
              </Animated.Text>
            )}
            {typeof attributes.type !== "undefined" &&
            attributes.type === "calculated"
              ? this.renderCalculatedField(attributes, theme)
              : this.renderInputField(attributes, theme)}
            {theme.textInputErrorIcon && attributes.error ? (
              <View style={{ position: "absolute", right: 0, bottom: 10 }}>
                <Icon
                  name={"times-circle"}
                  size={20}
                  color={theme.errorMsgColor}
                  solid
                />
              </View>
            ) : null}
          </View>
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}

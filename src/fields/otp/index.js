import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Platform,
  Animated,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import { View, Input } from "native-base";

import { getKeyboardType } from "./../../utils/helper";
import { isEmpty } from "./../../utils/validators";
import StarIcon from "../../components/starIcon";

export default class OTPField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    theme: PropTypes.object,
    onSummitTextInput: PropTypes.func,
    ErrorComponent: PropTypes.func,
    updateValue: PropTypes.func,
    getOtp: PropTypes.func,
    SuccessComponent: PropTypes.func,
    getOtpByRefData: PropTypes.func,
  };
  intervalId;
  state = {
    isFocused: false,
    numOfLines: 1,
    lineSpace: Platform.OS !== "ios" ? 12 : 15,
    disableBtn: false,
    btnText: "Send",
    btnCounter: 60,
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

  initTimer = () => {
    this.intervalId = setInterval(this.timer, 1000);
  };

  timer = () => {
    if (this.state.btnCounter === 0) {
      clearInterval(this.intervalId);
      this.setState({
        disableBtn: false,
      });
    } else {
      this.setState({
        btnCounter: this.state.btnCounter - 1,
      });
    }
  };

  handleChange = (text) => {
    this.props.updateValue(this.props.attributes.name, text);
  };

  getInputValue = () => {
    return !isEmpty(this.props.attributes) &&
      !isEmpty(this.props.attributes["value"])
      ? true
      : false;
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
      <View style={{ width: "80%" }}>
        <Input
          style={{
            height: 60,
            marginTop:
              (this.state.isFocused || !isEmpty(attributes["value"])) &&
              this.state.numOfLines > 1
                ? this.state.numOfLines * this.state.lineSpace
                : 0,
            borderWidth: 0,
            fontSize: 18,
            color: attributes["error"]
              ? theme.errorMsgColor
              : attributes["success"]
              ? theme.backgroundColor
              : theme.textInputIconColor,
            ...Platform.select({
              ios: {
                lineHeight: 30,
              },
              android: {
                textAlignVertical: "bottom",
              },
            }),
          }}
          ref={(c) => {
            this.textInput = c;
          }}
          maxLength={4}
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
      </View>
    );
  };

  getLabelStyles = () => {
    const { theme } = this.props;
    return {
      position: "absolute",
      left: 0,
      fontSize: 16,
      paddingStart: 5,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [25, 0],
      }),
      color: theme.inputColorPlaceholder,
      width: "100%",
    };
  };

  onTextLayout = (e) => {
    this.setState({ numOfLines: e.nativeEvent.lines.length });
  };

  getRefFieldValue = (attributes) => {
    const refField = attributes?.additional_config?.ref_field;
    const value =
      this.props?.state?.[refField]?.value || this.props?.refData?.[refField];
    return value;
  };

  getLabel = (attributes) => {
    const refFieldValue = this.getRefFieldValue(attributes);
    return refFieldValue
      ? `${attributes.label}(${refFieldValue})`
      : attributes.label;
  };

  callInitTimer = () => {
    this.setState({
      disableBtn: true,
      btnText: "Resend",
      btnCounter: 60,
    });
    this.initTimer();
  };

  handleChangeGetotp = (attributes) => {
    const refValue = this.getRefFieldValue(attributes);
    this.props.getOtpByRefData(
      {
        ...attributes,
        ref_value: !isEmpty(refValue) ? refValue : null,
        ref_value_type: !isEmpty(refValue)
          ? refValue.includes("@")
            ? "EMAIL"
            : "PHONE"
          : null,
      },
      this.callInitTimer
    );
  };

  render() {
    const { theme, attributes, ErrorComponent, SuccessComponent } = this.props;
    return (
      <View>
        <View
          style={{
            borderBottomWidth: 0,
            paddingHorizontal: 15,
            paddingTop: 5,
          }}
        >
          <View
            style={[
              {
                borderColor: "#41E1FD",
                borderWidth: 2,
                borderRadius: 4,
              },
            ]}
          >
            <View style={{ flex: 1, position: "relative" }}>
              <Pressable onPress={() => {}}>
                <Text
                  onTextLayout={this.onTextLayout}
                  style={{
                    opacity: 0,
                    position: "absolute",
                    fontSize: 16,
                    paddingStart: 5,
                    color: theme.inputColorPlaceholder,
                    lineHeight: 18,
                  }}
                >
                  {this.getLabel(attributes)}
                </Text>
              </Pressable>
              <Animated.Text
                style={this.getLabelStyles()}
                numberOfLines={
                  this.state.isFocused || !isEmpty(attributes["value"])
                    ? undefined
                    : 1
                }
              >
                {attributes["required"] && (
                  <>
                    <StarIcon required={attributes["required"]} />{" "}
                  </>
                )}
                {this.getLabel(attributes)}
              </Animated.Text>
              <View style={{ flexDirection: "row" }}>
                {this.renderInputField(attributes, theme)}
                <View style={{ width: "20%" }}>
                  <TouchableOpacity
                    style={[
                      {
                        height: 60,
                        // width:40,
                        margin: 0,
                        alignSelf: "stretch",
                        justifyContent: "center",
                      },
                      {
                        backgroundColor: this.state.disableBtn
                          ? "#7D98B3"
                          : "#41E1FD",
                      },
                    ]}
                    disabled={this.state.disableBtn}
                    onPress={() => this.handleChangeGetotp(attributes)}
                  >
                    <Text
                      style={[
                        {
                          fontSize: 16,
                          color: "white",
                          alignSelf: "center",
                          fontWeight: "700",
                        },
                        { paddingHorizontal: 5 },
                      ]}
                    >
                      {this.state.btnText}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <SuccessComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}

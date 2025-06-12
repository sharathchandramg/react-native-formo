import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, Animated, Pressable, TouchableOpacity } from "react-native";
import { View } from "native-base";

import { getKeyboardType } from "./../../utils/helper";
import { isEmpty } from "./../../utils/validators";
import StarIcon from "../../components/starIcon";
import styles from "./styles";

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
    btnText: "Send OTP",
    btnCounter: 60,
  };

  UNSAFE_componentWillMount() {
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
    const { AppNBInput } = this.props;
    const inputProps = attributes.props;
    const keyboardType = getKeyboardType(attributes.type);

    let value = "";
    if (!isEmpty(attributes["value"])) {
      value = attributes["value"].toString();
    }

    return (
      <View style={styles.inputWrapper}>
        <AppNBInput
          size={18}
          style={[
            styles.input,
            {
              marginTop:
                (this.state.isFocused || !isEmpty(attributes["value"])) &&
                this.state.numOfLines > 1
                  ? this.state.numOfLines * this.state.lineSpace
                  : 0,
              color: attributes["error"]
                ? theme.errorMsgColor
                : attributes["success"]
                ? theme.backgroundColor
                : theme.textInputIconColor,
            },
          ]}
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
      ...styles.animatedLabel,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [25, 0],
      }),
      color: theme.inputColorPlaceholder,
    };
  };

  onTextLayout = (e) => {
    this.setState({ numOfLines: 1 });
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
      ? `${attributes.label}- ${refFieldValue}`
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
    const {
      theme,
      attributes,
      ErrorComponent,
      SuccessComponent,
      AppRNText,
      AppNBText,
    } = this.props;
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.inputBorder}>
            <View style={styles.contentWrapper}>
              <Pressable onPress={() => {}}>
                <AppRNText
                  size={16}
                  onTextLayout={this.onTextLayout}
                  style={[
                    styles.labelText,
                    { color: theme.inputColorPlaceholder },
                  ]}
                >
                  {this.getLabel(attributes)}
                </AppRNText>
              </Pressable>
              <Animated.Text style={this.getLabelStyles()} numberOfLines={1}>
                {attributes["required"] && (
                  <>
                    <StarIcon
                      required={attributes["required"]}
                      AppNBText={AppNBText}
                    />
                  </>
                )}
                {this.getLabel(attributes)}
              </Animated.Text>
              <View style={styles.inputBtnWrapper}>
                {this.renderInputField(attributes, theme)}
                <View style={styles.btnWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.btn,
                      {
                        backgroundColor: this.state.disableBtn
                          ? "#7D98B3"
                          : "#41E1FD",
                      },
                    ]}
                    disabled={this.state.disableBtn}
                    onPress={() => this.handleChangeGetotp(attributes)}
                  >
                    <AppRNText size={16} style={styles.btnText}>
                      {this.state.btnText}
                    </AppRNText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.errorSuccessWrapper}>
          {attributes.error && attributes.errorMsg ? (
            <ErrorComponent {...{ attributes, theme, AppRNText }} />
          ) : attributes.success && attributes.successMsg ? (
            <SuccessComponent {...{ attributes, theme, AppRNText }} />
          ) : (
            <View />
          )}
        </View>
      </View>
    );
  }
}

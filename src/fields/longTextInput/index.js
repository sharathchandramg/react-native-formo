import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, Animated, Pressable, TouchableOpacity } from "react-native";
import { View } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";

import { getKeyboardType } from "./../../utils/helper";
import { isEmpty } from "./../../utils/validators";
import StarIcon from "../../components/starIcon";

export default class TextInputField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    theme: PropTypes.object,
    ErrorComponent: PropTypes.func,
    updateValue: PropTypes.func,
  };

  state = {
    isFocused: false,
    height: 0,
    numOfLines: 1,
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

  handleChange(text) {
    this.props.updateValue(this.props.attributes.name, text);
  }

  getInputValue = () => {
    return !isEmpty(this.props.attributes) &&
      !isEmpty(this.props.attributes["value"])
      ? true
      : false;
  };

  renderInputField = (attributes, theme) => {
    const { AppNBInput } = this.props;
    const inputProps = attributes.props;
    const additionalConfig = attributes["additional_config"];
    let keyboardType = getKeyboardType(attributes.type);
    let value = "";
    let maxLength = 300;
    if (!isEmpty(attributes["value"])) {
      value = attributes["value"].toString();
    }

    if (
      !isEmpty(additionalConfig) &&
      !isEmpty(additionalConfig["max_length"])
    ) {
      maxLength = Number(additionalConfig["max_length"]);
    }

    return (
      <AppNBInput
        size={18}
        style={{
          borderTopWidth: 0,
          borderRightWidth: 0,
          borderLeftWidth: 0,
          borderBottomColor: theme.inputColorPlaceholder,
          // fontSize: 18,
          ...Platform.select({
            ios: {
              minHeight: 50,
              maxHeight: 110,
              lineHeight: 20,
            },
            android: {
              height: Math.min(100, Math.max(50, this.state.height)),
              lineHeight: 20,
              textAlignVertical: "top",
            },
          }),
          marginTop:
            (this.state.isFocused || !isEmpty(attributes["value"])) &&
            this.state.numOfLines > 1
              ? this.state.numOfLines * 12
              : 0,
        }}
        ref={(c) => {
          this.textInput = c;
        }}
        keyboardType={keyboardType}
        underlineColorAndroid="transparent"
        numberOfLines={5}
        secureTextEntry={
          attributes.secureTextEntry || attributes.type === "password"
        }
        blurOnSubmit={false}
        editable={attributes.editable}
        onChangeText={(text) => this.handleChange(text)}
        value={value}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        multiline={true}
        maxLength={maxLength}
        onContentSizeChange={(event) =>
          this.setState({ height: event.nativeEvent.contentSize.height })
        }
        {...inputProps}
      />
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
        outputRange: [25, -15],
      }),
      color: theme.inputColorPlaceholder,
      width: "100%",
    };
  };

  onTextLayout = (e) => {
    this.setState({ numOfLines: e.nativeEvent.lines.length });
  };

  render() {
    const { theme, attributes, ErrorComponent, AppRNText, AppNBText } =
      this.props;
    return (
      <View>
        <View
          style={{
            borderBottomWidth: 0,
            paddingTop: 20,
            paddingHorizontal: 15,
          }}
        >
          <View style={{ flex: 1, position: "relative" }}>
            <Pressable onPress={() => {}} style={{ paddingTop: 5 }}>
              <AppRNText
                size={16}
                onTextLayout={this.onTextLayout}
                style={{
                  opacity: 0,
                  position: "absolute",
                  // fontSize: 16,
                  paddingStart: 5,
                  color: theme.inputColorPlaceholder,
                  lineHeight: 18,
                }}
              >
                {!isEmpty(attributes["value"])
                  ? `${attributes.label}(view more)`
                  : `${attributes.label}`}
              </AppRNText>
            </Pressable>

            <TouchableOpacity
              onPress={() => {
                if (!isEmpty(attributes["value"])) {
                  this.props.openLongTxtModal(
                    attributes["value"].toString() || ""
                  );
                }
              }}
            >
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
                    <StarIcon
                      required={attributes["required"]}
                      AppNBText={AppNBText}
                    />
                  </>
                )}
                {attributes.label}
                {!isEmpty(attributes["value"]) && (
                  <AppRNText
                    size={14}
                    style={{
                      color: "#48BBEC",
                      //  fontSize: 14
                    }}
                  >
                    (view more)
                  </AppRNText>
                )}
              </Animated.Text>
            </TouchableOpacity>
            {this.renderInputField(attributes, theme)}
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

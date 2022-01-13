import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, Animated } from "react-native";
import math from "mathjs";
import { View, Input } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome5';

import { getKeyboardType } from "./../../utils/helper";
import { isEmpty } from "./../../utils/validators";
import StarIcon from "../../components/starIcon";

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
    };

    componentWillMount() {
        this._animatedIsFocused = new Animated.Value(
            isEmpty(this.getInputValue()) ? 0 : 1
        );
    }

    componentDidUpdate() {
        Animated.timing(this._animatedIsFocused, {
            toValue:
                this.state.isFocused || !isEmpty(this.getInputValue()) ? 1 : 0,
            duration: 200,
        }).start();
    }

    handleFocus = () => this.setState({ isFocused: true });
    handleBlur = () => this.setState({ isFocused: false });

    handleChange(text) {
        this.props.updateValue(this.props.attributes.name, text);
    }

    getInputValue = () => {
        const { attributes } = this.props;
        if (
            typeof attributes.type !== 'undefined' &&
            attributes.type === 'calculated'
        ) {
            return this.getCalculatedValue();
        } else {
            let value = '';
            if (attributes['type'] === 'number') {
                if (!isEmpty(attributes['value'])) {
                    value = attributes['value'].toString();
                }
            } else {
                if (!isEmpty(attributes['value'])) {
                    value = attributes['value'].toString();
                }
            }
            return value;
        }
    };

    getCalculatedValue = attributes => {
        let calculateOnFields = attributes.fields;
        let expression = attributes.expression;
        let value = '';
        if (typeof calculateOnFields === 'object') {
            let scope = {};
            for (let i = 0; i < calculateOnFields.length; i++) {
                scope[calculateOnFields[i]] = parseFloat(
                    this.props.getValue(calculateOnFields[i])
                );
            }
            if (Object.values(scope).length === calculateOnFields.length) {
                value = math.eval(expression, scope);
                if (
                    !isNaN(value) &&
                    value.toString() !== attributes.value.toString()
                ) {
                    this.props.updateValue(attributes.name, value.toString());
                }
            }
        }
        return isNaN(value) ? '' : value.toString();
    };

    renderCalculatedField = (attributes, theme) => {
        const inputProps = attributes.props;
        const keyboardType = getKeyboardType(attributes.type);
        return (
          <Input
            style={{
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
                  lineHeight: 30,
                },
                android: {
                  paddingBottom: 5,
                  textAlignVertical: "bottom",
                },
              }),
            }}
            ref={(c) => {
              this.textInputCalculated = c;
            }}
            keyboardType={keyboardType}
            underlineColorAndroid="transparent"
            numberOfLines={2}
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

        if (attributes.type === 'number') {
            const additionalConfig = attributes.additional_config;
            if (additionalConfig && additionalConfig.allow_negative)
                keyboardType =
                    Platform.OS === 'ios'
                        ? 'numbers-and-punctuation'
                        : 'numeric';
        }

        let value = '';
        if (attributes['type'] === 'number') {
            if (!isEmpty(attributes['value'])) {
                value = attributes['value'].toString();
            }
        } else {
            if (!isEmpty(attributes['value'])) {
                value = attributes['value'].toString();
            }
        }

        return (
          <Input
            style={{
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
                  lineHeight: 30,
                },
                android: {
                  paddingBottom: 5,
                  textAlignVertical: "bottom",
                },
              }),
            }}
            ref={(c) => {
              this.textInput = c;
            }}
            keyboardType={keyboardType}
            underlineColorAndroid="transparent"
            numberOfLines={2}
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
            position: 'absolute',
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
        }
    }

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        return (
          <View>
            <View
              style={{
                borderBottomWidth: 0,
                paddingBottom: 5,
                paddingVertical: 5,
                paddingHorizontal: 15,
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, position: "relative" }}>
                  <Animated.Text style={this.getLabelStyles()}>
                    {attributes["required"] && (
                      <StarIcon required={attributes["required"]} />
                    )}{" "}
                    {attributes.label}
                  </Animated.Text>
                  {typeof attributes.type !== "undefined" &&
                  attributes.type === "calculated"
                    ? this.renderCalculatedField(attributes, theme)
                    : this.renderInputField(attributes, theme)}
                  {theme.textInputErrorIcon && attributes.error ? (
                    <View
                      style={{ position: "absolute", right: 0, bottom: 10 }}
                    >
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
            </View>
            <View style={{ paddingHorizontal: 15 }}>
              <ErrorComponent {...{ attributes, theme }} />
            </View>
          </View>
        );
    }
}

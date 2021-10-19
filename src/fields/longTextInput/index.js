import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, Animated } from "react-native";
import { View, Item, Input, Icon, ListItem } from "native-base";
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
      toValue: this.state.isFocused || !isEmpty(this.getInputValue()) ? 1 : 0,
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
    let value = '';
    if (!isEmpty(attributes["value"])) {
      value = attributes["value"].toString();
    }
    return value;
  };

  renderInputField = (attributes, theme) => {
    const inputProps = attributes.props;
    let keyboardType = getKeyboardType(attributes.type);
    let value = "";
    if (!isEmpty(attributes["value"])) {
      value = attributes["value"].toString();
    }

    return (
      <Input
        style={{
          ...Platform.select({
            ios: {
              minHeight: 50,
              maxHeight: 110,
              lineHeight: 20,
            },
            android: {
              minHeight: 50,
              maxHeight: 110,
              lineHeight: 20,
              // textAlignVertical: "top",
            },
          }),
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
        outputRange: [25, Platform.OS === "ios" ? -15 : -15],
      }),
      color: theme.inputColorPlaceholder,
    };
  };

  render() {
    const { theme, attributes, ErrorComponent } = this.props;
    return (
      <View>
        <ListItem
          style={{ borderBottomWidth: 0, paddingBottom: 5, paddingVertical: 5 }}
        >
          <View style={{ flex: 1 }}>
            <View>
              <Item
                error={
                  theme.changeTextInputColorOnError ? attributes.error : null
                }
              >
                <Animated.Text style={this.getLabelStyles()}>
                  {attributes["required"] && (
                    <StarIcon required={attributes["required"]} />
                  )}{" "}
                  {attributes.label}
                </Animated.Text>
                {this.renderInputField(attributes, theme)}
                {theme.textInputErrorIcon && attributes.error ? (
                  <Icon name={theme.textInputErrorIcon} />
                ) : null}
              </Item>
            </View>
          </View>
        </ListItem>
        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}

import PropTypes from "prop-types";
import React, { Component } from "react";
import { TouchableOpacity, Animated, Modal, Platform } from "react-native";
import { View, Text } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { RNCamera } from "react-native-camera";
import _ from "lodash";

import { isEmpty } from "./../../utils/validators";
import StarIcon from "../../components/starIcon";
import styles from "./styles";

export default class BarcodeField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    theme: PropTypes.object,
    updateValue: PropTypes.func,
    ErrorComponent: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      isFocused: false,
    };
  }

  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(
      isEmpty(this.getInputValue()) ? 0 : 1
    );
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || !isEmpty(this.getInputValue()) ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }

  getInputValue = () => {
    const { attributes } = this.props;
    let value = "";
    if (!isEmpty(attributes["value"])) {
      value = attributes["value"].toString();
    }
    return value;
  };

  renderAddImageIcon = () => {
    const { theme } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.valueContainer,
          {
            justifyContent: !isEmpty(this.getInputValue())
              ? "space-between"
              : "flex-end",
          },
        ]}
        onPress={() => this.setState({ openModal: true })}
      >
        {!isEmpty(this.getInputValue()) && (
          <Text
            style={{
              color: theme.inputColorPlaceholder,
              width: "90%",
              paddingStart: 5,
            }}
            numberOfLines={1}
          >
            {this.getInputValue()}
          </Text>
        )}
        <Icon
          name="qrcode"
          size={24}
          type={"regular"}
          color={"#828282"}
          style={styles.iconStyle}
        />
      </TouchableOpacity>
    );
  };

  onBarCodeRead = (code) => {
    this.props.updateValue(this.props.attributes.name, code.data);
    this.setState({
      openModal: false,
      isFocused: !isEmpty(code.data) ? true : false,
    });
  };

  renderModalContent = () => {
    return (
      <View style={styles.modalContainer}>
        <RNCamera
          style={styles.modalPreview}
          flashMode={RNCamera.Constants.FlashMode.on}
          onBarCodeRead={this.onBarCodeRead}
          ref={(cam) => (this.camera = cam)}
          captureAudio={false}
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
        outputRange: [10, Platform.OS === "ios" ? -5 : -10],
      }),
      color: theme.inputColorPlaceholder,
    };
  };

  render() {
    const { theme, attributes, ErrorComponent } = this.props;

    return (
      <View>
        <View>
          <View
            style={{
              paddingTop: !isEmpty(this.getInputValue()) ? 10 : 5,
              marginHorizontal: 15,
              paddingStart: 5,
            }}
          >
            <View
              style={{
                borderBottomColor: attributes["error"]
                  ? theme.errorMsgColor
                  : theme.inputBorderColor,
                borderBottomWidth: theme.borderWidth,
                flex: 2,
                flexDirection: "row",
                paddingVertical: 10,
              }}
            >
              <Animated.Text style={this.getLabelStyles()} numberOfLines={1}>
                {attributes["required"] && (
                  <>
                    <StarIcon required={attributes["required"]} />{" "}
                  </>
                )}
                {attributes.label}
              </Animated.Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  flex: 1,
                }}
                onPress={() => this.setState({ openModal: true })}
              >
                {this.renderAddImageIcon()}
              </TouchableOpacity>
            </View>
          </View>
          {this.state.openModal && (
            <Modal
              visible={this.state.openModal}
              animationType={"fade"}
              transparent={true}
              onRequestClose={() => this.setState({ openModal: false })}
              onPressOut={() => this.setState({ openModal: false })}
            >
              {this.renderModalContent()}
            </Modal>
          )}
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}

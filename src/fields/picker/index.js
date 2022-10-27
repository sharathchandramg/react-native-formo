import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Platform,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Pressable,
} from "react-native";
import { View, Text } from "native-base";
import { Picker } from "@react-native-picker/picker";

import styles from "./../../styles";
import StarIcon from "../../components/starIcon";

const Item = Picker.Item;

export default class PickerField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    theme: PropTypes.object,
    updateValue: PropTypes.func,
    ErrorComponent: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      value: null,
      hasMore: false,
      numOfLines: 2,
      showMore: false,
    };
  }

  handleChange(value) {
    this.setState({ value: value });
    this.props.updateValue(this.props.attributes.name, value);
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  renderModal = () => {
    const { theme, attributes } = this.props;
    const pickerValue =
      this.state.value !== null
        ? this.state.value
        : typeof attributes.value !== "undefined" && attributes.value !== null
        ? attributes.value
        : "";

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => this.setModalVisible(false)}
        style={{ backgroundColor: "#00000052" }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
            backgroundColor: "#00000052",
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              height: "100%",
              width: "100%",
              flexDirection: "column-reverse",
              alignItems: "flex-end",
            }}
          >
            <View style={{ backgroundColor: "#fff", width: "100%" }}>
              <View style={{ flexDirection: "row" }}>
                <TouchableHighlight
                  onPress={() => this.setModalVisible(false)}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 10,
                    marginRight: 20,
                  }}
                  underlayColor={"#fff"}
                >
                  <View>
                    <Text style={{ fontSize: 20, color: "rgb(0,151,235)" }}>
                      {"Done"}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
              <Picker
                style={{ padding: 2 }}
                textStyle={{ color: theme.pickerColorSelected }}
                mode={attributes.mode}
                selectedValue={pickerValue}
                onValueChange={(value) => this.handleChange(value)}
              >
                {attributes.options.map((item, index) => (
                  <Item key={index} label={item} value={item} />
                ))}
              </Picker>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  renderIOSPicker = (isValueValid, defaultValue) => {
    const { theme, attributes } = this.props;
    return (
      <View
        style={{
          ...styles.pickerMainIOS,
          ...{
            backgroundColor: theme.pickerBgColor,
            borderBottomColor: attributes["error"]
              ? theme.errorMsgColor
              : theme.inputBorderColor,
            borderBottomWidth: theme.borderWidth,
          },
        }}
      >
        <TouchableOpacity
          onPress={() => this.setModalVisible(true)}
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          <View
            style={{
              flex: 6,
              flexDirection: "row",
              alignItems: "center",
              paddingStart: 5,
            }}
          >
            {attributes["required"] && (
              <StarIcon required={attributes["required"]} />
            )}
            <Pressable onPress={() => this.onLoadMoreToggle()}>
              <Text
                onTextLayout={this.onTextLayout}
                style={{
                  opacity: 0,
                  position: "absolute",
                  color: theme.inputColorPlaceholder,
                  paddingStart: 5,
                  fontSize: 16,
                }}
              >
                {attributes.label}
              </Text>
              <Text
                style={{
                  color: theme.inputColorPlaceholder,
                  paddingStart: 5,
                  fontSize: 16,
                }}
                numberOfLines={
                  !this.state.hasMore
                    ? 2
                    : this.state.showMore
                    ? this.state.numOfLines
                    : 2
                }
              >
                {attributes.label}
              </Text>
            </Pressable>
          </View>
          <Text
            style={{
              color: theme.inputColorPlaceholder,
              fontSize: 16,
              flex: 4,
              textAlign: "center",
            }}
          >
            {isValueValid ? attributes.value : defaultValue}
          </Text>
        </TouchableOpacity>
        {this.renderModal()}
      </View>
    );
  };

  onTextLayout = (e) => {
    this.setState({
      hasMore: e.nativeEvent.lines.length > 2,
      numOfLines: e.nativeEvent.lines.length,
    });
  };

  onLoadMoreToggle = () => {
    this.setState({ showMore: !this.state.showMore });
  };

  renderAndroidPicker = (pickerValue) => {
    const { theme, attributes } = this.props;
    return (
      <View
        style={{
          ...styles.pickerMainAndroid,
          ...{
            backgroundColor: theme.pickerBgColor,
            borderBottomColor: attributes["error"]
              ? theme.errorMsgColor
              : theme.inputBorderColor,
            borderBottomWidth: theme.borderWidth,
          },
        }}
      >
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
          <Pressable onPress={() => this.onLoadMoreToggle()}>
            <Text
              onTextLayout={this.onTextLayout}
              style={{
                opacity: 0,
                position: "absolute",
                color: theme.inputColorPlaceholder,
                paddingStart: 5,
                fontSize: 16,
              }}
            >
              {attributes.label}
            </Text>
            <Text
              style={{
                color: theme.inputColorPlaceholder,
                paddingStart: 5,
                fontSize: 16,
              }}
              numberOfLines={
                !this.state.hasMore
                  ? 2
                  : this.state.showMore
                  ? this.state.numOfLines
                  : 2
              }
            >
              {attributes.label}
            </Text>
          </Pressable>
        </View>
        <View style={{ flex: 5 }}>
          <Picker
            style={{ padding: 2 }}
            textStyle={{ color: theme.pickerColorSelected }}
            iosHeader="Select one"
            mode={attributes.mode}
            selectedValue={pickerValue}
            onValueChange={(value) => this.handleChange(value)}
          >
            {attributes.options.map((item, index) => (
              <Item
                key={index}
                label={item}
                value={item}
                style={{ fontSize: 16 }}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  render() {
    const { theme, attributes, ErrorComponent } = this.props;
    const value = attributes["value"] || "";
    const defaultValue = attributes["defaultValue"] || "-Select-";

    const isValueValid = attributes.options.indexOf(attributes.value) > -1;
    const pickerValue =
      this.state.value !== null ? this.state.value : value || defaultValue;

    return (
      <View style={{ paddingHorizontal: 15 }}>
        {Platform.OS !== "ios"
          ? this.renderAndroidPicker(pickerValue)
          : this.renderIOSPicker(isValueValid, defaultValue)}
        <View>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}

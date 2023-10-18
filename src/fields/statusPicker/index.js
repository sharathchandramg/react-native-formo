import PropTypes from "prop-types";
import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text } from "native-base";
import PickerModal from "./../../components/picker/modal";
import Icon from "react-native-vector-icons/FontAwesome";
import { isEmpty } from "../../utils/validators";

import styles from "./../../styles";
import StarIcon from "../../components/starIcon";

export default class StatusPickerField extends Component {
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
    };
  }

  handleChange = (value) => {
    this.props.updateValue(this.props.attributes.name, value);
  };

  closeModal = () => {
    this.setState({ openModal: false });
  };

  renderPicker = (pickerValue) => {
    const { theme, attributes } = this.props;
    const options =
      attributes && !isEmpty(attributes.options) ? attributes.options : [];
    let valueStyle = {
      fontSize: 18,
      color: theme.pickerColorSelected,
    };
    if (attributes.show_first_value) {
      valueStyle = { ...valueStyle, backgroundColor: "yellow" };
    }
    return (
      <View
        style={{
          ...styles.pickerStyle,
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
        <View>
          <TouchableOpacity onPress={() => this.setState({ openModal: true })}>
            <View
              style={{
                width: "95%",
                flexDirection: "row",
                paddingStart: 10,
                justifyContent: "space-between",
                paddingVertical: 10,
              }}
            >
              <View>
                <Text style={valueStyle} numberOfLines={1}>
                  {pickerValue}
                </Text>
              </View>
              <View>
                <Icon
                  name="caret-down"
                  size={18}
                  type={"regular"}
                  color={"#828282"}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {this.state.openModal && (
          <PickerModal
            list={options}
            closeModal={this.closeModal}
            handleChange={this.handleChange}
            theme={theme}
          />
        )}
      </View>
    );
  };

  render() {
    const { theme, attributes, ErrorComponent } = this.props;
    const value = attributes["value"] || "";
    const defaultValue = attributes["defaultValue"] || "-Select-";
    const pickerValue = value || defaultValue;

    return (
      <View style={{ paddingHorizontal: 15, paddingTop: 5 }}>
        {this.renderPicker(pickerValue)}
        <View>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}

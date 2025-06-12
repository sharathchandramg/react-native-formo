import PropTypes from "prop-types";
import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { View } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import styles from "./../../styles";
import StarIcon from "../../components/starIcon";
import PickerModal from "./../../components/picker/modal";
import { isEmpty } from "../../utils/validators";

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
    const { theme, attributes, AppNBText, AppRNText, AppNBInput } = this.props;
    const options =
      attributes && !isEmpty(attributes.options) ? attributes.options : [];
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
            <StarIcon required={attributes["required"]} AppNBText={AppNBText} />
          )}
          <AppNBText
            size={16}
            style={{
              color: theme.inputColorPlaceholder,
              paddingStart: 5,
              // fontSize: 16,
            }}
          >
            {attributes.label}
          </AppNBText>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              if (attributes.editable) this.setState({ openModal: true });
            }}
          >
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
                <AppNBText
                  size={18}
                  style={{
                    // fontSize: 18,
                    color: !attributes.editable
                      ? theme.inputColorPlaceholder
                      : theme.pickerColorSelected,
                  }}
                  numberOfLines={1}
                >
                  {pickerValue}
                </AppNBText>
              </View>
              <View>
                <Icon
                  name="caret-down"
                  size={18}
                  type={"regular"}
                  color={
                    !attributes.editable
                      ? theme.inputColorPlaceholder
                      : "#828282"
                  }
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
            AppRNText={AppRNText}
            AppNBInput={AppNBInput}
          />
        )}
      </View>
    );
  };

  render() {
    const { theme, attributes, ErrorComponent, AppRNText } = this.props;
    const value = attributes["value"] || "";
    const defaultValue = attributes["defaultValue"] || "-Select-";
    const pickerValue = value || defaultValue;

    return (
      <View style={{ paddingHorizontal: 15, paddingTop: 5 }}>
        {this.renderPicker(pickerValue)}
        <View>
          <ErrorComponent {...{ attributes, theme, AppRNText }} />
        </View>
      </View>
    );
  }
}

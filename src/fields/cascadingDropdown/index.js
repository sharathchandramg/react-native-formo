import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Platform,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
} from "react-native";
import { View, Text, Input } from "native-base";
import { Picker } from "@react-native-picker/picker";
import _ from "lodash";
import styles from "../../styles";
import StarIcon from "../../components/starIcon";
import { isEmpty } from "../../utils/validators";
import SearchableDropdown from "./searchableDropDown";

const Item = Picker.Item;

const items = [
  {
    id: 1,
    name: "JavaScript",
  },
  {
    id: 2,
    name: "Java",
  },
  {
    id: 3,
    name: "Ruby",
  },
  {
    id: 4,
    name: "React Native",
  },
  {
    id: 5,
    name: "PHP",
  },
  {
    id: 6,
    name: "Python",
  },
  {
    id: 7,
    name: "Go",
  },
  {
    id: 8,
    name: "Swift",
  },
  {
    id: 9,
    name: "React Native",
  },
  {
    id: 10,
    name: "PHP",
  },
  {
    id: 11,
    name: "Python",
  },
  {
    id: 12,
    name: "Go",
  },
  {
    id: 13,
    name: "Swift",
  },
];

export default class CascadingDropdownField extends Component {
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
      openModal: false,
      selectedItems: [
        {
          id: 7,
          name: "Go",
        },
      ],
    };
  }

  handleChange = (value) => {
    this.props.updateValue(this.props.attributes.name, value);
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  getOptions = () => {
    const { attributes, state } = this.props;
    const options = !isEmpty(attributes.options) ? attributes.options : [];

    if (!isEmpty(attributes.ref_field_name) && !isEmpty(options)) {
      const refField = state[attributes.ref_field_name];
      return !isEmpty(refField) && !isEmpty(refField.value)
        ? options.filter((item) => item.ref_id === refField.value)
        : [];
    }
    return options;
  };

  renderModal = () => {
    const { theme, attributes } = this.props;
    const pickerValue =
      typeof attributes.value !== "undefined" && attributes.value !== null
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
                {this.getOptions().map((item, index) => (
                  <Item key={index} label={item.name} value={item.id} />
                ))}
              </Picker>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  getSelectedValue = (attributes) => {
    const index = this.getValueIndex(attributes);
    const options = !isEmpty(this.getOptions()) ? this.getOptions() : [];
    const field = options[index];
    return !isEmpty(field) ? field.name : "";
  };

  renderIOSPicker = (isValueValid, defaultValue) => {
    const { theme, attributes } = this.props;
    return (
      <View>
        <TouchableOpacity
          // onPress={() => this.setModalVisible(true)}
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 10,
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row", paddingStart: 5 }}>
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
          <Text style={{ color: theme.inputColorPlaceholder, fontSize: 16 }}>
            {isValueValid ? this.getSelectedValue(attributes) : defaultValue}
          </Text>
        </TouchableOpacity>
        <View>
          <SearchableDropdown
            selectedItems={this.state.selectedItems}
            onItemSelect={(item) => {
              const items = this.state.selectedItems;
              items.push(item);
              this.setState({ selectedItems: items });
              this.handleChange(item);
            }}
            onRemoveItem={(item, index) => {
              const items = this.state.selectedItems.filter(
                (sitem) => sitem.id !== item.id
              );
              this.setState({ selectedItems: items });
            }}
            items={items}
            defaultIndex={2}
            resetValue={false}
            onTextChange={(text) => alert(text)}
          />
        </View>
      </View>
    );
  };

  renderAndroidPicker = (pickerValue) => {
    const { theme, attributes } = this.props;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
        }}
      >
        <View
          style={{
            flex: 5,
            flexDirection: "row",
            alignItems: "center",
            paddingStart: 5,
            width: "100%",
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
        <View style={{ flex: 5, width: "100%" }}>
          <SearchableDropdown
            selectedItems={this.state.selectedItems}
            onItemSelect={(item) => {
              const items = this.state.selectedItems;
              items.push(item);
              this.setState({ selectedItems: items });
              this.handleChange(item);
            }}
            onRemoveItem={(item, index) => {
              const items = this.state.selectedItems.filter(
                (sitem) => sitem.id !== item.id
              );
              this.setState({ selectedItems: items });
            }}
            items={items}
            defaultIndex={2}
            resetValue={false}
            onTextChange={(text) => this.handleChange(text)}
          />
        </View>
      </View>
    );
  };

  getValueIndex = (attributes) => {
    const options = !isEmpty(this.getOptions()) ? this.getOptions() : [];
    const value = !isEmpty(attributes.value) ? attributes.value : "";
    return options.findIndex((x) => x.id === value);
  };

  render() {
    const { theme, attributes, ErrorComponent } = this.props;
    const value = attributes["value"] || "";
    const defaultValue = attributes["defaultValue"] || "-Select-";

    const isValueValid = this.getValueIndex(attributes) > -1;
    const pickerValue = value || defaultValue;

    return (
      <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
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

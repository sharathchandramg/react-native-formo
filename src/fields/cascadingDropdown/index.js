import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, Text } from "native-base";
import _ from "lodash";
import StarIcon from "../../components/starIcon";
import { isEmpty } from "../../utils/validators";
import SearchableDropdown from "./searchableDropDown";

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
      selectedItems: [],
    };
  }

  handleChange = (value) => {
    this.props.updateValue(this.props.attributes.name, value);
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

  getSelectedValue = (attributes) => {
    const index = this.getValueIndex(attributes);
    const options = !isEmpty(this.getOptions()) ? this.getOptions() : [];
    const field = options[index];
    return !isEmpty(field) ? field : null;
  };

  renderInput = (isValueValid, defaultValue) => {
    const { theme, attributes } = this.props;
    return (
      <View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 5,
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
        </View>
        <View>
          <SearchableDropdown
            onItemSelect={(item) => this.handleChange(item)}
            items={this.getOptions()}
            onTextChange={(text) => alert(text)}
            attributes={attributes}
            selectedValue={this.getSelectedValue(attributes)}
          />
        </View>
      </View>
    );
  };


  getValueIndex = (attributes) => {
    const options = !isEmpty(this.getOptions()) ? this.getOptions() : [];
    const value = !isEmpty(attributes.value) ? attributes.value : {};
    return options.findIndex((x) => x.id === value["id"]);
  };

  render() {
    const { theme, attributes, ErrorComponent } = this.props;
    const value = attributes["value"] || "";
    const defaultValue = attributes["defaultValue"] || "-Select-";

    const isValueValid = this.getValueIndex(attributes) > -1;
    const pickerValue = value || defaultValue;

    return (
      <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
        {this.renderInput(isValueValid, defaultValue)}
        <View>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}

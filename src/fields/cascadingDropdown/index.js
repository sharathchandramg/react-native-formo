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
    const options = !isEmpty(attributes) && !isEmpty(attributes.options) ? attributes.options : [];
    if (!isEmpty(attributes) && !isEmpty(attributes.ref_field_name) && !isEmpty(options)) {
      const refField = state[attributes.ref_field_name];
      return !isEmpty(refField) && !isEmpty(refField.value) && !isEmpty(refField.value.id)
        ? options.filter((item) => item.ref_id.includes(refField.value.id))
        : [];
    }
    return options;
  };

  getValueIndex = (attributes) => {
    const options = !isEmpty(this.getOptions()) ? this.getOptions() : [];
    const value = !isEmpty(attributes.value) ? attributes.value : {};
    return options.findIndex((x) => x.id === value["id"]);
  };

  getSelectedValue = (attributes) => {
    const index = this.getValueIndex(attributes);
    const options = !isEmpty(this.getOptions()) ? this.getOptions() : [];
    const field = options[index];
    return !isEmpty(field) && !isEmpty(field.label) ? field.label : "";
  };

  renderInput = () => {
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
            attributes={attributes}
            selectedValue={this.getSelectedValue(attributes)}
          />
        </View>
      </View>
    );
  };

  render() {
    const { theme, attributes, ErrorComponent } = this.props;

    return (
      <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
        {this.renderInput()}
        <View>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}

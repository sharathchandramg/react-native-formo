import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, Text } from "native-base";
import _ from "lodash";
import StarIcon from "../../components/starIcon";
import { isEmpty } from "../../utils/validators";
import SearchableDropdown from "./searchableDropDown";

import styles from "./styles";

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
    const { attributes, state } = this.props;
    this.props.updateValue(attributes.name, value);
    Object.keys(state).forEach((ele) => {
      if (
        state[ele] &&
        state[ele]["type"] === "cascading-dropdown" &&
        state[ele]["ref_field_name"] === attributes.name
      ) {
        this.props.updateValue(ele, null);
      }
    });
  };

  getOptions = () => {
    const { attributes, state } = this.props;
    const options =
      !isEmpty(attributes) && !isEmpty(attributes.options)
        ? attributes.options
        : [];
    if (
      !isEmpty(attributes) &&
      !isEmpty(attributes.ref_field_name) &&
      !isEmpty(options)
    ) {
      const refField = state[attributes.ref_field_name];
      return !isEmpty(refField) &&
        !isEmpty(refField.value) &&
        !isEmpty(refField.value.id)
        ? options.filter((item) => item.ref_id.includes(refField.value.id))
        : [];
    }
    return options;
  };

  getOption = (attributes) => {
    const options = !isEmpty(this.getOptions()) ? this.getOptions() : [];
    const value =
      !isEmpty(attributes) &&
      !isEmpty(attributes.value) &&
      !isEmpty(attributes.value["id"])
        ? attributes.value.id
        : null;
    return !isEmpty(value) ? _.find(options, { id: value }) : null;
  };

  getSelectedValue = (attributes) => {
    const option = this.getOption(attributes);
    return !isEmpty(option) && !isEmpty(option.label) ? option.label : "";
  };

  renderInput = () => {
    const { theme, attributes } = this.props;
    return (
      <View>
        <View style={styles.labelWrapper}>
          <View style={styles.labelContainer}>
            {attributes["required"] && (
              <StarIcon required={attributes["required"]} />
            )}
            <Text
              style={[
                styles.label,
                {
                  color: theme.inputColorPlaceholder,
                },
              ]}
            >
              {attributes.label}
            </Text>
          </View>
        </View>
        <View>
          <SearchableDropdown
            onItemSelect={(item) => this.handleChange(item)}
            items={this.getOptions()}
            selectedValue={this.getSelectedValue(attributes)}
          />
        </View>
      </View>
    );
  };

  render() {
    const { theme, attributes, ErrorComponent } = this.props;

    return (
      <View style={styles.cascadingRoot}>
        {this.renderInput()}
        <View>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}

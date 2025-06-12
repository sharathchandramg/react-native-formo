import PropTypes from "prop-types";
import React, { Component } from "react";
import Form0 from "./../../index";
import { View } from "native-base";
import StarIcon from "../../components/starIcon";

export default class FormField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    theme: PropTypes.object,
    updateValue: PropTypes.func,
    autoValidation: PropTypes.bool,
    customValidation: PropTypes.func,
    customComponents: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
  }

  componentDidMount() {
    this.props.updateValue(this.props.attributes.name, this.group.getValues());
  }

  onValueChange() {
    this.props.updateValue(this.props.attributes.name, this.group.getValues());
  }

  handleChange(text) {
    this.setState(
      {
        value: text,
      },
      () => this.props.updateValue(this.props.attributes.name, text)
    );
  }

  render() {
    const {
      attributes,
      theme,
      autoValidation,
      customValidation,
      customComponents,
      ErrorComponent,
      AppNBText,
      AppRNText,
    } = this.props;
    return (
      <View>
        <View>
          <View style={{ flexDirection: "row", flex: 1 }}>
            {attributes["required"] && (
              <StarIcon
                required={attributes["required"]}
                AppNBText={AppNBText}
              />
            )}
            <AppNBText
              size={17}
              style={{
                fontWeight: "500",
                // fontSize: 17,
                paddingStart: 5,
                flex: 1,
              }}
            >
              {attributes.label}
            </AppNBText>
          </View>
        </View>
        <View>
          <Form0
            ref={(c) => {
              this.group = c;
            }}
            onValueChange={this.onValueChange}
            autoValidation={autoValidation}
            customValidation={customValidation}
            customComponents={customComponents}
            showErrors
            fields={attributes.fields}
            theme={theme}
          />
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme, AppRNText }} />
        </View>
      </View>
    );
  }
}

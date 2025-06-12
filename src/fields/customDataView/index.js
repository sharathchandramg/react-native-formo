import PropTypes from "prop-types";
import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { View, ArrowForwardIcon } from "native-base";

import styles from "./styles";
import StarIcon from "../../components/starIcon";

export default class CustomDataComponent extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    updateValue: PropTypes.func,
    theme: PropTypes.object,
    ErrorComponent: PropTypes.func,
    onCustomDataView: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  handleOnclick = () => {
    if (typeof this.props.onCustomDataView === "function") {
      this.props.onCustomDataView(this.props);
    }
    return;
  };

  getLabel = (value) => {
    let label = "None";
    if (typeof value !== "undefined" && value && Object.keys(value).length) {
      return value.label ? value.label : "None";
    }
    return label;
  };

  renderlookupIcon = () => {
    return (
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => this.handleOnclick()}
      >
        <ArrowForwardIcon size={"6"} color={"#41E1FD"} />
      </TouchableOpacity>
    );
  };

  render() {
    const { theme, attributes, ErrorComponent, AppNBText } = this.props;
    return (
      <View style={styles.container}>
        <View style={[styles.inputLabelWrapper, { width: "95%" }]}>
          <TouchableOpacity
            style={[styles.inputLabel]}
            error={theme.changeTextInputColorOnError ? attributes.error : null}
            onPress={() => this.handleOnclick()}
          >
            {attributes["required"] && (
              <StarIcon required={attributes["required"]} />
            )}
            <View style={[styles.labelTextWrapper, { flexDirection: "row" }]}>
              <AppNBText
                size={16}
                style={[styles.labelText]}
                numberOfLines={2}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.95}
              >
                {attributes.label}
              </AppNBText>
            </View>
            <View style={styles.valueWrapper}>
              <AppNBText
                size={18}
                style={styles.inputText}
                numberOfLines={2}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.95}
              >
                {this.getLabel(attributes.value)}
              </AppNBText>
            </View>
            {this.renderlookupIcon()}
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}

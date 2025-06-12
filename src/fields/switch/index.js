import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, Switch, Icon} from "native-base";

import StarIcon from "../../components/starIcon"

export default class SwitchField extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        theme: PropTypes.object,
        onSummitTextInput: PropTypes.func,
        ErrorComponent: PropTypes.func,
        updateValue: PropTypes.func
    }

    handleChange(value) {
        this.props.updateValue(this.props.attributes.name, value);
    }

    render() {
        const { attributes, theme, ErrorComponent, AppNBText } = this.props;
            return (
              <View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    paddingHorizontal: 15,
                    height: 50,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        borderBottomColor: attributes["error"]
                          ? theme.errorMsgColor
                          : theme.inputBorderColor,
                        borderBottomWidth: theme.borderWidth,
                        flexDirection: "row",
                        alignItems:'center',
                        height:'100%',
                        paddingStart: 5
                      }}
                    >
                      {attributes["required"] && (
                        <StarIcon required={attributes["required"]} />
                      )}
                      <View style={{ flex: 1 }}>
                        <AppNBText
                        size={16}
                          style={{
                            // fontSize: 16,
                            color: theme.inputColorPlaceholder
                          }}
                        >
                          {attributes.label}
                        </AppNBText>
                      </View>
                      <Switch
                        onTrackColor={"blue"}
                        onValueChange={(value) => this.handleChange(value)}
                        value={attributes.value}
                      />
                      {/* {theme.textInputErrorIcon && attributes.error ? <Icon name={theme.textInputErrorIcon} /> : null} */}
                    </View>
                  </View>
                </View>
                <View style={{ paddingHorizontal: 15 }}>
                  <ErrorComponent {...{ attributes, theme }} />
                </View>
              </View>
            );
    }
}


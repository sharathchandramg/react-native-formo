import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform } from "react-native";

import { View, Text, Switch } from "native-base";

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
        const { attributes, theme, ErrorComponent } = this.props;
        return (
            <View>
                <View
                    style={{
                        backgroundColor: theme.pickerBgColor,
                        borderBottomColor: theme.inputBorderColor,
                        borderBottomWidth: theme.borderWidth,
                        marginHorizontal: 10,
                        marginVertical: 0,
                        paddingVertical: 10,
                        marginLeft: 20,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                    <Text style={{ color:theme.inputColorPlaceholder,padding:5 }}>
                        {attributes['required'] && <StarIcon required={attributes['required']} />}
                        {attributes.label}
                    </Text>
                    <Switch
                        onTrackColor={"blue"}
                        onValueChange={value => this.handleChange(value)}
                        value={attributes.value} />
                </View>
                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}
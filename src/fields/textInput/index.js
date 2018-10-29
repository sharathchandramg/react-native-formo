import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform } from "react-native";

import { View, Item, Input, Icon, ListItem, Text } from "native-base";

import { getKeyboardType } from "./../../utils/helper";

export default class TextInputField extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        theme: PropTypes.object,
        onSummitTextInput: PropTypes.func,
        ErrorComponent: PropTypes.func,
        updateValue: PropTypes.func,
    }

    constructor(props) {
        super(props);
    }

    handleChange(text) {
        this.props.updateValue(this.props.attributes.name, text);
    }

    render() {

        const { theme, attributes, ErrorComponent } = this.props;
        const inputProps = attributes.props;
        const keyboardType = getKeyboardType(attributes.type);

        return (

            <ListItem style={{ borderBottomWidth: 0, paddingVertical: 5 }}>
                <View style={{ flex: 1 }}>
                    <View>
                        <Item error={theme.changeTextInputColorOnError ? attributes.error : null}>
                            {attributes.icon && <Icon color={theme.textInputIconColor} name={attributes.icon} />}
                            <Input
                                style={{
                                    height: inputProps && inputProps.multiline && (Platform.OS === 'ios' ? undefined : null),
                                    padding: 0,
                                }}
                                ref={(c) => { this.textInput = c; }}
                                keyboardType={keyboardType}
                                underlineColorAndroid="transparent"
                                numberOfLines={3}
                                secureTextEntry={attributes.secureTextEntry || attributes.type === "password"}
                                placeholder={attributes.label}
                                blurOnSubmit={false}
                                placeholderTextColor={theme.inputColorPlaceholder}
                                editable={attributes.editable}
                                onChangeText={text => this.handleChange(text)}
                                value={attributes.value}
                                //value={attributes.value && attributes.value.toString()}
                                {...inputProps}
                            />
                            {theme.textInputErrorIcon && attributes.error ? <Icon name={theme.textInputErrorIcon} /> : null}
                        </Item>
                    </View>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </ListItem>
        );

    }
}
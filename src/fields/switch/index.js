import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, Text, Switch ,Item,Icon, ListItem} from "native-base";
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
        const { attributes, theme, ErrorComponent } = this.props;
            return (
                <View>
                    <ListItem style={{ borderBottomWidth: 0, paddingVertical: 5 }}>
                        <View style={{ flex: 1}}>
                            <View>
                                <Item error={theme.changeTextInputColorOnError ? attributes.error : null}>
                                    {attributes['required'] && <StarIcon required={attributes['required']} />}
                                    <View style={{flex:1 }}>
                                        <Text style={{ color:theme.inputColorPlaceholder,padding:5 }}>
                                            {attributes.label}
                                        </Text>
                                    </View>
                                    <Switch
                                        onTrackColor={"blue"}
                                        onValueChange={value => this.handleChange(value)}
                                        value={attributes.value} />
                                    {theme.textInputErrorIcon && attributes.error ? <Icon name={theme.textInputErrorIcon} /> : null}
                                </Item>
                            </View>
                        </View>
                    </ListItem>
                    <View style={{ paddingHorizontal: 15 }}>
                        <ErrorComponent {...{ attributes, theme }} />
                    </View>
                </View>
            );
    }
}


import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform } from "react-native";
import math from "mathjs"
import { View, Item, Input, Icon, ListItem, Label, Text} from "native-base";
import { getKeyboardType } from "./../../utils/helper";
import {isEmpty} from "./../../utils/validators";
import StarIcon from "../../components/starIcon";

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

    getCalculatedValue = (attributes)=>{
        let calculateOnFields = attributes.fields;
        let expression = attributes.expression;
        let value = '';
        if(typeof calculateOnFields ==='object'){
            let scope = {};
            for(let i = 0;i < calculateOnFields.length ; i++){
                scope[calculateOnFields[i]] = parseFloat(this.props.getValue(calculateOnFields[i]));
            }
            if(Object.values(scope).length === calculateOnFields.length){
                value = math.eval(expression , scope)
                if(!isNaN(value) && value.toString() !== attributes.value.toString()){
                    this.props.updateValue(attributes.name, value.toString()); 
                }
            }
        }
        return isNaN(value)?'':value.toString();
    }

    renderCalculatedField =(attributes,theme)=>{
        const inputProps = attributes.props;
        const keyboardType = getKeyboardType(attributes.type);
        return(
            <Input
                style={{
                    height: inputProps && inputProps.multiline && (Platform.OS === 'ios' ? undefined : null),
                    paddingStart:5,
                }}
                ref={(c) => { this.textInputCalculated = c; }}
                keyboardType={keyboardType}
                underlineColorAndroid="transparent"
                numberOfLines={2}
                placeholder={attributes.label}
                placeholderTextColor={theme.inputColorPlaceholder}
                editable={attributes.editable}
                value={this.getCalculatedValue(attributes)}
                {...inputProps}
            />
        )
    }

    renderInputField = (attributes,theme) =>{
        const inputProps = attributes.props;
        let keyboardType = getKeyboardType(attributes.type);

        if(attributes.type === 'number'){
            const additionalConfig = attributes.additional_config;
            if(additionalConfig && additionalConfig.allow_negative) keyboardType = Platform.OS === 'ios'?"numbers-and-punctuation":"numeric";
        }

        let value = "";
        if(attributes['type']==='number'){
            if(!isEmpty(attributes['value'])){
                value = attributes['value'].toString();
            }
        }else{
            if(!isEmpty(attributes['value'])){
                value = attributes['value'].toString();
            }
        }

        return(
            <Input
                style={{
                    // height: 45,
                    // paddingStart:5,
                }}
                ref={(c) => { this.textInput = c; }}
                keyboardType={keyboardType}
                underlineColorAndroid="transparent"
                numberOfLines={2}
                secureTextEntry={attributes.secureTextEntry || attributes.type === "password"}
                placeholder={attributes.label}
                blurOnSubmit={false}
                placeholderTextColor={theme.inputColorPlaceholder}
                editable={attributes.editable}
                onChangeText={text => this.handleChange(text)}
                value={value}
                {...inputProps}
            />
        )

    }


    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        return (
                <ListItem style={{ borderBottomWidth: 0, paddingVertical: 5 }}>
                    <View style={{ flex: 1}}>
                        <View>
                            <Item floatingLabel={true} error={theme.changeTextInputColorOnError ? attributes.error : null}>
                                <Label style={{paddingStart: 5, color: theme.inputColorPlaceholder}}>{attributes['required'] && <StarIcon required={attributes['required']} />} {attributes.label}</Label>
                                {typeof attributes.type  !=='undefined' && attributes.type ==="calculated"?
                                    this.renderCalculatedField(attributes,theme) 
                                    :
                                    this.renderInputField(attributes,theme)
                                }
                                {theme.textInputErrorIcon && attributes.error ? <Icon name={theme.textInputErrorIcon} /> : null}
                            </Item>
                        </View>
                    </View>
                </ListItem>
        );
    }
}
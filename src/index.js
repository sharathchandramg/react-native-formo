import React, { Component } from "react";
import PropTypes from "prop-types";

import { View, Keyboard, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import baseTheme from "./theme";

import TextInputField from "./fields/textInput";
import SwitchField from "./fields/switch";
import DateField from "./fields/date";
import PickerField from "./fields/picker";
import SelectField from "./fields/select";
import ImageField from "./fields/image";
import LocationField from "./fields/location";
import FormField from "./fields/form";
import SubForm from "./fields/subForm"

import { autoValidate, getInitialState, getDefaultValue, getResetValue } from "./utils/helper";

const DefaultErrorComponent = (props) => {
    const attributes = props.attributes;
    const theme = props.theme;
    if (attributes.error) {
        return (
            <Text style={{ color: theme.errorMsgColor }}>
                {attributes.errorMsg}
            </Text>
        );
    }
    return null;
};

export default class Form0 extends Component {

    static propTypes = {
        fields: PropTypes.array,
        theme: PropTypes.object,
        formData: PropTypes.object,
        errorComponent: PropTypes.func,
        autoValidation: PropTypes.bool,
        autoValidation: PropTypes.bool,
        customValidation: PropTypes.func,
        onValueChange: PropTypes.func
    }

    constructor(props) {
        super(props);

        //This gets all the field defintions an an arrary and store in state
        const initialState = getInitialState(props.fields);

        this.state = {
            ...initialState,
            errorStatus: false
        }

        this.getValues = this.getValues.bind(this);

        this.generateFields = this.generateFields.bind(this);

        this.resetForm = this.resetForm.bind(this);

        this.onSummitTextInput = this.onSummitTextInput.bind(this);

        // Invoked every time whenever any fields's value changes
        this.onValueChange = this.onValueChange.bind(this);

        this.onAddNewFields = this.onAddNewFields.bind(this);

    }

    componentDidMount() {

        const { formData } = this.props;
        this.setValues(formData);
    }

    onAddNewFields(fieldObj,value){
        if(fieldObj){
            if (fieldObj.type ==='group') {
                if(typeof fieldObj.value ==='undefined' || fieldObj.value === null || fieldObj.value.length ===0 ){
                    fieldObj.value = value;
                }else{
                    const index = Object.keys(this.state).indexOf(fieldObj.name);
                    if(index !== -1){
                        let preValue = Object.values(this.state)[index].value;
                        value = value.concat(preValue);
                    }
                    fieldObj.value = value
                }
                const newField = {};
                newField[fieldObj.name] = fieldObj;
                this.setState({ ...newField });   
            }
        }
    }

    onValueChange(name, value) {
        const valueObj = this.state[name];
        if (valueObj) {
            valueObj.value = value;
            //autovalidate the fields
            if (this.props.autoValidation === undefined || this.props.autoValidation) {
                Object.assign(valueObj, autoValidate(valueObj));
            }

            // apply some custom logic for validation
            if (this.props.customValidation
                && typeof this.props.customValidation === 'function') {
                Object.assign(valueObj, this.props.customValidation(valueObj));
            }
            const newField = {};
            newField[valueObj.name] = valueObj;
            if (this.props.onValueChange &&
                typeof this.props.onValueChange === 'function') {
                this.setState({ ...newField }, () => this.props.onValueChange());
            } else {
                this.setState({ ...newField });
            }
            
        }
    }

    onSummitTextInput(name) {
        const index = Object.keys(this.state).indexOf(name);
        if (index !== -1 && this[Object.keys(this.state)[index + 1]]
            && this[Object.keys(this.state)[index + 1]].textInput) {
            this[Object.keys(this.state)[index + 1]].textInput._root.focus();
        } else {
            Keyboard.dismiss();
        }
    }

    getValues() {
        const values = {};
        Object.keys(this.state).forEach((fieldName) => {
            const field = this.state[fieldName];
            if (field) {
                values[field.name] = field.value;
            }
        });
        console.log(values);
        return values;
    }

    resetForm() {
        const newFields = {};
        Object.keys(this.state).forEach((fieldName) => {
            const field = this.state[fieldName];
            if (field) {
                field.value = (field.editable !== undefined && !field.editable) ?
                    getDefaultValue(field) :
                    getResetValue(field);
                field.error = false;
                field.errorMsg = '';
                if (field.type === 'group') {
                    this[field.name].group.resetForm();
                }
                newFields[field.name] = field;
            }
        });
        this.setState({ ...newFields });
    }

    // Helper function for setValues
    getFieldValue(fieldObj, value) {
        const field = fieldObj;
        if (field.type === 'group') {
            const subFields = {};
            Object.keys(value).forEach((fieldName) => {
                subFields[fieldName] = value[fieldName];
            });
            this[field.name].group.setValues(subFields);
            field.value = this[field.name].group.getValues();
            // Remaing thing is error Handling Here
        } else {
            field.value = value;
            //Validate and check for errors
            if (this.props.autoValidation === undefined || this.props.autoValidation) {
                Object.assign(field, autoValidate(field));
            }
            // Validate through customValidation if it is present in props
            if (this.props.customValidation
                && typeof this.props.customValidation === 'function') {
                Object.assign(field, this.props.customValidation(field));
            }
        }
        return field;
    }

    setValues(...args) {
        if (args && args.length && args[0]) {
            const newFields = {};
            Object.keys(args[0]).forEach((fieldName) => {
                const field = this.state[fieldName];
                if (field) {
                    newFields[field.name] = this.getFieldValue(field, args[0][fieldName]);
                }
            });
            this.setState({ ...newFields });
        }
    }

    generateFields() {

        const theme = Object.assign(baseTheme, this.props.theme);
        const { customComponents, errorComponent } = this.props;

        let formKeys = Object.keys(this.state);
        const renderFields = formKeys.map((fieldName, index) => {

            const field = this.state[fieldName];
            if (!field.hidden) {
                const commonProps = {
                    key: index,
                    theme,
                    attributes: this.state[field.name],
                    updateValue: this.onValueChange,
                    ErrorComponent: errorComponent || DefaultErrorComponent,
                };

                switch (field.type) {

                    case "text":
                    case "email":
                    case "number":
                    case "url":
                    case "password":
                    case "phone":
                    case "currency":
                        return <TextInputField
                            ref={(c) => { this[field.name] = c; }}
                            {...commonProps}
                            onSummitTextInput={this.onSummitTextInput}
                        />

                    case "switch":
                        return <SwitchField
                            ref={(c) => { this[field.name] = c; }}
                            {...commonProps}
                        />

                    case "date":
                        return (
                            <DateField
                                ref={(c) => { this[field.name] = c; }}
                                {...commonProps}
                            />
                        );

                    case "picker":
                        return (
                            <PickerField
                                ref={(c) => { this[field.name] = c; }}
                                {...commonProps}
                            />
                        );

                    case "select":
                        return (
                            <SelectField
                                ref={(c) => { this[field.name] = c; }}
                                {...commonProps} />
                        );

                    case "image":
                        return (
                                <ImageField
                                    ref={(c) => { this[field.name] = c; }}
                                    {...commonProps} />
                            );
                    case "location":
                        return (
                            <LocationField
                                ref={(c) => { this[field.name] = c; }}
                                {...commonProps} />
                        );
                    case "group":
                        return (
                            <SubForm 
                                ref={(c) => { this[field.name] = c; }}
                                {...commonProps}
                                {...this.props}
                            />
                        );
                }

            }
        });

        return renderFields;

    }

    render() {
        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="always"
                extraScrollHeight={20}
                {...this.props.scrollViewProps}>

                <View>
                    {this.generateFields() || <View />}
                </View>

            </KeyboardAwareScrollView>
        );
    }
}
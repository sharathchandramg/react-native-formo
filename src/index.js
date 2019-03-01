import React, { Component } from "react";
import PropTypes from "prop-types";
const _ = require("lodash");

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
import SubForm from "./fields/subForm";
import Lookupfield from "./fields/lookup";
import CurrencyField from "./fields/currency";
import StatusPicker from "./fields/statusPicker";
import ExternalComponent from "./fields/externalComponent";



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

        this.onValidateFields = this.onValidateFields.bind(this)

        // Invoked every time whenever any fields's value changes
        this.onValueChange = this.onValueChange.bind(this);

        this.onAddNewFields = this.onAddNewFields.bind(this);

        this.getValue = this.getValue.bind(this);

    }

    componentDidMount() {
        const { formData } = this.props;
        this.setValues(formData);
    }

    componentDidUpdate(prevProps){
        const { formData } = this.props;
        if(prevProps !== this.props){
            this.setValues(formData);
        }
    }

    getValue(fieldName){
        for(let i = 0; i< Object.values(this.state).length ; i++){
            let fieldObj = Object.values(this.state)[i];
            let fieldVal = fieldObj['value'];
            if(typeof fieldVal !=='undefined' && fieldVal !== null){
                if(fieldObj['name'] === fieldName && typeof fieldVal ==='string' ){
                    return fieldVal;
                }else if(typeof fieldVal ==='object' && fieldObj['name'] !== fieldName){
                    let index = _.indexOf(Object.keys(fieldVal),fieldName);
                    if(index !== -1) return Object.values(fieldVal)[index];
                }
            }
        }
    }

    onValidateFields() {
        const newFields = {};
        Object.keys(this.state).forEach((fieldName) => {
            const field = this.state[fieldName];
            if (field) {
                if (field.required !== undefined && field.required) {
                    let validate = autoValidate(field);
                    field.error = validate.error;
                    field.errorMsg = validate.errorMsg;
                }
                newFields[field.name] = field;
            }
        });
        this.setState({ ...newFields });
    }


    onAddNewFields(name,newObj){
        let fieldObj = this.state[name];
        if(fieldObj){
            if (fieldObj.type ==='sub-form') {
                if(typeof fieldObj.value ==='undefined' || fieldObj.value === null || fieldObj.value.length ===0 ){
                    fieldObj.value = [newObj];
                }else{
                    let gIndex = _.indexOf(Object.keys(this.state),fieldObj.name);
                    let newValue ;
                    if(gIndex !== -1){
                        let preValue = Object.values(this.state)[gIndex].value;
                        let oIndex = _.findIndex(preValue,item => item._id === newObj._id);
                        if(oIndex !== -1){
                            preValue[oIndex] = newObj;
                            newValue = preValue;
                        }else{
                            newValue = _.concat(newObj,preValue);
                        }
                    }else{
                        newValue = [newObj];
                    }
                    fieldObj.value = newValue;
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
            if(valueObj.type !=='sub-form'){
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
        this.onValidateFields();
        const values = {};
        let isValidFields = true;
        Object.keys(this.state).forEach((fieldName) => {
            const field = this.state[fieldName];
            if (field) {
                if (field.error !== undefined && field.error) {
                    isValidFields = false;
                }
                values[field.name] = field.value;
            }
        });
        if (isValidFields) {
            console.log(values);
            return values;
        } else {
            return null;
        }
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
                    onAddNewFields: this.onAddNewFields,
                    getValue: this.getValue,
                    ErrorComponent: errorComponent || DefaultErrorComponent,
                };

                switch (field.type) {

                    case "text":
                    case "email":
                    case "number":
                    case "url":
                    case "password":
                    case "phone":
                    case "calculated":
                        return <TextInputField
                            ref={(c) => { this[field.name] = c; }}
                            {...commonProps}
                            onSummitTextInput={this.onSummitTextInput}
                        />

                    case "currency":
                        return <CurrencyField
                                ref={(c) => { this[field.name] = c; }}
                                {...commonProps}
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

                    case "status_picker":
                        return (
                            <StatusPicker
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
                            <FormField
                                ref={(c) => { this[field.name] = c; }}
                                {...commonProps}
                                {...this.props}
                            />
                        );

                    case "sub-form":
                        return (
                            <SubForm 
                                ref={(c) => { this[field.name] = c; }}
                                {...commonProps}
                                {...this.props}
                            />
                        );

                    case "lookup":
                        return (
                            <Lookupfield
                                ref={(c) => { this[field.name] = c; }}
                                {...commonProps}
                                {...this.props}
                            />
                        );

                    case "externalcomponent":
                        return(
                            <ExternalComponent
                                ref={(c) => { this[field.name] = c; }}
                                {...commonProps}
                                {...this.props}
                            />
                        )    
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
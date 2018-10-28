import React, { Component } from "react";
import PropTypes from "prop-types";

import { View, Keyboard, Text } from "react-native";

import baseTheme from "./theme";

import TextInputField from "./fields/textInput";
import { getInitialState, getDefaultValue } from "./utils/helper";

const _ = require("lodash");

export default class Form0 extends Component {

    static propTypes = {
        fields: PropTypes.array,
        theme: PropTypes.object,
        formData: PropTypes.object,
        errorComponent: PropTypes.func,
        autoValidation: PropTypes.bool,

    }

    constructor(props) {
        super(props);

        const initialState = getInitialState(props.fields);

        this.state = {
            ...initialState,
            errorStatus: false
        }

        this.getValues = this.getValues.bind(this);

        this.generateFields = this.generateFields.bind(this);

        this.resetForm = this.resetForm.bind(this);

        this.onSummitTextInput = this.onSummitTextInput.bind(this);

    }

    onSummitTextInput(name) {
    }

    getValues() {

    }

    resetForm() {

    }

    componentDidMount() {
        const { formData } = this.props;
        console.log(formData);
    }

    generateFields() {

        const theme = Object.assign(baseTheme, this.props.theme);

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
                        return <TextInputField
                            ref={(c) => { this[field.name] = c; }}
                            {...commonProps}
                            onSummitTextInput={this.onSummitTextInput}
                        />
                }

            }
        });

        return renderFields;

    }

    render() {
        <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
            extraScrollHeight={20}
            {...this.props.scrollViewProps}>

            <View>
                {this.generateFields() || <View />}
            </View>

        </KeyboardAwareScrollView>
    }
}
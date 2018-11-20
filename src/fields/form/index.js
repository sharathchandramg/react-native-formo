import PropTypes from "prop-types";
import React, { Component } from "react";

import Form0 from "./../../index";
import { View, Text, TouchableOpacity,ScrollView} from "react-native";
import styles from "./styles";

export default class FormField extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        theme: PropTypes.object,
        updateValue: PropTypes.func,
        autoValidation: PropTypes.bool,
        customValidation: PropTypes.func,
        customComponents: PropTypes.object,
        onAddNewFields: PropTypes.func
    }
    constructor(props) {
        super(props);

        this.onValueChange = this.onValueChange.bind(this);
        this.addNewFields = this.addNewFields.bind(this)
    }

    componentDidMount() {
        this.props.updateValue(this.props.attributes.name, this.group.getValues());
    }

    onValueChange() {
        this.props.updateValue(this.props.attributes.name, this.group.getValues());
    }

    handleChange(text) {
        this.setState({
            value: text,
        }, () => this.props.updateValue(this.props.attributes.name, text));
    }

    addNewFields(){
        this.group.onAddNewFields(this.props.attributes,[this.group.getValues()])
        this.props.toggleModalVisible();
    
    }

    render() {
        const {
            attributes,
            theme,
            autoValidation,
            customValidation,
            customComponents,
        } = this.props;
        
        return (
            <View style={styles.mainContainer}>
                <ScrollView style={[styles.mainContainer, { paddingEnd:5, paddingStart:5 }]}>
                    <Form0
                        ref={(c) => { this.group = c; }}
                        onValueChange={this.onValueChange}
                        autoValidation={autoValidation}
                        customValidation={customValidation}
                        customComponents={customComponents}
                        showErrors
                        fields={attributes.fields}
                        theme={theme}
                        formData={this.props.formData}
                    />
                </ScrollView>
                <TouchableOpacity style={styles.button} onPress={() => this.addNewFields()}>
                    <Text style={styles.buttonText}> Add </Text>
                </TouchableOpacity>
            </View>
            
        );
    }
}
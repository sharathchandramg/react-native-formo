import PropTypes from "prop-types";
import React, { Component } from "react";

import Form0 from "./../../index";
import { View, Text, TouchableOpacity,ScrollView} from "react-native";
import styles from "./styles";

export default class ChildForm extends Component {

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
    }

    componentDidMount() {
        this.props.updateValue(this.props.attributes.name, this.formGenerator.getValues());
    }

    onValueChange() {
        this.props.updateValue(this.props.attributes.name, this.formGenerator.getValues());
    }

    getChildFields(){
        return this.formGenerator.getValues();
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
                <ScrollView style={[{ paddingEnd:5, paddingStart:5,flex:1}]}>
                    <Form0
                        ref={(c) => {this.formGenerator = c;}}
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
            </View>
            
        );
    }
}
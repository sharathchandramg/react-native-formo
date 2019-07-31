
import React, { Component } from "react";
import Form0 from "./../../index";
import { View,ScrollView} from "react-native";
import styles from "./styles";

export default class ChildForm extends Component {

    getChildFields(){
        return this.formGenerator.getValues();
    }

    render() {
        const {
            attributes,
            formData,
        } = this.props;
        
        return (
            <View style={styles.mainContainer}>
                <ScrollView style={[{ paddingEnd:5, paddingStart:5,flex:1}]}>
                    <Form0
                        ref={(c) => {this.formGenerator = c;}}
                        fields={attributes.fields}
                        formData={formData}
                    />
                </ScrollView>
            </View>
            
        );
    }
}
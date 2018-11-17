import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';

import Form0 from "react-native-form0";
import { Button } from 'native-base';

export default class App extends Component {

  render() {
    const fields = require("./schema/form0.json");
    const formData = {
      // "user_name" : "Sharath",
      // "phone_number" : "9845722000"
    }
    console.log(fields);
    return (

      <ScrollView>
        <Form0 fields={fields} formData = {formData}
          ref={(c) => {
            this.formGenerator = c;
          }} />

        <View>
          <Button full info onPress={() => console.log(this.formGenerator.getValues())}><Text>Submit</Text></Button>
          <Button full warning onPress={() => this.formGenerator.resetForm()}><Text>Clear Form</Text></Button>
          <Button full info onPress={() => console.log(this.formGenerator.onValidateFields())}><Text>Validate Form</Text></Button>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
    justifyContent: 'space-between'
  }
});

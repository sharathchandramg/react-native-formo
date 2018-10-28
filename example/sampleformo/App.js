import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import Form0 from "react-native-form0";
import { Button } from 'native-base';

export default class App extends Component {

  render() {
    const fields = require("./schema/form0.json");
    console.log(fields);
    return (

      <View>
        <Form0 fields={fields}
          ref={(c) => {
            this.formGenerator = c;
          }} />

        <Button onPress={() => console.log(this.formGenerator.getValues())}><Text>Submit</Text></Button>
        <Button onPress={() => this.formGenerator.resetForm()}><Text>Clear Form</Text></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

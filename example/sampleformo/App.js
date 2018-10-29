import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';

import Form0 from "react-native-form0";
import { Button } from 'native-base';

export default class App extends Component {

  render() {
    const fields = require("./schema/form0.json");
    console.log(fields);
    return (

      <ScrollView>
        <Form0 fields={fields}
          ref={(c) => {
            this.formGenerator = c;
          }} />

        <View styles={styles.container}>
          <Button onPress={() => console.log(this.formGenerator.getValues())}><Text>Submit</Text></Button>
          <Button onPress={() => this.formGenerator.resetForm()}><Text>Clear Form</Text></Button>
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

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import Form0 from "react-native-form0";
import { Button } from 'native-base';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  componentDidMount() {

  }

  render() {
    const fields = require("./schema/form0.json");
    console.log(fields);
    return (
      // <View style={styles.container}>
      //   <Text style={styles.welcome}>Welcome to React Native!</Text>
      //   <Text style={styles.instructions}>To get started, edit App.js</Text>
      //   <Text style={styles.instructions}>{instructions}</Text>
      // </View>

      <View>
        <Form0 fields={fields}
          ref={(c) => {
            this.formGenerator = c;
          }} />

        <Button primary onPress={() => console.log(this.formGenerator.getValues())}><Text>Submit</Text></Button>
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

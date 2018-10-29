# react-native-form0
Build model based simple forms for React Native 

# Objective

- Generate Cross platform mobile form fields on react native
- Ability to track the state and values
- Load the form with predefined values
- Support nested forms and validations

# Getting Started

- Installation 
- Basic Usage
- Form Properties & Methods
- Form Fields
- Field Types


## Installation 

    npm i react-native-form0 --save

## Usage

1. Define the form schema as json

```
[
    {
        "type": "text",
        "name": "user_name",
        "required": true,
        "label": "Username"
    },
    {
        "type": "email",
        "name": "email",
        "required": true,
        "label": "Email"
    }
]

```

2. Load the form schema in a react application

```

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';

import Form0 from "react-native-form0";
import { Button } from 'native-base';

export default class App extends Component {

  render() {
    const fields = require("./schema/form0.json");
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


```


## Form Properties & Methods

### Properties

| Prop | Type | Default | Description |
|------|------|---------|-------------|
|fields              |array                |required         | Array of form fields             |
|errorComponent      |React Component      |N/A              |Error display component           |
|formData            |object               |N/A              |form values             |

### Methods

#### getValues

#### setValues

#### resetForm

#### setToDefault


## Form Fields

- TextInput
- Date
- Picker
- Switch
- Select
- Location
- Image

### Field Properties







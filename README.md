# react-native-form0
Build model based simple forms for React Native 

# Objective

- Generate Cross platform mobile form fields on react native
- Ability to track the state and values
- Load the form with predefined values
- Support nested forms and validations

# Getting Started
<!-- TOC -->

- [react-native-form0](#react-native-form0)
- [Objective](#objective)
- [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Usage](#usage)
    - [Form Properties & Methods](#form-properties--methods)
        - [Properties](#properties)
        - [Methods](#methods)
            - [getValues](#getvalues)
            - [setValues](#setvalues)
            - [resetForm](#resetform)
            - [setToDefault](#settodefault)
    - [Form Fields](#form-fields)
        - [Common Properties](#common-properties)
        - [Field Types](#field-types)
            - [TextInput](#textinput)
                - [Additional Properties](#additional-properties)
                - [Value Type](#value-type)
            - [Switch](#switch)
            - [Date](#date)
                - [Additional Properties](#additional-properties-1)
                - [Value Type : String](#value-type--string)
                - [Default Value Type : string (date in format "YYYY-MM-DD", "today", "tomorrow") or JS Date](#default-value-type--string-date-in-format-yyyy-mm-dd-today-tomorrow-or-js-date)
            - [Select](#select)
            - [Lookup](#lookup)
            - [Location](#location)
            - [Image](#image)
            - [Document](#document)

<!-- /TOC -->

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

Field is the basic unit of the form which generates an UI components. The basic structure of the field is 

```
{
    "type" : "text",
    "name" : "",
    "label": ""
    ... 
}    

```

### Common Properties

The common properties for all the fields are :

| Prop | Type | Required | Description |
|------|------|---------|-------------|
|type              | text, email, url, password, number, select, switch, date              |Yes         | Type of field             |
|name      |string     |Yes               |Internal name of the field         |
|label            |string             |Yes            |Display field lable           |
|required            |boolean             |No            |Field is mandatory or not ?          |
|editable            |boolean             |No            |Field is editable or not?           |
|hidden            |boolean             |No            |Field is visible or not?           |
|defaultValue            |             |No            |Sets the default value of the field           |



### Field Types

#### TextInput

Text input field allows to enter the text. The types of text fields allowed are, text, email, url, password, number, phone_number, currency

##### Additional Properties

| Prop | Type | Default | Description |
|------|------|---------|-------------|
|iconName              |string               |N/A         | Sets the icon name from react-native-vector-icons             |
|iconOrientaion      |string  |left              |Display icon to left or right           |
|props            |Object           |N/A              |Additional properties for the text input            |

##### Value Type 
- String (text, email, url, password)
- Number (number,phone_number,currency)

#### Switch


#### Date

(type: string)

##### Additional Properties

| Prop | Type | Default | Description |
|------|------|---------|-------------|
|mode              |string (date, time)                |date         | Mode for the date picker             |
|minDate      |string (date in format "YYYY-MM-DD", "today", "tomorrow") or JS Date     |N/A               |Minimum date in datepicker           |
|maxDate            |string (date in format "YYYY-MM-DD", "today", "tomorrow") or JS Date              |N/A              |Miximum date in datepicker            |

##### Value Type : String

##### Default Value Type : string (date in format "YYYY-MM-DD", "today", "tomorrow") or JS Date

#### Select

#### Lookup


#### Location 

#### Image

#### Document













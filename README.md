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
                - [Type](#type)
                - [Additional Properties](#additional-properties)
                - [Value Type](#value-type)
            - [Picker](#picker)
                - [Type](#type-1)
                - [Additional Properties](#additional-properties-1)
                - [Value Type](#value-type-1)
                - [Default Value Type](#default-value-type)
            - [Switch](#switch)
                - [Type](#type-2)
                - [Value Type](#value-type-2)
            - [Date](#date)
                - [Additional Properties](#additional-properties-2)
                - [Value Type](#value-type-3)
                - [Default Value Type](#default-value-type-1)
            - [Select](#select)
                - [Type](#type-3)
                - [Additional Properties](#additional-properties-3)
                - [Value Type](#value-type-4)
                - [Default Value Type](#default-value-type-2)
            - [Lookup](#lookup)
                - [Type](#type-4)
                - [Additional Properties](#additional-properties-4)
                - [Value Type](#value-type-5)
                - [Default Value Type](#default-value-type-3)
            - [Sub Form](#sub-form)
                - [Type](#type-5)
            - [Location](#location)
                - [Type](#type-6)
                - [Value Type](#value-type-6)
            - [Image](#image)
                - [Type](#type-7)
            - [Document](#document)
            - [Calculated](#calculated)
    - [Prefill form data (Edit mode)](#prefill-form-data-edit-mode)
    - [Add custom validations](#add-custom-validations)

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

Fetch the data from the form. 

```
{
    "data_source" : "test",
    "prospect_name" : "sharath"
}

```

#### setValues

Set the values of fields in the form. Ensure that the object setting the values has same name as form field name

```
{
    "data_source" : "test",
    "prospect_name" : "sharath"
}

```

#### resetForm

Reset the form, clears data and errors

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

##### Type  
{ type: text }

##### Additional Properties

| Prop | Type | Default | Description |
|------|------|---------|-------------|
|iconName              |string               |N/A         | Sets the icon name from react-native-vector-icons             |
|iconOrientaion      |string  |left              |Display icon to left or right           |
|props            |Object           |N/A              |Additional properties for the text input            |

##### Value Type 
- String (text, email, url, password)
- Number (number,phone_number,currency)

#### Picker

##### Type  
{ type: picker }

##### Additional Properties

| Prop | Type | Default | Required | Description |
|------|------|---------|-------------|------------|
|options        |array |N/A    | Yes                            |  Defines the options          |
|props        |object |N/A    | Yes                            |  react native picker props like {mode : 'dropdown'}          |

##### Value Type 
String

##### Default Value Type 
String (The string value must be a valid options)


#### Switch

Implementation of react native switch component

##### Type  
{ type: switch }

##### Value Type 
Boolean

#### Date

(type: string)

##### Additional Properties

| Prop | Type | Default | Description |
|------|------|---------|-------------|
|mode              |string (date, time, datetime)                |date         | Mode for the date picker             |
|minDate      |string (date in format "YYYY-MM-DD", "today", "tomorrow") or JS Date     |N/A               |Minimum date in datepicker           |
|maxDate            |string (date in format "YYYY-MM-DD", "today", "tomorrow") or JS Date              |N/A              |Miximum date in datepicker            |

##### Value Type 
String

##### Default Value Type 
string (date in format "YYYY-MM-DD", "today", "tomorrow") or JS Date
integer(number of minutes to be added/subtracted from current date) e.g. +60 (means 60 minutes forward) -60 

#### Select

##### Type  
{ type: select }

##### Additional Properties

| Prop | Type | Default | Required | Description |
|------|------|---------|-------------|------------|
|multiple       |bool   |false  | No                             |  Allow single or multiple selection   |
|objectType     |string |false  | No                             | Minimum date in datepicker           |
|labelKey       |string |N/A    | Yes, if Object Type is true    | To define the key which value need to be used as label.           |
|primaryKey     |string |N/A    | Yes, if Object Type is true    | To define the key which is unique in all objects.           |
|options        |string |N/A    | Yes                            |  To define the key which is unique in all objects.           |

##### Value Type

- Array of Strings

```
["Option 1", "Option 2, "Option 3"]
```

- Array of Objects

```
"options": [
            {
                "user_id": 1,
                "user_name": "Sharath"
            },
            {
                "user_id": 2,
                "user_name": "Rabindra"
            },
            {
                "user_id": 3,
                "user_name": "Nitheesh"
            }
        ],
```

##### Default Value Type

- String

If the options are array of strings

```
["Option 1", "Option 3"]
```

- Object
If options are array of objects

```
defaultValue : [
    {
        "user_id": 3,
        "user_name": "Nitheesh"
    }
]
```
#### Lookup

##### Type  
{ type: lookup }

Lookup is similar to select. Lookup is useful is auto-populating data from the master data.
e.g if there is a master data of users, then lookup can be used to select the user and then other reference fields will be auto populated

see the example 10-lookup.json (https://github.com/sharathchandramg/react-native-formo/blob/master/example/sampleformo/schema/10-lookup.json)

##### Additional Properties

| Prop | Type | Default | Required | Description |
|------|------|---------|-------------|------------|
|multiple       |bool   |false  | No                             |  Allow single or multiple selection   |
|objectType     |string |false  | No                             | Minimum date in datepicker           |
|labelKey       |string |N/A    | Yes, if Object Type is true    | To define the key which value need to be used as label.           |
|primaryKey     |string |N/A    | Yes, if Object Type is true    | To define the key which is unique in all objects.           |
|options        |string |N/A    | Yes                            |  To define the key which is unique in all objects.           |

##### Value Type

- Array of Strings

```
["Option 1", "Option 2, "Option 3"]
```

- Array of Objects

```
"options": [
            {
                "user_id": 1,
                "user_name": "Sharath",
                "email" : "sharath@xyx.com",
                "phone" : "1234567890"
            },
            {
                "user_id": 2,
                "user_name": "Rabindra",
                "email" : "rabindra@xyx.com",
                "phone" : "1234567890"
            },
            {
                "user_id": 3,
                "user_name": "Nitheesh",
                "email" : "nitheesh@xyx.com",
                "phone" : "1234567890"
            }
        ],
```

##### Default Value Type

- String

If the options are array of strings

```
["Option 1", "Option 3"]
```

- Object
If options are array of objects

```
defaultValue : [
    {
        "user_id": 3,
        "user_name": "Nitheesh",
        "email" : "nitheesh@xyx.com",
        "phone" : "1234567890"
    }
]
```


#### Sub Form 
Allows to have multiple nested complex objects. This is useful if we need to record multiple instances of data
e.g. see the example 10-lookup.json (https://github.com/sharathchandramg/react-native-formo/blob/master/example/sampleformo/schema/11-sub-form.json)

##### Type  
{ type: sub-form }

#### Location 

Allows to record the geo-location of the device. This requires the user to provide access to the read the location data

##### Type  
{ type: location }

##### Value Type 
Object ({ 
    latitude : "",
    longitude : ""
})

#### Image

##### Type  
{ type: image }

#### Document

#### Calculated 


## Prefill form data (Edit mode)

Pass the data to be prefilled as formData property

```

formData = {
  first_name : 'Sha',
  last_name: 'Snow',
  house: 'Winterfell',
  status: 'Sad'
}

```


## Add custom validations












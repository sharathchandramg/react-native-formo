import _ from "lodash";
import { isEmail, isEmpty, validateMobileNumber, isNull } from './validators';
import { PermissionsAndroid } from 'react-native';
const moment = require("moment");

export function getKeyboardType(textType) {
    switch (textType) {
        case "email":
            return "email-address";

        case "number":
        case "phone":
        case "currency":
            return 'numeric';

        default:
            return "default";
    }
}

export function getDefaultValue(field) {    
    switch (field.type) {
        case "text":
        case "number":
        case "email":
        case "password":
        case "url":
        case "phone":
        return field.defaultValue || '';

        case "currency":
            let curr_type = field.defaultCurrency? field.defaultCurrency : field.currencyOptions?field.currencyOptions[0]:'';
            let curr_value = field.defaultValue?field.defaultValue: '';
            return {curr_value: curr_value, curr_type:curr_type}

        case "calculated":
            return field.defaultValue || '';

        case "picker": {
            if(typeof field.value !=='undefined' && field.value !== null && field.value ){
                let options = field.options;
                let index = options.findIndex(option => option === field.value)
                if(index === -1) options.push(field.value);
                field.options = options;
                return field.value

            }else{
                if ((field.options).indexOf(field.defaultValue) !== -1) {
                    return field.defaultValue;
                }else{
                    return field.options[0];
                }
            }
        }
        case "select": {
            if (Array.isArray(field.defaultValue)) {
                const selected = [];
                if (!field.objectType) {
                    field.defaultValue.forEach((item) => {
                        if ((field.options).indexOf(item) !== -1) {
                            selected.push(item);
                        }
                    });
                } else {
                    field.defaultValue.forEach((item) => {
                        if ((field.options).findIndex(option =>
                            option[field.primaryKey] === item[field.primaryKey]
                        ) !== -1) {
                            selected.push(item);
                        }
                    });
                }
                return selected;
            }
            if (!field.multiple) {
                return field.defaultValue || null;
            }
            return [];
        }
        case "switch":
            if (typeof field.defaultValue === 'boolean') {
                return field.defaultValue;
            }
            return false;

        case "date":
            {
                switch (field.mode) {
                    case 'date':
                        if (field.defaultValue === "today")
                            return moment().format("YYYY-MM-DD");
                        else if (field.defaultValue === "tomorrow")
                            return moment().add(1, "day").format("YYYY-MM-DD");
                        else
                            return null;

                    case 'time':
                        const dateDefaultValue = field.defaultValue && new Date(field.defaultValue);
                        if (dateDefaultValue && !_.isNaN(dateDefaultValue.getTime()))
                            return dateDefaultValue;
                        else if (field.defaultValue === "today")
                            return moment().format("HH:mm");
                        else if (field.defaultValue === "tomorrow")
                            return moment().add(1, "day").format("HH:mm");
                        else
                            return null;

                    case 'datetime':
                        if (field.defaultValue === "today")
                            return moment().format("YYYY-MM-DD HH:mm");
                        else if (field.defaultValue === "tomorrow")
                            return moment().add(1, "day").format("YYYY-MM-DD HH:mm");
                        else if (typeof field.defaultValue !=='undefined' &&  !_.isNaN(field.defaultValue)) {

                            console.log("The datetime has default value of " + parseInt(field.defaultValue));
                            console.log("The current datetime is " + moment().format("YYYY-MM-DD HH:mm"));
                            console.log("The updated datetime is " + moment().add(parseInt(field.defaultValue), "minutes").format("YYYY-MM-DD HH:mm"));
                            
                            return moment().add(parseInt(field.defaultValue), "minutes");
                        }
                        else if (field.defaultValue === "") {
                            console.log("Enter for " + field.defaultValue)
                            return "Select";
                        }
                        else
                            return null;
                }
            }
        case "group":
            if (field.fields) {
                return field.defaultValue;
            }
            return null;
        default:
            return null;
    }
}

export function getResetValue(field) {
    switch (field.type) {
        case "text":
        case "number":
        case "email":
        case "password":
        case "url":
        case "phone":
        case "currency":
            return null

        case "picker":
            return field.options[0];

        case "select":
            return field.multiple ? [] : null;

        case "switch":
            return false;

        case "date":
            return null;

        default:
            return null;
    }
}

export function getInitialState(fields) {
    const state = {};
    _.forEach(fields, (field) => {
        const fieldObj = field;
        fieldObj.error = false;
        fieldObj.errorMsg = '';
        if (field && field.type) {
            fieldObj.value = getDefaultValue(field);
            state[field.name] = fieldObj;
        }
    });
    return state;
}

export function autoValidate(field) {
    let error = false;
    let errorMsg = '';

    if (field.required) {
        switch (field.type) {
            case "email":
                if (isEmpty(field.value)) {
                    error = true;
                    errorMsg = `${field.label} is required`;
                } else if (!isEmail(field.value)) {
                    error = true;
                    errorMsg = 'Please enter a valid email';
                }
                break;
            case "text":
            case "url":
            case "location":
            case "image":
            case "password":
                if (isEmpty(field.value)) {
                    error = true;
                    errorMsg = `${field.label} is required`;
                }
                break;

            case "currency":
                if (isEmpty(field.value.curr_value)) {
                    error = true;
                    errorMsg = `${field.label} is required`;
                }
                break;

            case "number":
                if (isEmpty(field.value)) {
                    error = true;
                    errorMsg = `${field.label} is required`;
                } else if (isNaN(field.value)) {
                    error = true;
                    errorMsg = `${field.label} should be a number`;
                }

                break;

            case "phone":
                if (isEmpty(field.value)) {
                    error = true;
                    errorMsg = `${field.label} is required`;
                } else if (!validateMobileNumber(field.value)) {
                    error = true;
                    errorMsg = `${field.label} should be valid mobile number`;
                }
                break;

            case "date":
                if (isNull(field.value)) {
                    error = true;
                    errorMsg = `${field.label} is required`;
                }
                break;
            case "sub-form":
                let value = field.value ? field.value[0] : '';
                if (typeof value === "undefined" || !value || value === '') {
                    error = true;
                    errorMsg = `${field.label} is required`;
                }
                break;

            default:
        }
    }
    return { error, errorMsg };
}

export const getGeoLocation = (options, cb) => {

    let highAccuracySuccess = false
    let highAccuracyError = false
    let highAccuracy = !options || options.highAccuracy === undefined ? true : options.highAccuracy
    let timeout = !options || options.timeout === undefined ? 10000 : options.timeout

    let getLowAccuracyPosition = () => {
        console.log('REQUESTING POSITION', 'HIGH ACCURACY FALSE')
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log('POSITION NETWORK OK', position)
                cb(position.coords)
            },
            error => {
                console.log(error)
                cb(null, error);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maxAge: 0
            }
        )
    }

    if (highAccuracy) {
        console.log('REQUESTING POSITION', 'HIGH ACCURACY TRUE')
        const watchId = navigator.geolocation.watchPosition(
            position => {
                // location retrieved
                highAccuracySuccess = true
                console.log('POSITION GPS OK', position)
                navigator.geolocation.clearWatch(watchId)
                cb(position.coords)
            },
            error => {
                console.log(error)
                highAccuracyError = true
                navigator.geolocation.clearWatch(watchId)
                getLowAccuracyPosition()
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maxAge: 0,
                distanceFilter: 1
            }
        )

        setTimeout(() => {
            if (!highAccuracySuccess && !highAccuracyError) {
                getLowAccuracyPosition()
            }
        }, timeout)
    }
}

export async function requestLocationPermission() {
    let response = { permission: false, err: null }
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'Location Permission',
                'message': 'This form required location'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            response.permission = true;
            response.err = null;
            return response;
        } else {
            response.err = 'Location permission denied';
            response.permission = false;
            return response;
        }
    } catch (err) {
        response.err = err;
        response.permission = false;
        return response;
    }
}
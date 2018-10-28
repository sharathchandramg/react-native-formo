import _ from "lodash";

export function getKeyboardType(textType) {
    switch (textType) {
        case "email":
            return "email-address";
        case "number":
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
            return field.defaultValue || '';
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
        if (!field.hidden && field.type) {
            fieldObj.value = getDefaultValue(field);
            state[field.name] = fieldObj;
        }
    });
    return state;
}
import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { View, Keyboard, Text, ScrollView } from "react-native";
import baseTheme from "./theme";
import jsonStringTemplater from "json-templater/string";
import { evaluate } from "mathjs";

import TextInputField from "./fields/textInput";
import LongTextInputField from "./fields/longTextInput";
import SwitchField from "./fields/switch";
import DateField from "./fields/date";
import PickerField from "./fields/picker";
import SelectField from "./fields/select";
import ImageField from "./fields/image";
import SignatureField from "./fields/signature";
import LocationField from "./fields/location";
import FormField from "./fields/form";
import SubForm from "./fields/subForm";
import Lookupfield from "./fields/lookup";
import CurrencyField from "./fields/currency";
import StatusPicker from "./fields/statusPicker";
import CustomDataComponent from "./fields/customDataView";
import SimpleGridView from "./fields/simplegrid";
import CollaboratorField from "./fields/collaborator";
import AssigneeField from "./fields/assignee";
import ChecklistField from "./fields/checklist";
import UserDirectoryField from "./fields/userDirectory";
import DocumentField from "./fields/document";
import BarcodeField from "./fields/barcode";
import CascadingDropdownField from "./fields/cascadingDropdown";
import OTPField from "./fields/otp";
import RatingField from "./fields/rating";

import {
  autoValidate,
  getInitialState,
  getDefaultValue,
  getResetValue,
  customValidateData,
  customFieldCalculations,
  getCalculatedFields,
  isFieldCalculated,
} from "./utils/helper";
import { isEmpty } from "./utils/validators";

const DefaultErrorComponent = (props) => {
  const { attributes, theme, AppRNText } = props;
  if (attributes.error) {
    return (
      <AppRNText
        size={14}
        style={{
          color: theme.errorMsgColor,
          paddingStart: [
            "select",
            "user_directory",
            "checklist",
            "lookup",
            "simple-grid",
            "customDataView",
            "product-catalog-sale",
          ].includes(attributes["type"])
            ? 0
            : 5,
        }}
      >
        {attributes.errorMsg}
      </AppRNText>
    );
  }
  return null;
};

const DefaultSuccessComponent = (props) => {
  const { attributes, theme, AppRNText } = props;
  if (attributes.success) {
    return (
      <AppRNText
        size={14}
        style={{
          color: theme.backgroundColor,
          paddingStart: [
            "select",
            "user_directory",
            "checklist",
            "lookup",
            "simple-grid",
            "customDataView",
            "product-catalog-sale",
          ].includes(attributes["type"])
            ? 0
            : 5,
        }}
      >
        {attributes.successMsg}
      </AppRNText>
    );
  }
  return null;
};

export default class Form0 extends Component {
  static propTypes = {
    fields: PropTypes.array,
    theme: PropTypes.object,
    formData: PropTypes.object,
    errorComponent: PropTypes.func,
    autoValidation: PropTypes.bool,
    autoValidation: PropTypes.bool,
    customValidation: PropTypes.func,
    onValueChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    //This gets all the field defintions an an arrary and store in state
    const initialState = getInitialState(props.fields);
    const calcFields = getCalculatedFields(initialState);

    this.state = {
      ...initialState,
      closeModal: false,
      calcFields,
    };

    this.getValues = this.getValues.bind(this);

    this.generateFields = this.generateFields.bind(this);

    this.resetForm = this.resetForm.bind(this);

    this.onSummitTextInput = this.onSummitTextInput.bind(this);

    this.onValidateFields = this.onValidateFields.bind(this);

    // Invoked every time whenever any fields's value changes
    this.onValueChange = this.onValueChange.bind(this);

    this.onAddNewFields = this.onAddNewFields.bind(this);

    this.getValue = this.getValue.bind(this);
  }

  componentDidMount() {
    const { formData } = this.props;
    this.setValues(formData);
  }

  componentDidUpdate(prevProps) {
    const { formData } = this.props;
    if (!_.isEqual(prevProps.formData, this.props.formData)) {
      this.setValues(formData);
    }
    if (!_.isEqual(prevProps.fields, this.props.fields)) {
      this.setState((prevState) => {
        const newState = { ...prevState };

        this.props.fields
          .filter((field) => field.type === "user_directory")
          .forEach((field) => {
            const prevField = prevState[field.name];

            if (prevField) {
              newState[field.name] = {
                ...prevField,
                ...field,
                value: !isEmpty(field.value)
                  ? field.value
                  : !isEmpty(prevField.value)
                  ? prevField.value
                  : !isEmpty(field.defaultValue)
                  ? field.defaultValue
                  : null,
              };
            } else {
              newState[field.name] = field;
            }
          });

        return newState;
      });
    }
  }

  getValue(fieldName) {
    for (let i = 0; i < Object.values(this.state).length; i++) {
      let fieldObj = Object.values(this.state)[i];
      let fieldVal = fieldObj["value"];
      if (typeof fieldVal !== "undefined" && fieldVal !== null) {
        if (fieldObj["name"] === fieldName && typeof fieldVal === "string") {
          return fieldVal;
        } else if (
          typeof fieldVal === "object" &&
          fieldObj["name"] !== fieldName
        ) {
          let index = _.indexOf(Object.keys(fieldVal), fieldName);
          if (index !== -1) return Object.values(fieldVal)[index];
        }
      }
    }
  }

  onValidateFields() {
    const newFields = {};
    Object.keys(this.state).forEach((fieldName) => {
      const field = this.state[fieldName];
      if (field) {
        if (field.required !== undefined && field.required) {
          let validate = autoValidate(field, this.state);
          field.error = validate.error;
          field.errorMsg = validate.errorMsg;
        }
        if (
          (field.type === "number" && !isFieldCalculated(field)) ||
          field.type === "otp"
        ) {
          let validate = customValidateData(field);
          field.error = validate.error;
          field.errorMsg = validate.errorMsg;
        }
        newFields[field.name] = field;
      }
    });
    this.setState({ ...newFields });
  }

  onAddNewFields(name, newObj) {
    let fieldObj = this.state[name];
    if (fieldObj) {
      if (fieldObj.type === "sub-form") {
        if (
          typeof fieldObj.value === "undefined" ||
          fieldObj.value === null ||
          fieldObj.value.length === 0
        ) {
          fieldObj.value = [newObj];
        } else {
          let gIndex = _.indexOf(Object.keys(this.state), fieldObj.name);
          let newValue;
          if (gIndex !== -1) {
            let preValue = Object.values(this.state)[gIndex].value;
            let oIndex = _.findIndex(
              preValue,
              (item) => item._id === newObj._id
            );
            if (oIndex !== -1) {
              preValue[oIndex] = newObj;
              newValue = preValue;
            } else {
              newValue = _.concat(newObj, preValue);
            }
          } else {
            newValue = [newObj];
          }
          fieldObj.value = newValue;
        }
        const newField = {};
        newField[fieldObj.name] = fieldObj;
        this.setState({ ...newField });
      }
    }
  }

  getLookupSubsciberFields = (name) => {
    const lookupSubscriberFields = _.filter(this.props.fields, (field) => {
      if (
        typeof field["data-pub"] !== "undefined" &&
        field["data-pub"] === name
      ) {
        return field;
      }
    });
    return lookupSubscriberFields;
  };

  getLocationFieldState = () => {
    const locationFields = [];
    const keys = Object.keys(this.state);
    keys.map((item) => {
      if (
        item &&
        this.state[item] &&
        this.state[item]["type"] &&
        this.state[item]["type"] === "location"
      ) {
        locationFields.push(this.state[item]);
      }
    });
    return locationFields;
  };

  getFormatedValues = () => {
    const values = {};
    Object.keys(this.state).forEach((fieldName) => {
      const field = this.state[fieldName];
      if (field) {
        values[field.name] = this.getFieldReturnValue(field);
      }
    });
    return values;
  };

  handleOnValueChange = (valueObj, value) => {
    valueObj.value = value;
    //autovalidate the fields
    if (this.props.autoValidation === undefined || this.props.autoValidation) {
      Object.assign(valueObj, autoValidate(valueObj));
    }
    // apply some custom logic for validation
    if (
      this.props.customValidation &&
      typeof this.props.customValidation === "function"
    ) {
      Object.assign(valueObj, this.props.customValidation(valueObj));
    }

    if (valueObj.type === "otp" && value.length === 4) {
      Object.assign(valueObj, customValidateData(valueObj));
    }

    if (
      valueObj.type === "location" &&
      typeof this.props.calculateProximityBeacon === "function"
    ) {
      const locationFields = this.getLocationFieldState();
      this.props.calculateProximityBeacon(valueObj, value, locationFields);
    }
    // update state value
    const newField = {};
    newField[valueObj.name] = valueObj;

    if (
      valueObj &&
      valueObj["expr_field"] &&
      valueObj["expr_field"].length > 0
    ) {
      const res = customFieldCalculations(valueObj, value, this.state);
      if (res && res.length > 0) {
        res.forEach((item) => {
          newField[item.name] = item;
        });
      }
    }

    if (
      valueObj &&
      valueObj["ref_field"] &&
      valueObj["ref_field"]["usr_field"] &&
      valueObj["ref_field"]["usr_field"].length > 0
    ) {
      valueObj["ref_field"]["usr_field"].map((name) => {
        const userField = _.filter(
          this.props.fields,
          (field) => field.name === name
        );
        if (userField && userField.length > 0) {
          this.props.onGetQuery(userField[0], this.getFormatedValues());
        }
      });
    }

    if (
      this.props.onValueChange &&
      typeof this.props.onValueChange === "function"
    ) {
      this.setState({ ...newField }, () => this.props.onValueChange());
    } else {
      this.setState({ ...newField });
    }

    if (
      ["number", "customDataView", "product-catalog-sale"].includes(
        valueObj.type
      ) &&
      !isEmpty(this.state.calcFields)
    ) {
      this.state.calcFields.forEach((ele) => {
        if (
          ele.additional_config &&
          ele.additional_config.calc &&
          ele.additional_config.calc.expr
        ) {
          const query = ele.additional_config.calc.expr;
          const data = this.getFormatedValues();
          const calculationExpression = jsonStringTemplater(query, data);
          try {
            const evalValue = evaluate(calculationExpression, data);
            const updatevalue = !isNaN(evalValue)
              ? Number(Number(evalValue).toFixed(2))
              : evalValue === 0
              ? 0
              : null;
            // if (!isEmpty(updatevalue) && !isNaN(updatevalue)) {
            const updatedField = {};
            const obj = this.state[ele.name];
            obj.value = !isNaN(updatevalue) ? updatevalue : null;
            updatedField[obj.name] = obj;
            this.setState({ ...updatedField });
            // }
          } catch (err) {}
        }
      });
    }
  };

  onValueChange(name, value) {
    const valueObj = this.state[name];
    if (valueObj) {
      const type = valueObj["type"];
      switch (type) {
        case "sub-form":
          break;
        case "lookup":
          const lookupSubscriberFields = this.getLookupSubsciberFields(name);
          const pk = valueObj["primaryKey"];
          const lk = valueObj["labelKey"];
          if (lookupSubscriberFields.length) {
            _.forEach(lookupSubscriberFields, (field) => {
              const key = field["name"];
              let val = null;
              if (typeof value[key] === "number") {
                val = value[key];
              } else {
                val = value[key] || "";
              }
              this.handleOnValueChange(field, val);
            });
          }
          const lookupValue = _.pick(value, [pk, lk, "instance_id"]);
          this.handleOnValueChange(valueObj, lookupValue);
          break;

        default:
          this.handleOnValueChange(valueObj, value);
      }
    }
  }

  onSummitTextInput(name) {
    const index = Object.keys(this.state).indexOf(name);
    if (
      index !== -1 &&
      this[Object.keys(this.state)[index + 1]] &&
      this[Object.keys(this.state)[index + 1]].textInput
    ) {
      this[Object.keys(this.state)[index + 1]].textInput._root.focus();
    } else {
      Keyboard.dismiss();
    }
  }

  getOtpByRefData = (field, cb) => {
    const validatedRes = customValidateData(field, "otp");
    Object.assign(field, validatedRes);
    const newField = {};
    newField[field.name] = field;
    this.setState({ ...newField });
    if (!validatedRes.invalidRef) {
      const refFieldData =
        field["ref_value_type"] === "PHONE"
          ? field["ref_value"].length === 10
            ? `91${field["ref_value"]}`
            : field["ref_value"]
          : field["ref_value"];
      this.props.getOtp(field, refFieldData, field["ref_value_type"]);
      cb();
    }
  };

  getFieldReturnValue = (field) => {
    if (
      field.type &&
      (field.type.match(/number/i) || field.type.match(/auto-incr-number/i))
    )
      return parseFloat(field.value);
    else if (
      field.type &&
      field.type === "picker" &&
      field.value === "-Select-"
    )
      return "";
    else if (field.type && field.type === "document") {
      const updateValue = !isEmpty(field.value)
        ? field.value.map((item) => {
            return {
              name: item["name"],
              file_path: item["filePath"]
                ? item["filePath"]
                : item["file_path"]
                ? item["file_path"]
                : "",
              content_type: item["type"]
                ? item["type"]
                : item["content_type"]
                ? item["content_type"]
                : "",
            };
          })
        : [];
      return updateValue;
    } else if (field.type === "longtext") {
      return !isEmpty(field.value) ? field.value.trim() : field.value;
    } else if (field.type === "otp") {
      // check  value and res.otp_code, if both are true then send value or send empty
      return !isEmpty(field.value) &&
        !isEmpty(field.res) &&
        !isEmpty(field.res.otp_code) &&
        field.value == field.res.otp_code
        ? Number(field.value)
        : null;
    } else return field.value;
  };

  getValues() {
    this.onValidateFields();
    const values = {};
    let isValidFields = true;
    Object.keys(this.state).forEach((fieldName) => {
      if (!["closeModal", "calcFields"].includes(fieldName)) {
        const field = this.state[fieldName];
        if (field) {
          if (field.error !== undefined && field.error) {
            isValidFields = false;
          }
          values[field.name] = this.getFieldReturnValue(field);
        }
      }
    });
    if (isValidFields) {
      const updatedValues = Object.keys(values).reduce((accumulator, key) => {
        if (key !== "undefined") {
          accumulator[key] = values[key];
        }

        return accumulator;
      }, {});
      return updatedValues;
    } else {
      return null;
    }
  }

  resetForm() {
    const newFields = {};
    Object.keys(this.state).forEach((fieldName) => {
      const field = this.state[fieldName];
      if (field) {
        field.value =
          field.editable !== undefined && !field.editable
            ? getDefaultValue(field)
            : getResetValue(field);
        field.error = false;
        field.errorMsg = "";
        field.success = false;
        field.successMsg = "";
        if (field.type === "group") {
          this[field.name].group.resetForm();
        }
        newFields[field.name] = field;
      }
    });
    this.setState({ ...newFields });
  }

  // Helper function for setValues
  getFieldValue(fieldObj, value) {
    const field = _.cloneDeep(fieldObj);
    if (field.type === "group") {
      const subFields = {};
      Object.keys(value).forEach((fieldName) => {
        subFields[fieldName] = value[fieldName];
      });
      this[field.name].group.setValues(subFields);
      field.value = this[field.name].group.getValues();
      // Remaing thing is error Handling Here
    } else if (
      field.type === "status_picker" &&
      field.show_first_option &&
      field.options[1] &&
      field.options.indexOf(value) < 0
    ) {
      field.value = field.options[1];
    } else {
      field.value = value;
      //Validate and check for errors
      // if (
      //   this.props.autoValidation === undefined ||
      //   this.props.autoValidation
      // ) {
      //   Object.assign(field, autoValidate(field));
      // }
      // Validate through customValidation if it is present in props
      if (
        this.props.customValidation &&
        typeof this.props.customValidation === "function"
      ) {
        Object.assign(field, this.props.customValidation(field));
      }
    }
    return field;
  }

  setValues(...args) {
    if (args && args.length && args[0]) {
      const newFields = {};
      Object.keys(args[0]).forEach((fieldName) => {
        /**
         * In update form, if any field value changes
         * image is greyed out, to avoid we are using deep clone object
         */
        const field =
          this.state &&
          this.state[fieldName] &&
          this.state[fieldName].type === "image"
            ? _.cloneDeep(this.state[fieldName])
            : this.state[fieldName];
        if (field) {
          newFields[field.name] = this.getFieldValue(field, args[0][fieldName]);
        }
      });

      const values = {};
      const namesInNewFields = new Set(Object.keys(newFields));
      const stateFields = Object.keys(this.state)
        .filter((key) => !namesInNewFields.has(key))
        .reduce((acc, key) => {
          acc[key] = this.state[key];
          return acc;
        }, {});

      const updatedFields = { ...newFields, ...stateFields };

      Object.keys(updatedFields).forEach((fieldName) => {
        const field = updatedFields[fieldName];
        if (field) {
          values[field.name] = this.getFieldReturnValue(field);
        }
      });

      const calcFields =
        this.state.calcFields && this.state.calcFields.length > 0
          ? this.state.calcFields
          : [];

      calcFields.forEach((field) => {
        const stateObj = this.state[field.name];
        if (
          stateObj &&
          stateObj.additional_config &&
          stateObj.additional_config.calc &&
          stateObj.additional_config.calc.expr
        ) {
          const calcExpr = jsonStringTemplater(
            stateObj.additional_config.calc.expr,
            values
          );
          try {
            const evaluateValue = evaluate(calcExpr, values);
            const updatevalue = !isNaN(evaluateValue)
              ? Number(Number(evaluateValue).toFixed(2))
              : evaluateValue === 0
              ? 0
              : null;
            newFields[stateObj.name] = this.getFieldValue(
              stateObj,
              !isNaN(updatevalue) ? updatevalue : null
            );
          } catch (err) {}
        }
      });

      Object.keys(updatedFields).forEach((fieldName) => {
        const field = updatedFields[fieldName];
        if (field && field["expr_field"] && field["expr_field"].length > 0) {
          const res = customFieldCalculations(
            field,
            field.value,
            updatedFields
          );
          if (res && res.length > 0) {
            res.forEach((item) => {
              newFields[item.name] = item;
            });
          }
        }
      });

      this.setState({ ...newFields }, () => {
        Object.keys(updatedFields).forEach((fieldName) => {
          const field = updatedFields[fieldName];
          if (
            field &&
            field["ref_field"] &&
            field["ref_field"]["usr_field"] &&
            field["ref_field"]["usr_field"].length > 0
          ) {
            field["ref_field"]["usr_field"].map((name) => {
              const userField = _.filter(
                this.props.fields,
                (field) => field.name === name
              );
              if (userField && userField.length > 0) {
                this.props.onGetQuery(userField[0], this.props.formData);
              }
            });
          }
        });
      });
    }
  }

  /**
   * Close lookup modal
   * on barcode search, if only one options is there then
   * automatically select that option and close the lookup modal
   */
  closeLookupModal = () => {
    this.setState({ closeModal: !this.state.closeModal });
  };

  generateFields() {
    const theme = Object.assign(baseTheme, this.props.theme);
    const { customComponents, errorComponent, successComponent } = this.props;

    let formKeys = Object.keys(this.state);
    const renderFields = formKeys.map((fieldName, index) => {
      const field = this.state[fieldName];
      if (!field.hidden) {
        const commonProps = {
          key: index,
          theme,
          attributes:
            field.type === "image"
              ? _.cloneDeep(this.state[field.name])
              : this.state[field.name],
          updateValue: this.onValueChange,
          onAddNewFields: this.onAddNewFields,
          getValue: this.getValue,
          ErrorComponent: errorComponent || DefaultErrorComponent,
          SuccessComponent: successComponent || DefaultSuccessComponent,
          navigation: this.props["navigation"] || null,
          AppRNText: this.props.inputComponents.AppText,
          AppRNTextInput: this.props.inputComponents.AppTextInput,
          AppNBText: this.props.inputComponents.AppNBText,
          AppNBInput: this.props.inputComponents.AppNBInput,
          AppAnimatedText: this.props.inputComponents.AppAnimatedText,
        };

        switch (field.type) {
          case "text":
          case "email":
          case "number":
          case "url":
          case "password":
          case "phone":
          case "calculated":
          case "auto-incr-number":
            return (
              <TextInputField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                onSummitTextInput={this.onSummitTextInput}
                {...this.props}
              />
            );

          case "longtext":
            return (
              <LongTextInputField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "barcode":
            return (
              <BarcodeField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "currency":
            return (
              <CurrencyField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );
          case "switch":
            return (
              <SwitchField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "date":
            return (
              <DateField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "picker":
            return (
              <PickerField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "status_picker":
            return (
              <StatusPicker
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "select":
            return (
              <SelectField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "checklist":
            return (
              <ChecklistField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "image":
            return (
              <ImageField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "signature":
            return (
              <SignatureField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "document":
            return (
              <DocumentField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "location":
            return (
              <LocationField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "group":
            return (
              <FormField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "sub-form":
            return (
              <SubForm
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "lookup":
            return (
              <Lookupfield
                ref={(c) => {
                  this[field.name] = c;
                }}
                closeModal={this.state.closeModal}
                closeLookupModal={this.closeLookupModal}
                {...commonProps}
                {...this.props}
              />
            );

          case "customDataView":
          case "product-catalog-sale":
            return (
              <CustomDataComponent
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "simple-grid":
            return (
              <SimpleGridView
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "collaborator":
            return (
              <CollaboratorField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "assignee":
            return (
              <AssigneeField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case "user_directory":
            return (
              <UserDirectoryField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
                getFormatedValues={this.getFormatedValues}
              />
            );

          case "cascading-dropdown":
            return (
              <CascadingDropdownField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
                state={this.state}
              />
            );

          case "otp":
            return (
              <OTPField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
                state={this.state}
                getOtpByRefData={this.getOtpByRefData}
              />
            );

          case "rating":
            return (
              <RatingField
                ref={(c) => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          default:
            break;
        }
      }
    });

    return renderFields;
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps={"handled"}>
        <View style={{ marginBottom: 10 }}>{this.generateFields()}</View>
      </ScrollView>
    );
  }
}

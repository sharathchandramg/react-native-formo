import PropTypes from "prop-types";
import React, { Component } from "react";
import { Modal, TouchableOpacity } from "react-native";
import { View, ArrowForwardIcon, ArrowBackIcon } from "native-base";
import shortid from "shortid";

import styles from "./styles";
import ChildField from "../childForm";
import LinearGradientHeader from "./../../components/headers/linearGradientHeader";
import StarIcon from "../../components/starIcon";

export default class SubForm extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    updateValue: PropTypes.func,
    theme: PropTypes.object,
    ErrorComponent: PropTypes.func,
    onAddNewFields: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      mode: "create",
      subFormData: {},
    };
  }

  handleChange = (name, value) => {
    if (value && typeof value._id !== "undefined" && value._id !== null) {
      this.props.onAddNewFields(name, value);
    } else if (value && value !== null) {
      value["_id"] = shortid.generate();
      this.props.onAddNewFields(name, value);
    }
  };

  toggleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  renderlookupIcon = () => {
    return (
      <TouchableOpacity
        style={styles.valueContainer}
        onPress={() =>
          this.setState({ subFormData: {}, mode: "create" }, () =>
            this.toggleModalVisible()
          )
        }
      >
        <ArrowForwardIcon size={"6"} color={"#41E1FD"} />
      </TouchableOpacity>
    );
  };

  renderAddedSubForm = (attributes) => {
    let data = attributes.value;
    let leftViewData = [];
    let rightViewData = [];
    let fields = attributes.fields;
    let lookupField = [];
    let ofd;
    fields.map((field) => {
      if (field.type === "lookup") {
        leftViewData = data.map((item) => item[field.name]);
        lookupField = field.fields;
      } else {
        rightViewData = data.map((item) => item[field.name]);
      }
    });

    return (
      <View style={{ flexDirection: "column", width: "100%" }}>
        {this.renderSubformData(leftViewData, rightViewData, lookupField, data)}
      </View>
    );
  };

  renderSubformData = (leftViewData, rightViewData, lookupField, data) => {
    let subForms = <View style={styles.subForm}> </View>;
    let leftLabel = <View style={styles.leftLabel}> </View>;
    const { attributes, AppNBText } = this.props;
    let fields = attributes.fields;

    if (leftViewData.length > 0 && rightViewData.length > 0) {
      subForms = leftViewData.map((item, index) => {
        let values = [];
        if (typeof lookupField !== "undefined" && lookupField.length) {
          values = lookupField.map((e) => item[e.name]);
        }
        leftLabel = values.map((val) => (
          <AppNBText size={14} style={styles.subformText}>{val}</AppNBText>
        ));
        let fdata = data[index];
        let rVal = [];

        fields.map((f) =>
          f.type !== "lookup" ? rVal.push(fdata[f.name]) : ""
        );

        rightLabel = rVal.map((item, index) => {
          switch (typeof item) {
            case "text":
            case "number":
            case "email":
            case "password":
            case "url":
            case "phone":
              if (!isNaN(item)) {
                return (
                  <AppNBText size={14} style={styles.subformText}>{item.toString()}</AppNBText>
                );
              }
              break;
            case "object":
              if (!Array.isArray(item) && item === null) {
                let val = Object.values(item).toString();
                return <AppNBText size={14} style={styles.subformText}>{val}</AppNBText>;
              }
              break;
            default:
          }
        });

        return (
          <TouchableOpacity
            style={{ marginBottom: 10, flex: 4, flexDirection: "row" }}
            onPress={() =>
              this.setState({ subFormData: data[index], mode: "update" }, () =>
                this.toggleModalVisible()
              )
            }
          >
            <View style={styles.leftLabelWrapper}>{leftLabel}</View>
            <View style={{ flex: 1, flexDirection: "column" }}>
              {rightLabel}
            </View>
          </TouchableOpacity>
        );
      });
    } else if (leftViewData.length > 0) {
      subForms = leftViewData.map((item, index) => {
        let values = [];
        if (typeof lookupField !== "undefined" && lookupField.length) {
          values = lookupField.map((e) => item[e.name]);
        }
        leftLabel = values.map((val) => (
          <AppNBText size={14} style={styles.subformText}>{val}</AppNBText>
        ));
        return (
          <TouchableOpacity
            style={{ marginBottom: 10, flex: 4, flexDirection: "row" }}
            onPress={() =>
              this.setState({ subFormData: data[index], mode: "update" }, () =>
                this.toggleModalVisible()
              )
            }
          >
            <View style={styles.leftLabelWrapper}>{leftLabel}</View>
          </TouchableOpacity>
        );
      });
    } else if (rightViewData.length > 0) {
      subForms = rightViewData.map((item, index) => {
        switch (typeof item) {
          case "text":
          case "number":
          case "email":
          case "password":
          case "url":
          case "phone":
            if (!isNaN(item)) {
              leftLabel = (
                <AppNBText size={14} style={styles.subformText}>{item.toString()}</AppNBText>
              );
            }
            break;
          case "object":
            if (!Array.isArray(item) && item === null) {
              let val = Object.values(item).toString();
              leftLabel = <AppNBText size={14} style={styles.subformText}>{val}</AppNBText>;
            }
            break;
          default:
        }

        return (
          <TouchableOpacity
            style={{ marginBottom: 10, flex: 4, flexDirection: "row" }}
            onPress={() =>
              this.setState({ subFormData: data[index], mode: "update" }, () =>
                this.toggleModalVisible()
              )
            }
          >
            <View style={styles.leftLabelWrapper}>{leftLabel}</View>
          </TouchableOpacity>
        );
      });
    }
    return subForms;
  };

  addNewFields = () => {
    let fValue = this.child.getChildFields();
    if (typeof fValue !== "undefined" && fValue !== null) {
      let uValue =
        this.state.mode === "update"
          ? { ...fValue, _id: this.state.subFormData._id }
          : fValue;
      this.handleChange(this.props.attributes.name, uValue);
      this.toggleModalVisible();
    }
  };

  renderComponent = () => {
    const { theme, attributes, AppNBText } = this.props;
    return (
      <View style={styles.modalContent}>
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerLeft}
              onPress={() => this.toggleModalVisible()}
            >
              <ArrowBackIcon size={"6"} color={"rgb(0,151,235)"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerCenter}>
              <AppNBText size={18} style={theme.headerText}>
                {attributes.label || "Select"}
              </AppNBText>
            </TouchableOpacity>
          </View>
          <LinearGradientHeader />
        </View>
        <View>
          <ChildField
            ref={(c) => {
              this.child = c;
            }}
            {...this.props}
            formData={this.state.subFormData}
          />
        </View>
        <View style={styles.footerWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.addNewFields()}
          >
            <AppNBText size={18} style={styles.buttonText}>
              {this.state.mode === "create" ? "Add" : "Update"}
            </AppNBText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const { theme, attributes, ErrorComponent,AppNBText } = this.props;
    return (
      <View style={styles.container}>
        <View
          style={[styles.inputField]}
          error={theme.changeTextInputColorOnError ? attributes.error : null}
        >
          <View style={[styles.inputLabel]}>
            {attributes["required"] && (
              <StarIcon required={attributes["required"]} />
            )}
            <AppNBText size={16} style={[styles.labelText]}>{attributes.label}</AppNBText>
            {this.renderlookupIcon()}
          </View>
          {typeof attributes.value !== "undefined" &&
          attributes.value !== null &&
          attributes.value.length > 0
            ? this.renderAddedSubForm(attributes)
            : null}
        </View>
        <Modal
          visible={this.state.modalVisible}
          animationType="none"
          onRequestClose={() => this.toggleModalVisible()}
          transparent={true}
        >
          {this.renderComponent()}
        </Modal>
        <View style={{ paddingHorizontal: 5 }}>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}

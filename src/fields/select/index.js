import PropTypes from "prop-types";
import React, { Component } from "react";
import { Modal, ScrollView, TouchableOpacity } from "react-native";
import { View, Checkbox, ArrowForwardIcon, ArrowBackIcon } from "native-base";

import StarIcon from "../../components/starIcon";
import { isEmpty } from "../../utils/validators";
import LinearGradientHeader from "./../../components/headers/linearGradientHeader";
import styles from "./styles";

const _ = require("lodash");

export default class SelectField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    updateValue: PropTypes.func,
    theme: PropTypes.object,
    ErrorComponent: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      activeCategoryData: [],
      activeCategory: null,
      filterData: [],
      newSelected: null,
      options: [],
    };
  }

  componentDidMount() {
    const { attributes } = this.props;
    if (!isEmpty(attributes) && !isEmpty(attributes["data_source"])) {
      const { type } = attributes["data_source"];
      if (!isEmpty(type) && type === "remote") {
        let len = attributes["options"] ? attributes["options"].length : 0;
        let offset = len;
        this.handleOnGetQuery(offset);
      } else {
        this.setLocalOptions(attributes["options"]);
      }
    } else {
      this.setLocalOptions(attributes["options"]);
    }

    if (
      this.isFilterEnable(attributes) &&
      !isEmpty(attributes["filterCategory"])
    ) {
      let activeCategory = attributes["filterCategory"][0];
      if (
        typeof activeCategory !== "undefined" &&
        !isEmpty(attributes["options"])
      ) {
        this.setState({ options: attributes["options"] }, () => {
          this.setFilterCategory(activeCategory);
        });
      }
    }
  }

  handleOnGetQuery = (offset) => {
    const { onGetQuery, attributes } = this.props;
    if (
      !isEmpty(attributes) &&
      !isEmpty(attributes["data_source"]) &&
      attributes["data_source"]["type"] === "remote"
    ) {
      if (typeof onGetQuery === "function") {
        onGetQuery(attributes, offset);
      }
    } else {
      attributes["options"] = this.state.options;
      this.setState({});
    }
  };

  setLocalOptions = (options) => {
    if (!isEmpty(options)) {
      this.setState({ options: options });
    }
  };

  statusOptionsFormatter = (options, type) => {
    let data = [];
    if (!isEmpty(options)) {
      for (let i = 0; i < options.length; i++) {
        let obj = { label: "", value: "", type: "" };
        if (typeof options[i] === "string") {
          obj["label"] = options[i];
          obj["value"] = options[i];
          obj["type"] = type;
          data.push(obj);
        }
      }
    }
    return data;
  };

  setFilterCategory = (item) => {
    const categoryData = this.statusOptionsFormatter(
      item["options"],
      item["type"]
    );
    this.setState({
      activeCategoryData: categoryData,
      activeCategory: item,
      filterData: categoryData,
    });
  };

  isFilterEnable = (attributes) => {
    if (!isEmpty(attributes) && !isEmpty(attributes["additional"])) {
      const { filterEnable } = attributes["additional"];
      const filterCategory = attributes["filterCategory"];

      if (
        !isEmpty(filterCategory) &&
        typeof filterEnable !== "undefined" &&
        filterEnable
      ) {
        return true;
      }
    }
    return false;
  };

  isSearchEnable = (attributes) => {
    if (!isEmpty(attributes) && !isEmpty(attributes["additional"])) {
      const { searchEnable } = attributes["additional"];
      if (typeof searchEnable !== "undefined" && searchEnable) {
        return true;
      }
    }
    return false;
  };

  handleAddPressed = () => {
    const { attributes, updateValue } = this.props;
    const newSelected = this.state.newSelected;
    if (!isEmpty(newSelected) && typeof updateValue === "function") {
      updateValue(attributes.name, newSelected);
    }
    this.setState({ modalVisible: false });
  };

  toggleModalVisible() {
    if (!this.state.modalVisible) {
      const attributes = this.props.attributes;
      if (!isEmpty(attributes) && !isEmpty(attributes["value"])) {
        this.setState({
          newSelected: attributes["value"],
        });
      }
    }
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }

  toggleSelect(value) {
    const attributes = this.props.attributes;
    let newSelected = attributes.multiple ? attributes.value : value;
    if (attributes.multiple) {
      newSelected = Array.isArray(newSelected) ? newSelected : [];
      const index = attributes.objectType
        ? newSelected.findIndex(
            (option) =>
              option[attributes.primaryKey] === value[attributes.primaryKey]
          )
        : newSelected.indexOf(value);
      if (index === -1) {
        newSelected.push(value);
      } else {
        newSelected.splice(index, 1);
      }
    }
    this.setState(
      {
        modalVisible: attributes.multiple ? this.state.modalVisible : false,
        newSelected: newSelected,
      },
      () => this.props.updateValue(this.props.attributes.name, newSelected)
    );
  }

  getLabel = () => {
    const { attributes } = this.props;
    let label = "None";
    if (!isEmpty(attributes["value"])) {
      if (attributes.multiple) {
        const labelKeyArr = attributes["value"].map((obj) => {
          const labelKey = attributes.objectType
            ? obj[attributes.labelKey]
            : obj;
          return labelKey;
        });
        if (labelKeyArr.length) {
          label = ` ${labelKeyArr.length} | ${labelKeyArr.toString()}`;
        }
      } else {
        label = attributes.objectType
          ? attributes["value"][attributes.labelKey]
          : attributes["value"];
      }
    }
    return label;
  };

  renderIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => this.toggleModalVisible()}
        style={{ width: "7%" }}
      >
        <ArrowForwardIcon size={"6"} color={"#41E1FD"} />
      </TouchableOpacity>
    );
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

        <ScrollView style={{ marginBottom: 50 }}>
          {!isEmpty(attributes["options"]) &&
            attributes.options.map((item, index) => {
              let isSelected = false;
              if (attributes.multiple) {
                isSelected = attributes.objectType
                  ? attributes.value &&
                    attributes.value.findIndex(
                      (option) =>
                        option[attributes.primaryKey] ===
                        item[attributes.primaryKey]
                    ) !== -1
                  : attributes.value && attributes.value.indexOf(item) !== -1;
              }
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => this.toggleSelect(item)}
                  style={{
                    height: 50,
                    marginHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgb(230, 230, 230)",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  {attributes.multiple && (
                    <Checkbox
                      onPress={() => this.toggleSelect(item)}
                      isChecked={isSelected}
                      colorScheme={"rgb(0,151,235)"}
                      accessibilityLabel={
                        attributes.objectType ? item[attributes.labelKey] : item
                      }
                    />
                  )}
                  <View>
                    <AppNBText size={16} style={{ paddingHorizontal: 5 }}>
                      {attributes.objectType ? item[attributes.labelKey] : item}
                    </AppNBText>
                  </View>
                </TouchableOpacity>
              );
            })}
        </ScrollView>

        {attributes && attributes["multiple"] ? (
          <View style={styles.footerWrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.handleAddPressed()}
            >
              <AppNBText size={18} style={styles.buttonText}>
                {"Add"}{" "}
              </AppNBText>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    const { theme, attributes, ErrorComponent, AppNBText } = this.props;
    return (
      <View style={styles.container}>
        <View style={[styles.inputLabelWrapper, { width: "95%" }]}>
          <TouchableOpacity
            style={styles.inputLabel}
            error={theme.changeTextInputColorOnError ? attributes.error : null}
            onPress={() => this.toggleModalVisible()}
          >
            <View style={styles.labelTextWrapper}>
              {attributes["required"] && (
                <StarIcon required={attributes["required"]} />
              )}

              <AppNBText size={16} style={[styles.labelText]}>
                {attributes.label}
              </AppNBText>
            </View>
            <View
              style={[
                styles.valueWrapper,
                { paddingLeft: attributes["required"] ? 13 : 5 },
              ]}
            >
              <View style={{ width: "93%" }}>
                <AppNBText size={18} style={styles.inputText} numberOfLines={1}>
                  {this.getLabel()}
                </AppNBText>
              </View>
              {this.renderIcon()}
            </View>
          </TouchableOpacity>
        </View>

        {this.state.modalVisible && (
          <Modal
            visible={this.state.modalVisible}
            animationType="none"
            onRequestClose={() => this.toggleModalVisible()}
            transparent={true}
          >
            {this.renderComponent()}
          </Modal>
        )}
        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}

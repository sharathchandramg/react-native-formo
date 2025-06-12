import PropTypes from "prop-types";
import React, { Component } from "react";
import { Modal, TouchableOpacity } from "react-native";
import {
  View,
  ArrowBackIcon,
  ArrowForwardIcon,
  SearchIcon,
  Checkbox,
} from "native-base";

import { isEmpty } from "../../utils/validators";
import StarIcon from "../../components/starIcon";
import LinearGradientHeader from "./../../components/headers/linearGradientHeader";
import SearchHeader from "../../components/headers/searchHeader";
import styles from "./styles";

const _ = require("lodash");

export default class ChecklistField extends Component {
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
      searchModalVisible: false,
      searchText: "",
    };
  }

  componentDidMount() {
    const { attributes } = this.props;
    this.setLocalOptions(attributes["options"]);
  }

  setLocalOptions = (options) => {
    if (!isEmpty(options)) {
      this.setState({ options: options, copyOptions: options });
    }
  };

  handleAddPressed = () => {
    const { attributes, updateValue } = this.props;
    const newSelected = this.state.newSelected;
    if (!isEmpty(newSelected) && typeof updateValue === "function") {
      updateValue(attributes.name, newSelected);
    }
    this.setState({ modalVisible: false, searchModalVisible: false });
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
      searchText: "",
    });
  }

  toggleSelect(value) {
    const attributes = this.props.attributes;
    let newSelected = attributes.value || [];

    const index = attributes.objectType
      ? newSelected.findIndex(
          (option) => option === value[attributes.primaryKey]
        )
      : newSelected.indexOf(value);

    if (index === -1) {
      const v = attributes.objectType ? value[attributes.primaryKey] : value;
      newSelected.push(v);
    } else {
      newSelected.splice(index, 1);
    }
    this.setState(
      {
        modalVisible: this.state.modalVisible,
        newSelected: newSelected,
      },
      () => this.props.updateValue(this.props.attributes.name, newSelected)
    );
  }

  toggleSearchModalVisible = () => {
    const { attributes } = this.props;
    this.setState({
      searchModalVisible: !this.state.searchModalVisible,
      modalVisible: true,
      searchText: "",
      options: attributes["options"],
    });
  };

  handleTextChange = (searchText) => {
    let options = [];
    const { attributes } = this.props;
    if (searchText) {
      options = _.filter(attributes.options, (item) => {
        let sItem =
          item[attributes.labelKey]
            .toString()
            .toLowerCase()
            .search(searchText.trim().toLowerCase()) > -1;
        if (sItem) {
          return item;
        }
      });
    } else {
      options = this.state.copyOptions;
    }
    this.setState({
      searchText: searchText,
      options: options,
    });
  };

  getLabel = () => {
    const { attributes } = this.props;
    let label = "None";
    if (!isEmpty(attributes["value"])) {
      const labelKeyArr = attributes["value"].map((obj) => {
        const optionObj = _.find(attributes.options, {
          [attributes.primaryKey]: obj,
        });
        const labelKey = attributes.objectType
          ? optionObj[attributes.labelKey]
          : obj;
        return labelKey;
      });
      if (labelKeyArr.length) {
        label = ` ${labelKeyArr.length} | ${labelKeyArr.toString()}`;
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

  renderHeader = () => {
    const { theme, attributes, AppNBText } = this.props;
    return (
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
          <TouchableOpacity
            style={styles.headerCenterIconView}
            onPress={() => this.toggleSearchModalVisible()}
          >
            <SearchIcon size={"6"} color={"rgb(0,151,235)"} />
          </TouchableOpacity>
        </View>
        <LinearGradientHeader />
      </View>
    );
  };

  renderContent = () => {
    const { attributes, AppNBText } = this.props;
    return (
      <View>
        {!isEmpty(this.state.options) &&
          this.state.options.map((item, index) => {
            let isSelected = false;
            isSelected = attributes.objectType
              ? attributes.value &&
                attributes.value.findIndex(
                  (option) => option === item[attributes.primaryKey]
                ) !== -1
              : attributes.value && attributes.value.indexOf(item) !== -1;
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
                <Checkbox
                  onPress={() => this.toggleSelect(item)}
                  isChecked={isSelected}
                  colorScheme={"rgb(0,151,235)"}
                  accessibilityLabel={
                    attributes.objectType ? item[attributes.labelKey] : item
                  }
                />
                <View>
                  <AppNBText size={16} style={{ paddingHorizontal: 5 }}>
                    {attributes.objectType ? item[attributes.labelKey] : item}
                  </AppNBText>
                </View>
              </TouchableOpacity>
            );
          })}
      </View>
    );
  };

  renderFooter = () => {
    const { attributes, AppNBText } = this.props;
    if (attributes) {
      return (
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
      );
    }
    return null;
  };

  renderComponent = () => {
    if (this.state.searchModalVisible) {
      return (
        <View style={styles.modalContent}>
          <SearchHeader
            toggleSearchModalVisible={this.toggleSearchModalVisible}
            handleOnSearchQuery={this.handleTextChange}
            handleTextChange={this.handleTextChange}
            searchText={this.state.searchText}
          />
          {this.renderContent()}
        </View>
      );
    } else {
      return (
        <View style={styles.modalContent}>
          {this.renderHeader()}
          {this.renderContent()}
          {this.renderFooter()}
        </View>
      );
    }
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

              <AppNBText size={16} style={styles.labelText}>
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

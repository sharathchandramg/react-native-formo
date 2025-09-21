import PropTypes from "prop-types";
import React, { Component } from "react";
import { Modal, TouchableOpacity, ScrollView } from "react-native";
import _ from "lodash";
import {
  View,
  ArrowBackIcon,
  ArrowForwardIcon,
  SearchIcon,
  Checkbox,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import styles from "./styles";
import { isEmpty } from "../../utils/validators";
import LinearGradientHeader from "./../../components/headers/linearGradientHeader";
import SearchHeader from "../../components/headers/searchHeader";
import StarIcon from "../../components/starIcon";

export default class UserDirectoryField extends Component {
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
      searchModalVisible: false,
      searchText: "",
      newSelected: null,
    };
  }

  componentDidMount() {
    this.setInitialData();
  }

  setInitialData = () => {
    const { attributes } = this.props;
    if (!isEmpty(attributes) && attributes["type"].match(/user_directory/)) {
      this.handleOnGetQuery();
    }
  };

  handleOnGetQuery = () => {
    const { onGetQuery, attributes, getFormatedValues } = this.props;
    if (!isEmpty(attributes) && attributes["type"].match(/user_directory/)) {
      if (typeof onGetQuery === "function") {
        onGetQuery(attributes, getFormatedValues());
      }
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

  toggleSearchModalVisible = () => {
    this.setState((prev) => ({
      searchModalVisible: !prev.searchModalVisible,
      modalVisible: true,
      searchText: "",
    }));
  };

  // <-- Re-introduced setInitialData call here (same behaviour as original)
  toggleModalVisible() {
    const attributes = this.props.attributes;

    // If opening modal
    if (!this.state.modalVisible) {
      if (!isEmpty(attributes) && !isEmpty(attributes["value"])) {
        this.setState(
          {
            newSelected: attributes["value"],
            modalVisible: true,
            searchText: "",
          },
          () => this.setInitialData()
        );
      } else {
        this.setState(
          {
            modalVisible: true,
            searchText: "",
          },
          () => this.setInitialData()
        );
      }
    } else {
      // If closing modal (preserve previous behaviour and still call setInitialData)
      this.setState(
        {
          modalVisible: false,
          searchText: "",
        },
        () => this.setInitialData()
      );
    }
  }

  toggleSelect(value) {
    const attributes = this.props.attributes;
    if (!isEmpty(value) && !isEmpty(attributes)) {
      const pk = attributes.primaryKey;
      const obType = attributes.objectType;
      let valueObj = { ...value };

      if (attributes.multiple) {
        let newSelected = attributes["value"];
        newSelected = Array.isArray(newSelected) ? newSelected : [];
        const index = obType
          ? newSelected.findIndex(
              (option) => option && option[pk] === value[pk]
            )
          : newSelected.indexOf(value);

        if (index === -1) {
          newSelected.push(valueObj);
        } else {
          newSelected.splice(index, 1);
        }

        this.setState(
          {
            modalVisible: attributes.multiple ? this.state.modalVisible : false,
            newSelected: newSelected,
            searchModalVisible: false,
          },
          () => this.props.updateValue(this.props.attributes.name, newSelected)
        );
      } else {
        this.setState(
          {
            modalVisible: false,
            searchModalVisible: false,
          },
          () => this.props.updateValue(this.props.attributes.name, valueObj)
        );
      }
    }
  }

  handleTextChange = (searchText) => {
    this.setState({ searchText });
  };

  handleOnSearchQuery = (searchText) => {
    this.setState({
      searchText,
      searchModalVisible: false,
    });
  };

  handleReset = () => {
    this.setState({
      searchText: "",
    });
  };

  getFilteredOptions = () => {
    const { attributes } = this.props;
    const { searchText } = this.state;

    if (isEmpty(attributes?.options)) return [];

    if (!searchText) return attributes.options;

    return _.filter(attributes.options, (item) => {
      const labelKey = attributes.labelKey;
      const userAlias = item["user_alias"]?.toString().toLowerCase() || "";

      const label =
        attributes.objectType && item[labelKey]
          ? item[labelKey].toString().toLowerCase()
          : item.toString().toLowerCase();

      const query = searchText.trim().toLowerCase();

      return label.includes(query) || userAlias.includes(query);
    });
  };

  getLabel = () => {
    const { attributes } = this.props;
    let label = "None";
    if (!isEmpty(attributes["value"])) {
      const value = attributes["value"];
      const lk = attributes["labelKey"];
      const obType = attributes["objectType"];

      if (attributes.multiple) {
        const labelKeyArr = value.map((option) => {
          const labelKey = obType ? option && option[lk] : option;
          return labelKey;
        });
        if (labelKeyArr.length) {
          label = ` ${labelKeyArr.length} | ${labelKeyArr.toString()}`;
        }
      } else {
        label = obType ? value && value[lk] : value;
      }
    }
    return label;
  };

  renderIcon = (attributes) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (attributes.editable) this.toggleModalVisible();
        }}
        style={{ width: "7%" }}
      >
        <ArrowForwardIcon size={"6"} color={"#41E1FD"} />
      </TouchableOpacity>
    );
  };

  displayLabelKey = (item) => {
    const { attributes } = this.props;
    let label = "";
    if (attributes["objectType"] && !isEmpty(item)) {
      const labelKey = item[attributes.labelKey];
      const userAlias =
        typeof item["user_alias"] !== "undefined" ? item["user_alias"] : "";
      label = userAlias ? `${labelKey}(${userAlias})` : `${labelKey} (N/A)`;
    } else {
      label = item;
    }
    return label;
  };

  renderOptionList = () => {
    const { attributes, AppNBText } = this.props;
    const options = this.getFilteredOptions();

    if (isEmpty(options)) {
      return (
        <View style={styles.noDataWrapper}>
          <AppNBText size={14} style={styles.nodataText}>
            No records found
          </AppNBText>
        </View>
      );
    }

    return options.map((item, index) => {
      let isSelected = false;
      if (attributes.multiple) {
        isSelected = attributes.objectType
          ? attributes.value &&
            attributes.value.findIndex(
              (option) =>
                option &&
                option[attributes.primaryKey] === item[attributes.primaryKey]
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
              accessibilityLabel={this.displayLabelKey(item)}
            />
          )}
          <View>
            <AppNBText size={14} style={{ paddingHorizontal: 5 }}>
              {this.displayLabelKey(item)}
            </AppNBText>
          </View>
        </TouchableOpacity>
      );
    });
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

  renderFooter = () => {
    const { attributes, AppNBText } = this.props;
    if (attributes && attributes["multiple"]) {
      return (
        <View style={styles.footerWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.handleAddPressed()}
          >
            <AppNBText size={18} style={styles.buttonText}>
              {"Add"}
            </AppNBText>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  renderSearchText = () => {
    const { AppNBText } = this.props;
    if (this.state.searchText) {
      return (
        <View style={styles.selectedContainer}>
          <TouchableOpacity
            style={styles.selectedStatusOuter}
            onPress={() => this.handleReset()}
          >
            <AppNBText
              size={12}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.95}
              numberOfLines={1}
              style={styles.selectedText}
            >
              {this.state.searchText}
            </AppNBText>
            <TouchableOpacity
              style={styles.removeFilterIcon}
              onPress={() => this.handleReset()}
            >
              <Icon
                name={"times-circle"}
                style={{ fontSize: 14, color: "white" }}
                type="FontAwesome"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  renderComponent = () => {
    const { AppNBInput } = this.props;
    if (this.state.searchModalVisible) {
      return (
        <View style={styles.modalContent}>
          <SearchHeader
            toggleSearchModalVisible={this.toggleSearchModalVisible}
            handleOnSearchQuery={this.handleOnSearchQuery}
            handleTextChange={this.handleTextChange}
            searchText={this.state.searchText}
            AppNBInput={AppNBInput}
          />
          <ScrollView style={{ flex: 1 }}>
            <View>{this.renderOptionList()}</View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.modalContent}>
          {this.renderHeader()}
          {this.renderSearchText()}
          <ScrollView style={{ flex: 1 }}>
            <View>{this.renderOptionList()}</View>
          </ScrollView>
          {this.renderFooter()}
        </View>
      );
    }
  };

  render() {
    const { theme, attributes, ErrorComponent, AppNBText, AppRNText } =
      this.props;
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.inputLabelWrapper,
            { width: "95%", opacity: attributes.editable ? 1 : 0.5 },
          ]}
        >
          <TouchableOpacity
            style={styles.inputLabel}
            error={theme.changeTextInputColorOnError ? attributes.error : null}
            onPress={() => {
              if (attributes.editable) this.toggleModalVisible();
            }}
          >
            <View style={styles.labelTextWrapper}>
              {attributes["required"] && (
                <StarIcon
                  required={attributes["required"]}
                  AppNBText={AppNBText}
                />
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
              <View style={{ width: "93%" }} numberOfLines={1}>
                <AppNBText size={18} style={styles.inputText}>
                  {this.getLabel()}
                </AppNBText>
              </View>
              {this.renderIcon(attributes)}
            </View>
          </TouchableOpacity>
        </View>

        <Modal
          visible={this.state.modalVisible}
          animationType="none"
          onRequestClose={() => this.toggleModalVisible()}
          transparent={true}
        >
          {this.renderComponent()}
        </Modal>

        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme, AppRNText }} />
        </View>
      </View>
    );
  }
}

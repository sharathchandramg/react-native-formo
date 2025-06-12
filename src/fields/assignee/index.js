import PropTypes from "prop-types";
import React, { Component } from "react";
import { Modal, TouchableOpacity } from "react-native";
import _ from "lodash";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  View,
  ArrowBackIcon,
  ArrowForwardIcon,
  SearchIcon,
  Checkbox,
} from "native-base";

import { isEmpty } from "../../utils/validators";
import LinearGradientHeader from "./../../components/headers/linearGradientHeader";
import styles from "./styles";
import SearchHeader from "../../components/headers/searchHeader";
import StarIcon from "../../components/starIcon";

export default class AssigneeField extends Component {
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
      options: [],
      searchText: "",
      newSelected: null,
    };
  }

  componentDidMount() {
    this.setInitialData();
  }

  setInitialData = () => {
    const { attributes } = this.props;
    if (!isEmpty(attributes) && attributes["type"].match(/assignee/)) {
      this.handleOnGetQuery();
      this.setLocalOptions(attributes["options"]);
    } else {
      this.setLocalOptions(attributes["options"]);
    }
  };

  handleOnGetQuery = () => {
    const { onGetQuery, attributes } = this.props;
    if (!isEmpty(attributes) && attributes["type"].match(/assignee/)) {
      if (typeof onGetQuery === "function") {
        onGetQuery(attributes);
      }
    }
  };

  setLocalOptions = (options) => {
    if (!isEmpty(options)) {
      this.setState({ options: options });
    }
  };

  toggleSearchModalVisible = () => {
    const { attributes } = this.props;
    this.setState({
      searchModalVisible: !this.state.searchModalVisible,
      modalVisible: true,
      searchText: "",
      options: attributes["options"],
    });
  };

  toggleModalVisible() {
    const attributes = this.props.attributes;
    if (!this.state.modalVisible) {
      if (!isEmpty(attributes) && !isEmpty(attributes["value"])) {
        this.setState(
          {
            newSelected: attributes["value"],
            modalVisible: !this.state.modalVisible,
            searchText: "",
          },
          () => this.setInitialData()
        );
      } else {
        this.setState(
          {
            modalVisible: !this.state.modalVisible,
            searchText: "",
          },
          () => this.setInitialData()
        );
      }
    } else {
      this.setState(
        {
          modalVisible: !this.state.modalVisible,
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
      const lk = attributes.labelKey;
      const obType = attributes.objectType;
      let valueObj = {};
      valueObj[`${pk}`] = value[pk];
      valueObj[`${lk}`] = value[lk];
      if (attributes.multiple) {
        let newSelected = attributes["value"];
        newSelected = Array.isArray(newSelected) ? newSelected : [];
        const index = obType
          ? newSelected.findIndex(
              (option) =>
                option["designation"] && option["designation"][pk] === value[pk]
            )
          : newSelected.indexOf(value);
        if (index === -1) {
          newSelected.push({ designation: valueObj });
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
          () =>
            this.props.updateValue(this.props.attributes.name, {
              designation: valueObj,
            })
        );
      }
    }
  }

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
      options = this.state.options;
    }
    this.setState({
      searchText: searchText,
      options: options,
    });
  };

  handleOnSearchQuery = (searchText) => {
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
      options = this.state.options;
    }

    this.setState({
      searchModalVisible: false,
      searchText: searchText,
      options: options,
    });
  };

  handleReset = () => {
    const { attributes } = this.props;
    this.setState({
      searchText: "",
      options: attributes["options"],
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
          const labelKey = obType
            ? option["designation"] && option["designation"][lk]
            : option;
          return labelKey;
        });
        if (labelKeyArr.length) {
          label = ` ${labelKeyArr.length} | ${labelKeyArr.toString()}`;
        }
      } else {
        label = obType
          ? value["designation"] && value["designation"][lk]
          : value;
      }
    }
    return label;
  };

  renderIcon = () => {
    return (
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => this.toggleModalVisible()}
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
    let list = [];

    if (!isEmpty(this.state["options"]) && this.state["options"].length) {
      list = this.state.options.map((item, index) => {
        let isSelected = false;
        if (!isEmpty(item)) {
          if (attributes.multiple) {
            isSelected = attributes.objectType
              ? attributes.value &&
                attributes.value.findIndex(
                  (option) =>
                    option["designation"] &&
                    option["designation"][attributes.primaryKey] ===
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
                  accessibilityLabel={this.displayLabelKey(item)}
                />
              )}
              <View>
                <AppNBText
                  size={16}
                  style={{
                    paddingHorizontal: 5,
                  }}
                >
                  {this.displayLabelKey(item)}
                </AppNBText>
              </View>
            </TouchableOpacity>
          );
        }
      });
    }
    return list.length ? list : null;
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
              numberOfLines={1}
              style={styles.selectedText}
              minimumFontScale={0.95}
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
          <View>{this.renderOptionList()}</View>
        </View>
      );
    } else {
      return (
        <View style={styles.modalContent}>
          {this.renderHeader()}
          {this.renderSearchText()}
          <View>{this.renderOptionList()}</View>
        </View>
      );
    }
  };

  render() {
    const { theme, attributes, ErrorComponent, AppNBText, AppRNText } =
      this.props;
    return (
      <View style={styles.container}>
        <View style={[styles.inputLabelWrapper, { width: "95%" }]}>
          <TouchableOpacity
            style={[styles.inputLabel]}
            error={theme.changeTextInputColorOnError ? attributes.error : null}
            onPress={() => this.toggleModalVisible()}
          >
            {attributes["required"] && (
              <StarIcon
                required={attributes["required"]}
                AppNBText={AppNBText}
              />
            )}
            <View style={[styles.labelTextWrapper, { flexDirection: "row" }]}>
              <AppNBText
                size={18}
                style={[styles.labelText]}
                numberOfLines={2}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.95}
              >
                {attributes.label}
              </AppNBText>
            </View>
            <View style={styles.valueWrapper}>
              <AppNBText
                size={15}
                style={styles.inputText}
                numberOfLines={2}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.95}
              >
                {this.getLabel()}
              </AppNBText>
            </View>
            {this.renderIcon()}
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

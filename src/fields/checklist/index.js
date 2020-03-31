import PropTypes from "prop-types";
import React, { Component } from "react";
import { Modal, TouchableOpacity } from "react-native";
const _ = require("lodash");
import { isEmpty } from "../../utils/validators";
import {
  View,
  Text,
  Container,
  Header,
  Content,
  ListItem,
  CheckBox,
  Left,
  Right,
  Icon,
  Body,
  Title,
  Button,
  Footer
} from "native-base";

import StarIcon from "../../components/starIcon";
import SearchHeader from "../../components/headers/searchHeader";
import styles from "./styles";

export default class ChecklistField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    updateValue: PropTypes.func,
    theme: PropTypes.object,
    ErrorComponent: PropTypes.func
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
      searchText: ""
    };
  }

  componentDidMount() {
    const { attributes } = this.props;
    this.setLocalOptions(attributes["options"]);
  }

  setLocalOptions = options => {
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
          newSelected: attributes["value"]
        });
      }
    }
    this.setState({
      modalVisible: !this.state.modalVisible,
      searchText: ""
    });
  }

  toggleSelect(value) {
    const attributes = this.props.attributes;
    let newSelected = attributes.value || [];

    const index = attributes.objectType
      ? newSelected.findIndex(option => option === value[attributes.primaryKey])
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
        newSelected: newSelected
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
      options: attributes["options"]
    });
  };

  handleTextChange = searchText => {
    let options = [];
    const { attributes } = this.props;
    if (searchText) {
      options = _.filter(attributes.options, item => {
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
      options: options
    });
  };

  getLabel = () => {
    const { attributes } = this.props;
    let label = "None";
    if (!isEmpty(attributes["value"])) {
      const labelKeyArr = attributes["value"].map(obj => {
        const optionObj = _.find(attributes.options, {
          [attributes.primaryKey]: obj
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
        style={styles.iconWrapper}
        onPress={() => this.toggleModalVisible()}
      >
        <Icon name="ios-arrow-forward" style={styles.iconStyle} />
      </TouchableOpacity>
    );
  };

  renderHeader = () => {
    const { theme, attributes } = this.props;
    return (
      <Header style={[theme.header]} androidStatusBarColor="#c8c8c8">
        <Left>
          <Button transparent onPress={() => this.toggleModalVisible()}>
            <Icon name="arrow-back" style={theme.headerLeftIcon} />
          </Button>
        </Left>
        <Body>
          <Title style={theme.headerText}>{attributes.label || "Select"}</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => this.toggleSearchModalVisible()}>
            <Icon
              name="search"
              style={[theme.headerLeftIcon, { fontSize: 18 }]}
              type="FontAwesome"
            />
          </Button>
        </Right>
      </Header>
    );
  };

  renderContent = () => {
    const { attributes } = this.props;
    return (
      <Content>
        {!isEmpty(this.state.options) &&
          this.state.options.map((item, index) => {
            let isSelected = false;
            isSelected = attributes.objectType
              ? attributes.value &&
                attributes.value.findIndex(
                  option => option === item[attributes.primaryKey]
                ) !== -1
              : attributes.value && attributes.value.indexOf(item) !== -1;
            return (
              <ListItem key={index} onPress={() => this.toggleSelect(item)}>
                <CheckBox
                  onPress={() => this.toggleSelect(item)}
                  checked={isSelected}
                />
                <Body>
                  <Text style={{ paddingHorizontal: 5 }}>
                    {attributes.objectType ? item[attributes.labelKey] : item}
                  </Text>
                </Body>
              </ListItem>
            );
          })}
      </Content>
    );
  };

  renderFotter = () => {
    const { attributes } = this.props;
    if (attributes) {
      return (
        <Footer style={styles.button}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.handleAddPressed()}
          >
            <Text style={styles.buttonText}>{"Add"} </Text>
          </TouchableOpacity>
        </Footer>
      );
    }
    return null;
  };

  renderComponent = () => {
    const { theme } = this.props;
    if (this.state.searchModalVisible) {
      return (
        <Container style={{ flex: 1 }}>
          <SearchHeader
            toggleSearchModalVisible={this.toggleSearchModalVisible}
            handleOnSearchQuery={this.handleTextChange}
            handleTextChange={this.handleTextChange}
            theme={theme}
            searchText={this.state.searchText}
          />
          {this.renderContent()}
        </Container>
      );
    } else {
      return (
        <Container style={{ flex: 1 }}>
          {this.renderHeader()}
          {this.renderContent()}
          {this.renderFotter()}
        </Container>
      );
    }
  };

  render() {
    const { theme, attributes, ErrorComponent } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.inputLabelWrapper}>
          <TouchableOpacity
            style={[styles.inputLabel]}
            error={theme.changeTextInputColorOnError ? attributes.error : null}
            onPress={() => this.toggleModalVisible()}
          >
            {attributes["required"] && (
              <StarIcon required={attributes["required"]} />
            )}
            <View style={[styles.labelTextWrapper, { flexDirection: "row" }]}>
              <Text
                style={[styles.labelText]}
                numberOfLines={2}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.8}
              >
                {attributes.label}
              </Text>
            </View>
            <View style={styles.valueWrapper}>
              <Text
                style={styles.inputText}
                numberOfLines={2}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.8}
              >
                {this.getLabel()}
              </Text>
            </View>
            {this.renderIcon()}
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

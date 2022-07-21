import React, { Component } from "react";
import {
  Text,
  FlatList,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { isEmpty } from "../../utils/validators";

const defaultItemValue = {
  name: "",
  id: 0,
};

export default class SearchableDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: [],
      focus: false,
    };
  }

  componentDidMount = () => {
    this.setState({
      listItems: this.props.items,
    });
  };

  renderItems = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ focus: false });
          this.props.onItemSelect(item);
        }}
        style={{
          padding: 10,
          marginTop: 2,
          backgroundColor: "#ddd",
          borderColor: "#bbb",
          borderWidth: 1,
          borderRadius: 5,
          flex: 1,
          flexDirection: "row",
        }}
      >
        <View
          style={{ flex: 1, flexDirection: "row", alignItems: "flex-start" }}
        >
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderListType = () => {
    if (this.state.focus) {
      return (
        <FlatList
          data={this.state.listItems}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.props}
          renderItem={this.renderItems}
          style={{ maxHeight: 140 }}
        />
      );
    }
  };

  searchedItems = (searchedText) => {
    let setSort = this.props.setSort;
    if (!setSort && typeof setSort !== "function") {
      setSort = (item, searchedText) => {
        return item.name.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
      };
    }
    var ac = this.props.items.filter((item) => {
      return setSort(item, searchedText);
    });
    let item = {
      id: -1,
      name: searchedText,
    };
    this.setState({ listItems: ac });
    const onTextChange = this.props.onTextChange || this.props.onChangeText;
    if (onTextChange && typeof onTextChange === "function") {
      setTimeout(() => {
        onTextChange(searchedText);
      }, 0);
    }
  };

  renderTextInput = () => {
    return (
      <TextInput
        ref={(e) => (this.input = e)}
        onChangeText={(text) => {
          this.searchedItems(text);
        }}
        underlineColorAndroid={"transparent"}
        onFocus={() => {
          this.props.onFocus && this.props.onFocus();
          this.setState({
            focus: true,
            listItems: this.props.items,
          });
        }}
        onBlur={(e) => {
          if (this.props.onBlur) {
            this.props.onBlur(e);
          }
          this.setState({ focus: false });
        }}
        value={this.props.selectedValue ? this.props.selectedValue.name : ""}
        style={{
          minHeight: 40,
          borderColor: "#41E1FD",
          borderWidth: 2,
          borderRadius: 4,
          paddingLeft: 10,
        }}
        placeholder={"placeholder"}
      />
    );
  };

  render = () => {
    return (
      <View style={{ paddingTop: 5 }}>
        {this.renderTextInput()}
        {this.renderListType()}
      </View>
    );
  };
}

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

export default class SearchableDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: [],
      item: "",
      focus: false,
      searchedText: "",
    };
  }

  componentDidMount = () => {
    this.setState({
      listItems: this.props.items,
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.selectedValue !== this.props.selectedValue) {
      this.setState({ item: this.props.selectedValue });
    }
  }

  renderItems = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ focus: false, searchedText: "" });
          this.props.onItemSelect(item);
        }}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            padding: 10,
            marginTop: 2,
            backgroundColor: "#ddd",
            borderColor: "#bbb",
            borderWidth: 1,
            borderRadius: 5,
          }}
        >
          <Text>{item.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderListType = () => {
    return (
      <FlatList
        data={this.state.listItems}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.props}
        renderItem={this.renderItems}
        style={{ maxHeight: 140 }}
      />
    );
  };

  searchedItems = (searchedText) => {
    const setSort = (item, searchedText) => {
      return item.label.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
    };
    const ac = this.props.items.filter((item) => {
      return setSort(item, searchedText);
    });
    this.setState({
      listItems: ac,
      item: searchedText,
      searchedText,
    });
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
          this.setState({
            focus: true,
            listItems: this.props.items,
          });
        }}
        onBlur={(e) => {
          this.setState({ focus: false, searchedText: "" });
        }}
        value={this.state.item}
        style={{
          minHeight: 40,
          borderColor: "#41E1FD",
          borderWidth: 2,
          borderRadius: 4,
          paddingLeft: 10,
        }}
        placeholder={"-Select-"}
      />
    );
  };

  render = () => {
    return (
      <View style={{ paddingTop: 5 }}>
        {this.renderTextInput()}
        {this.state.focus && this.renderListType()}
      </View>
    );
  };
}

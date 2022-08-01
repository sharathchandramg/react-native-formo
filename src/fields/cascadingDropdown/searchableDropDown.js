import React, { Component } from "react";
import {
  Text,
  FlatList,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";

import styles from "./styles";

export default class SearchableDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: [],
      item: "",
      focus: false,
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
          this.setState({ focus: false });
          Keyboard.dismiss();
          setTimeout(() => {
            this.props.onItemSelect(item);
          }, 0);
        }}
        style={styles.itemWrapper}
      >
        <Text style={{ color: "#222" }}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  renderList = () => {
    return (
      <FlatList
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps={"always"}
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
          this.setState({ focus: false, item: this.props.selectedValue });
        }}
        value={this.state.item}
        style={styles.input}
        placeholder={"-Select-"}
      />
    );
  };

  render = () => {
    return (
      <View keyboardShouldPersist="always" style={{ paddingTop: 5 }}>
        {this.renderTextInput()}
        {this.state.focus && this.renderList()}
      </View>
    );
  };
}

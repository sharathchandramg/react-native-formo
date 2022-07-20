import React, { Component } from "react";
import {
  Text,
  FlatList,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";

const defaultItemValue = {
  name: "",
  id: 0,
};

export default class SearchableDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      listItems: [],
      focus: false,
    };
  }

  componentDidMount = () => {
    const listItems = this.props.items;
    const defaultIndex = this.props.defaultIndex;
    if (defaultIndex && listItems.length > defaultIndex) {
      this.setState({
        listItems,
        item: listItems[defaultIndex],
      });
    } else {
      this.setState({ listItems });
    }
  };

  renderItems = ({ item, index }) => {
    if (this.props.selectedItems && this.props.selectedItems.length > 0) {
      return this.props.selectedItems.find((sitem) => sitem.id === item.id) ? (
        <TouchableOpacity
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
            style={{
              flex: 0.9,
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text>{item.name}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            this.setState({ item: item, focus: false });
            setTimeout(() => {
              this.props.onItemSelect(item);
            }, 0);
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
    } else {
      return (
        <TouchableOpacity
          style={{
            padding: 10,
            marginTop: 2,
            backgroundColor: "#ddd",
            borderColor: "#bbb",
            borderWidth: 1,
            borderRadius: 5,
          }}
          onPress={() => {
            this.setState({ item: item, focus: false });
            Keyboard.dismiss();
            setTimeout(() => {
              this.props.onItemSelect(item);
              if (this.props.resetValue) {
                this.setState({ focus: true, item: defaultItemValue });
                this.input.focus();
              }
            }, 0);
          }}
        >
          {this.props.selectedItems &&
          this.props.selectedItems.length > 0 &&
          this.props.selectedItems.find((x) => x.id === item.id) ? (
            <Text style={{ color: "#222" }}>{item.name}</Text>
          ) : (
            <Text style={{ color: "#222" }}>{item.name}</Text>
          )}
        </TouchableOpacity>
      );
    }
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
    this.setState({ listItems: ac, item: item });
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
            item: defaultItemValue,
            listItems: this.props.items,
          });
        }}
        onBlur={(e) => {
          if (this.props.onBlur) {
            this.props.onBlur(e);
          }
          this.setState({ focus: false, item: this.props.selectedItems });
        }}
        value={this.state.item ? this.state.item.name : ""}
        style={{
          minHeight: 40,
          borderColor: "#41E1FD",
          borderWidth: 2,
          borderRadius: 4,
          paddingLeft: 5,
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

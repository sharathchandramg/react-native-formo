import React, { Component } from "react";
import {
  Modal,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Button, Icon, Input, Checkbox } from "native-base";
import styles from "./dropStyles";

export default class Dropdown extends React.PureComponent {
  state = {
    modalVisible: false,
    datas: [],
    dataSource: [],
    text: "",
    selected: new Map(),
  };

  componentDidMount() {
    this.setState({
      modalVisible: true,
      datas: this.props.list,
      dataSource: this.props.list,
    });
  }

  /**To close the modal */
  _toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  /**Search Items */
  _searchFilter = (text) => {
    const newData = this.state.datas.filter(function (item) {
      const itemData = item.value.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData,
      text: text,
    });
  };

  /**Seperator between items */
  _listViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: Dimensions.get("window").width,
          backgroundColor: "#000",
        }}
      ></View>
    );
  };

  /**Submit selected item and goes back to parent activity */
  _selectItems = (item) => {
    this.setState({ modalVisible: !this.state.modalVisible });
    this.props.getSingleSelectedItem(this.state.selected);
  };

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id) => {
    this.setState((state) => {
      //create a new Map object, maintain state immutability
      const selected = new Map(state.selected);
      //add the id to map
      selected.set(id, !selected.get(id)); //toggle
      for (var key of selected.keys()) {
        if (key === id) {
          //update id value
        } else {
          selected.delete(key, !selected.get(key));
        }
      }
      return { selected };
    });
  };

  _renderItem = ({ item }) => (
    <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      value={item.value}
    />
  );

  render() {
    //const ITEM_HEIGHT=this.state.dataSource.length;
    return (
      <KeyboardAvoidingView behavior="height">
        <Modal
          ref={"myModal"}
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: !this.state.modalVisible });
          }}
          onDismiss={() => {
            this.setState({ modalVisible: !this.state.modalVisible });
          }}
        >
          <View style={styles.container}>
            <View style={styles.modalView}>
              <View style={styles.header}>
                <View>
                  <Icon name="ios-search" />
                  <Input
                    placeholder="Search"
                    onChangeText={(text) => this._searchFilter(text)}
                  />
                </View>
                <Button transparent>
                  <Text>Search</Text>
                </Button>
              </View>
              {this.state.dataSource.length == 0 ? (
                <View
                  style={{
                    backgroundColor: "#fff",
                    width: "100%",
                    height: 60,
                    alignItems: "center",
                    padding: 20,
                  }}
                >
                  <Text style={{ textAlign: "center", color: "red" }}>
                    No results found
                  </Text>
                </View>
              ) : (
                <FlatList
                  style={{ backgroundColor: "#fff" }}
                  ref={"flatList"}
                  extraData={this.state}
                  data={this.state.dataSource}
                  ItemSeparatorComponent={this._listViewItemSeparator}
                  renderItem={this._renderItem}
                  keyExtractor={this._keyExtractor}
                ></FlatList>
              )}

              <TouchableOpacity onPress={this._selectItems.bind(this)}>
                <View style={styles.button}>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 14,
                      fontStyle: "normal",
                      fontWeight: "bold",
                    }}
                  >
                    SUBMIT
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? "red" : "black";
    const checked = this.props.selected ? true : false;
    const _width = Dimensions.get("window").width;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={{ width: _width * 0.8, backgroundColor: "white" }}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View style={{ flex: 0.13 }}>
              <Checkbox
                isChecked={checked}
                colorScheme={textColor}
                onPress={this._onPress}
              />
            </View>
            <View style={{ flex: 0.87 }}>
              <Text
                style={{
                  color: "#000",
                  padding: 10,
                  fontStyle: "normal",
                }}
              >
                {this.props.value}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

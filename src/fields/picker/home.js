import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import StarIcon from "../../components/starIcon";
import styles from "./homeStyle";
import Dropdown from "./Dropdown";

const list = [
  { id: "0", value: "item0" },
  { id: "1", value: "item1" },
  { id: "2", value: "item2" },
  { id: "3", value: "item3" },
  { id: "4", value: "item4" },
  { id: "5", value: "item5" },
  { id: "6", value: "item6" },
  { id: "7", value: "item7" },
  { id: "8", value: "item8" },
  { id: "9", value: "item9" },
  { id: "10", value: "item10" },
];

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: "",
    };
  }

  /**This function open the dropdown modal */
  _openDropdown = () => {
    this.refs.picker._setModalVisible(true, list);
  };

  /**Set the state variable "selectedItem" after selecting item from dropdown       */
  _getSelectedValue = (myMap) => {
    if (myMap.size != 0) {
      for (var [key, value] of myMap) {
        if (value == true) {
          this.setState({ selectedItem: list[key].value });
        } else {
          this.setState({ selectedItem: "" });
        }
      }
    }
  };

  render() {
    const label =
      this.state.selectedItem == "" ? "Select item" : this.state.selectedItem;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.picker}>
          <TouchableOpacity onPress={this._openDropdown}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 0.95 }}>
                <Text style={styles.text}> {label} </Text>
              </View>
              <View style={{ flex: 0.05 }}>
                {/* <Icon name='ios-arrow-down' style={styles.icon}/> */}
                <StarIcon required={true} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <Dropdown
          ref={"picker"}
          getSingleSelectedItem={this._getSelectedValue}
          parentFlatList={this}
        />
      </View>
    );
  }
}

import React from "react";
import {
  Modal,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { Input, SearchIcon } from "native-base";

import styles from "./styles";

export default class PickerModal extends React.PureComponent {
  state = {
    datas: [],
    dataSource: [],
    text: "",
  };

  componentDidMount() {
    this.setState({
      datas: this.props.list,
      dataSource: this.props.list,
    });
  }

  searchFilter = (text) => {
    const newData = this.state.datas.filter(function (item) {
      const itemData = item.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData,
      text: text,
    });
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.handleChange(item);
          this.props.closeModal();
        }}
      >
        <View style={styles.itemWrapper1}>
          <View style={styles.itemWrapper2}>
            <Text
              style={[
                styles.itemText,
                {
                  color: this.props.theme.pickerColorSelected,
                },
              ]}
              numberOfLines={1}
            >
              {item}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="height">
        <Modal
          animationType="fade"
          transparent={true}
          visible={true}
          onRequestClose={() => this.props.closeModal()}
          onDismiss={() => this.props.closeModal()}
          style={{ backgroundColor: "white" }}
        >
          <TouchableWithoutFeedback onPress={() => this.props.closeModal()}>
            <View style={styles.modalContainer}>
              <View
                style={[
                  styles.modalView,
                  this.state.dataSource.length !== 0 && { maxHeight: "90%" },
                ]}
              >
                {this.state.datas.length > 20 && (
                  <View style={styles.header}>
                    <View style={{ width: "100%" }}>
                      <Input
                        placeholder="Search"
                        onChangeText={(text) => this.searchFilter(text)}
                        style={styles.inputText}
                      />
                    </View>
                    <View style={styles.searchIconWrapper}>
                      <SearchIcon size={"5"} color={"rgb(0,151,235)"} />
                    </View>
                  </View>
                )}
                {this.state.dataSource.length === 0 ? (
                  <View style={styles.noResultsWrapper}>
                    <Text style={styles.noResultsText}>No results found</Text>
                  </View>
                ) : (
                  <FlatList
                    style={{ backgroundColor: "#fff" }}
                    extraData={this.state}
                    data={this.state.dataSource}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    keyboardShouldPersistTaps="always"
                  ></FlatList>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}

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
const width = Dimensions.get("window").width;

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
        <View style={{ width: width * 0.8, backgroundColor: "white" }}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Text
              style={{
                color: this.props.theme.pickerColorSelected,
                paddingHorizontal: 10,
                paddingVertical: 15,
                fontSize: 16,
              }}
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
                  <View
                    style={[
                      styles.header,
                      {
                        position: "relative",
                        padding: 15,
                        flexDirection: "row",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <View style={{ width: "100%" }}>
                      <Input
                        placeholder="Search"
                        onChangeText={(text) => this.searchFilter(text)}
                        style={{ paddingRight: 25, fontSize: 16 }}
                      />
                    </View>
                    <View style={{ position: "absolute", right: 20 }}>
                      <SearchIcon size={"5"} color={"rgb(0,151,235)"} />
                    </View>
                  </View>
                )}
                {this.state.dataSource.length === 0 ? (
                  <View
                    style={{
                      backgroundColor: "#fff",
                      width: "100%",
                      height: 60,
                      alignItems: "center",
                      padding: 20,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 16,
                      }}
                    >
                      No results found
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    style={{ backgroundColor: "#fff" }}
                    extraData={this.state}
                    data={this.state.dataSource}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
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

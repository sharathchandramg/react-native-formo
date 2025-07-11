import React, { Component } from "react";
import { FlatList, View, TouchableOpacity, Keyboard } from "react-native";

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

  componentDidMount() {
    this.setState({
      listItems: this.props.items,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedValue !== this.props.selectedValue) {
      this.setState({ item: this.props.selectedValue });
    }
  }

  renderItems = ({ item, index }) => {
    const { AppRNText } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ focus: false });
          Keyboard.dismiss();
          this.props.onItemSelect(item.label);
        }}
        style={[
          styles.itemWrapper,
          {
            borderBottomWidth:
              index === this.state.listItems.length - 1 ? 0 : 0.5,
          },
        ]}
      >
        <AppRNText size={16} style={styles.itemLabel}>
          {item.label}
        </AppRNText>
      </TouchableOpacity>
    );
  };

  renderList = () => {
    const { AppRNText } = this.props;
    return (
      <View
        style={[
          styles.listWrapper,
          this.state.listItems && this.state.listItems.length > 0
            ? {}
            : styles.listWrapperNoData,
        ]}
      >
        {this.state.listItems && this.state.listItems.length > 0 ? (
          <FlatList
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps={"always"}
            data={this.state.listItems}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.props}
            renderItem={this.renderItems}
            style={{ maxHeight: 140 }}
          />
        ) : (
          <View style={styles.itemWrapper}>
            <AppRNText size={16} style={styles.itemLabel}>
              No Data Found
            </AppRNText>
          </View>
        )}
      </View>
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
    const { AppRNTextInput } = this.props;
    return (
      <View style={styles.inputWrapper}>
        <AppRNTextInput
          size={16}
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
      </View>
    );
  };

  render = () => {
    return (
      <View keyboardShouldPersist="always">
        {this.renderTextInput()}
        {this.state.focus && this.renderList()}
      </View>
    );
  };
}

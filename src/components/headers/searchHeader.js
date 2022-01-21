import React from "react";
import { Input, View, ArrowBackIcon, SearchIcon } from "native-base";
import { TouchableOpacity } from "react-native";

import styles from "./../../fields/userDirectory/styles";
import LinearGradientHeader from './linearGradientHeader';

const SearchHeader = (props) => {
  const {
    toggleSearchModalVisible,
    handleOnSearchQuery,
    handleTextChange,
    searchText,
  } = props;

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.headerLeft}
            onPress={() => toggleSearchModalVisible()}
          >
            <ArrowBackIcon size={"6"} color={"rgb(0,151,235)"} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Input
            style={styles.searchBar}
            keyboardType={"default"}
            placeholder="Search"
            placeholderTextColor={"rgb(0,151,235)"}
            underlineColorAndroid="transparent"
            autoFocus={true}
            value={searchText}
            onChangeText={(text) => handleTextChange(text)}
            returnKeyType={"search"}
            onSubmitEditing={() => handleOnSearchQuery(searchText, false)}
          />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => handleOnSearchQuery(searchText, false)}
          >
            <SearchIcon size={"6"} color={"rgb(0,151,235)"} />
          </TouchableOpacity>
        </View>
      </View>
      <LinearGradientHeader />
    </View>
  );
};

export default SearchHeader;

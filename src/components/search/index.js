import React from "react";
import SearchHeader from "../headers/searchHeader";
import RecyclerList from "../recyclerList";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { SearchIcon } from "native-base";

import { isNull } from "../../utils/validators";
import styles from "./styles";

const SearchComponent = (props) => {
  const {
    handleOnSearchQuery,
    theme,
    searchText,
    attributes,
    onEndReached,
    toggleSelect,
    AppRNText,
  } = props;
  return (
    <View style={styles.modalContent}>
      <SearchHeader {...props} />
      <View>
        <View style={{ height: "100%", width: "100%" }}>
          {searchText.length > 0 ? (
            <View style={styles.searchForWrapper}>
              <TouchableOpacity
                onPress={() => handleOnSearchQuery(searchText, false)}
                style={styles.searchForButton}
              >
                <SearchIcon size={"6"} color={"rgb(0,151,235)"} />
                <AppRNText size={14} style={styles.searchForText}>
                  {`Search for "${searchText}"`}
                </AppRNText>
              </TouchableOpacity>
            </View>
          ) : !isNull(attributes["options"]) && attributes["options"].length ? (
            <RecyclerList
              dataProvider={attributes["options"]}
              onEndReached={onEndReached}
              attributes={attributes}
              toggleSelect={toggleSelect}
              AppRNText={AppRNText}
            />
          ) : (
            <ScrollView
              centerContent={true}
              contentContainerStyle={styles.contentContainer}
            >
              <View style={styles.noDataWrapper}>
                <AppRNText size={14} style={styles.nodataText}>
                  {"No matching result found. Pl try again"}
                </AppRNText>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
};

export default SearchComponent;

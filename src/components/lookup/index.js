import React from "react";
import {
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  RefreshControl,
  Dimensions
} from "react-native";
import { Text } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";
import _ from "lodash";
import LinearGradient from 'react-native-linear-gradient';
import ActionButton from 'react-native-action-button';

import RecyclerList from "../recyclerList";
import { isNull } from "../../utils/validators";
import LookupHeader from "../headers/lookupHeader";
import styles from "./styles";

const { width, height } = Dimensions.get("window");

const LookupComponent = (props) => {
  const {
    attributes,
    toggleSelect,
    handleReset,
    filter,
    onEndReached,
    handlePullToRefresh,
    loading,
    lookupSearchReq,
    searchText1,
    hideInlineCreation,
    onAddLookup,
    onClickInlineCreationButton,
    selectedFilter
  } = props;

  getLabel = (item) => {
    let label = "";
    let value = [];
    if (typeof item["value"] === "string") {
      let searchText = item["value"];
      label = `${item["categoryLabel"]}:${searchText}`;
    } else {
      if (typeof item["value"] === "object" && Array.isArray(item["value"])) {
        _.map(item["value"], (option) => {
          if (typeof option === "object") {
            let categoryValue = option[item["category"]];
            if (value.indexOf(categoryValue) === -1) {
              value.push(categoryValue);
            }
          } else if (typeof option === "string") {
            value.push(option);
          }
        });
      }
      label = `${item["categoryLabel"]}:${value.toString()}`;
    }
    return label;
  };

  renderFilterItem = ({ item, index }) => {
    let label = getLabel(item);
    return (
      <View style={styles.selectedContainer} key={index.toString()}>
        <TouchableOpacity
          style={styles.selectedStatusOuter}
          onPress={() => handleReset(item)}
        >
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={styles.selectedText}
          >
            {label}
          </Text>
          <TouchableOpacity
            style={styles.removeFilterIcon}
            onPress={() => handleReset(item)}
          >
            <Icon
              name={"times-circle"}
              style={{ fontSize: 14, color: "white" }}
              type="FontAwesome"
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  renderFilterSelected = (filterArr) => {
    return (
      <FlatList
        horizontal={true}
        data={filterArr}
        extraData={props}
        keyExtractor={(item, index) => `feed_${index}`}
        renderItem={renderFilterItem}
      />
    );
  };

  renderInlineCreationButton = () => {
    if (onAddLookup && typeof onAddLookup === "function") {
      return (
        <ActionButton
        buttonColor={"#fff"}
        offsetY={70}
        offsetX={20}
        renderIcon={() => (
            <LinearGradient
                colors={['rgb(0,151,235)', 'rgb(0,151,235)']}
                style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                start={{ x: 0.0, y: 1.0 }}
                end={{ x: 1.0, y: 1.0 }}
                locations={[0.0, 1]}
            >
                <Icon
                    name={ 'plus'}
                    size={16}
                    color={'#fff'}
                    light
                />
            </LinearGradient>
        )}
        onPress={() => onClickInlineCreationButton()}
    />
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.modalContent}>
      <LookupHeader {...props} />
      <View>
        <View
          style={{
            height: height * 0.95,
            width: "100%"
          }}
        >
          {selectedFilter && selectedFilter.length > 0 ? (
            <View style={styles.filterContainer}>
              {renderFilterSelected(selectedFilter)}
            </View>
          ) : null}
          {!isNull(attributes["options"]) && attributes["options"].length ? (
            <RecyclerList
              dataProvider={attributes["options"]}
              onEndReached={onEndReached}
              attributes={attributes}
              toggleSelect={toggleSelect}
              handlePullToRefresh={handlePullToRefresh}
              loading={loading}
            />
          ) : (
            <ScrollView
              contentContainerStyle={{
                height: "100%",
                width: "100%",
              }}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={handlePullToRefresh}
                  colors={["#fad217", "#6AD97B"]}
                  tintColor={"#008080"}
                />
              }
            >
              <View style={styles.noDataWrapper}>
                <Text style={styles.nodataText}>
                  {lookupSearchReq
                    ? `Searching the data for ${searchText1}`
                    : "No matching result found. Pl try again"}
                </Text>
              </View>
            </ScrollView>
          )}
          {hideInlineCreation ? null : renderInlineCreationButton()}
        </View>
      </View>
    </View>
  );
};

export default LookupComponent;

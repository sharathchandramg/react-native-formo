import React, { Component } from "react";
import {
  RecyclerListView,
  LayoutProvider,
  DataProvider,
} from "recyclerlistview";
import { Dimensions, View, RefreshControl } from "react-native";

import { isNull } from "../../utils/validators";
import Item from "../lookupItem";

const { width, height } = Dimensions.get("window");

export default class RecyclerList extends Component {
  constructor(props) {
    super(props);
    this.dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });
    this._layoutProvider = new LayoutProvider(
      () => {
        return true;
      },
      (type, dim) => {
        dim.width = width;
        dim.height = 55;
      }
    );

    this._rowRenderer = this._rowRenderer.bind(this);
  }

  _rowRenderer(type, item) {
    const { AppRNText } = this.props;
    if (!isNull(item) && !isNull(this.props.attributes)) {
      let isSelected = false;
      if (this.props.attributes.multiple) {
        isSelected = this.props.attributes.objectType
          ? this.props.attributes.value.findIndex(
              (option) =>
                option[this.props.attributes.primaryKey] ===
                item[this.props.attributes.primaryKey]
            ) !== -1
          : this.props.attributes.value.indexOf(item) !== -1;
      }
      return (
        <Item
          toggleSelect={this.props.toggleSelect}
          attributes={this.props.attributes}
          isSelected={isSelected}
          item={item}
          AppRNText={AppRNText}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <View
        style={{
          height: height * 0.95,
          width: width,
        }}
      >
        <RecyclerListView
          layoutProvider={this._layoutProvider}
          dataProvider={this.dataProvider.cloneWithRows(
            this.props.dataProvider
          )}
          rowRenderer={this._rowRenderer}
          canChangeSize={true}
          onEndReached={this.props.onEndReached}
          onEndReachedThreshold={parseInt(height / 4)}
          style={{
            margin: 15,
            marginBottom: 0,
          }}
          refreshControl={
            <RefreshControl
              colors={["#fad217", "#6AD97B"]}
              tintColor={"#008080"}
              refreshing={
                typeof this.props.loading !== "undefined"
                  ? this.props.loading
                  : false
              }
              onRefresh={() => {
                typeof this.props.handlePullToRefresh === "function" &&
                  this.props.handlePullToRefresh();
              }}
            />
          }
        />
      </View>
    );
  }
}

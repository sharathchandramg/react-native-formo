import React from 'react';
import { FlatList } from 'react-native';
import { isEmpty } from '../../utils/validators';
import _ from 'lodash';
import FilterHeader from '../headers/filterHeader';

import {
    View,
    Text,
    Checkbox,
    Button,
    Input,
    SearchIcon
} from 'native-base';
import { TouchableOpacity } from "react-native";

import styles from './styles';

const FilterComponent = props => {
    const {
        attributes,
        filterFunction,
        handleTextChange,
        searchText,
        applyFilterFunction,
        resetFilter,
        setFilterCategory,
        activeCategory,
        filterData,
    } = props;

    renderCategoryDataItem = ({ item, index }) => {
        if (!isEmpty(item) && !isEmpty(activeCategory)) {
            return (
                <TouchableOpacity
                    style={{
                        height: 50,
                        width: '98%',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        flexDirection:'row',
                        borderBottomColor: "#D9D5DC",
                        borderBottomWidth: 0.5,
                        paddingLeft: 10
                    }}
                    key={index}
                    onPress={() => filterFunction(item)}
                >
                    <Checkbox
                        onPress={() => filterFunction(item)}
                        isChecked={item.selected}
                        colorScheme={'rgb(0,151,235)'}
                    />
                        <Text
                            style={[
                                styles.filterText,
                                {
                                    fontSize: 12,
                                    paddingEnd: 5,
                                },
                            ]}
                        >
                            {attributes.objectType ? item['label'] : item}
                        </Text>
                </TouchableOpacity>
            );
        }
    };

    renderCategoryData = () => {
        return (
            <FlatList
                data={filterData}
                extraData={props}
                keyExtractor={(item, index) => index.toString()}
                listKey={(item, index) => 'D' + index.toString()}
                renderItem={renderCategoryDataItem}
                style={{ width: '100%' }}
            />
        );
    };

    renderCategoryItem = ({ item, index }) => {
        if (!isEmpty(item) && !isEmpty(activeCategory)) {
            return (
                <TouchableOpacity
                    style={[
                        styles.filterCategoryItem,
                        {
                            backgroundColor:
                                item['name'] == activeCategory['name']
                                    ? 'white'
                                    : '#F2F2F2',
                        },
                    ]}
                    key={index}
                    onPress={() => setFilterCategory(item)}
                >
                    <View
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            alignItem: 'center',
                        }}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                {
                                    fontSize: 14,
                                    paddingEnd: 5,
                                    paddingLeft: 10,
                                    alignSelf:'flex-start'
                                },
                            ]}
                        >
                            {item['label']}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    renderCategory = () => {
        return (
            <FlatList
                data={attributes['filterCategory']}
                extraData={props}
                keyExtractor={(item, index) => index.toString()}
                listKey={(item, index) => 'D' + index.toString()}
                renderItem={renderCategoryItem}
                style={{ width: '100%' }}
            />
        );
    };

    renderfilterBottom = () => {
        return (
            <View style={styles.filterFooter}>
                <Button
                    style={[styles.filterFooterLeft]}
                    onPress={() => resetFilter()}
                >
                    <Text style={[styles.filterText, { fontSize: 14 }]}>
                        CLEAR
                    </Text>
                </Button>
                <Button
                    style={[styles.filterFooterRight, { width: '50%' }]}
                    onPress={() => applyFilterFunction()}
                >
                    <Text style={[styles.filterText, { color: '#F36' }]}>
                        APPLY
                    </Text>
                </Button>
            </View>
        );
    };

    renderFilterBody = () => {
        return (
          <View style={styles.filterBody}>
            <View style={styles.filterBodyBottom}>
              <View style={styles.filterBodyBottomLeft}>
                {renderCategory()}
              </View>
              <View style={styles.filterBodyBottomRight}>
                <View style={[styles.searchContainer,{width:'98%'}]}>
                  <SearchIcon size={"4"} color={"grey"} />
                  <View style={styles.inputWrapper}>
                    <Input
                      style={[
                        styles.inputText,
                        {
                          borderTopWidth: 0,
                          borderLeftWidth: 0,
                          borderRightWidth: 0,
                          borderBottomWidth: 0,
                        },
                      ]}
                      placeholder={"Search"}
                      value={searchText}
                      onChangeText={(text) => handleTextChange(text)}
                    />
                  </View>
                </View>
                {filterData && filterData.length > 0
                  ? renderCategoryData()
                  : null}
              </View>
            </View>
          </View>
        );
    };

    return (
      <View style={styles.modalContent}>
        <FilterHeader {...props} />
        <View style={{ flex: 1 }}>
          <View style={styles.filterContainer}>{renderFilterBody()}</View>
        </View>
        <View style={styles.footerWrapper}>{renderfilterBottom()}</View>
      </View>
    );
};

export default FilterComponent;

import React from 'react';
import {
    TouchableOpacity,
    View,
    FlatList,
    ScrollView,
    RefreshControl,
} from 'react-native';
import RecyclerList from '../recyclerList';
import { Text, Container, Content, Icon } from 'native-base';
import styles from './styles';
import _ from 'lodash';
import { isNull } from '../../utils/validators';
import LookupHeader from '../headers/lookupHeader';

const LookupComponent = props => {
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
    } = props;

    getLabel = item => {
        let label = '';
        let value = [];
        if (typeof item['value'] === 'string') {
            let searchText = item['value'];
            label = `${item['categoryLabel']}:${searchText}`;
        } else {
            if (
                typeof item['value'] === 'object' &&
                Array.isArray(item['value'])
            ) {
                _.map(item['value'], option => {
                    if (typeof option === 'object') {
                        let categoryValue = option[item['category']];
                        if (value.indexOf(categoryValue) === -1) {
                            value.push(categoryValue);
                        }
                    } else if (typeof option === 'string') {
                        value.push(option);
                    }
                });
            }
            label = `${item['categoryLabel']}:${value.toString()}`;
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
                            name={'times-circle'}
                            style={{ fontSize: 14, color: 'white' }}
                            type="FontAwesome"
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        );
    };

    renderFilterSelected = filterArr => {
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

    return (
        <Container style={{ flex: 1 }}>
            <LookupHeader {...props} />
            <Content>
                <View
                    style={{
                        height: '100%',
                        width: '100%',
                    }}
                >
                    {filter && filter.length > 0 ? (
                        <View style={styles.filterContainer}>
                            {renderFilterSelected(filter)}
                        </View>
                    ) : null}
                    {!isNull(attributes['options']) &&
                    attributes['options'].length ? (
                        <RecyclerList
                            dataProvider={attributes['options']}
                            onEndReached={onEndReached}
                            attributes={attributes}
                            toggleSelect={toggleSelect}
                            handlePullToRefresh={handlePullToRefresh}
                            loading={loading}
                        />
                    ) : (
                        <ScrollView
                            contentContainerStyle={{
                                height: '100%',
                                width: '100%',
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={handlePullToRefresh}
                                    colors={['#fad217', '#6AD97B']}
                                    tintColor={'#008080'}
                                />
                            }
                        >
                            <View style={styles.noDataWrapper}>
                                <Text style={styles.nodataText}>
                                    {lookupSearchReq ? `Searching the data for ${searchText1}` : 'No matching result found. Pl try again'}
                                </Text>
                            </View>
                        </ScrollView>
                    )}
                </View>
            </Content>
        </Container>
    );
};

export default LookupComponent;

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, TouchableOpacity, View, FlatList } from 'react-native';
import RecyclerList from '../recyclerList';

import {
    Text,
    Container,
    Header,
    Content,
    Left,
    Right,
    Icon,
    Body,
    Button,
    Title,
} from 'native-base';

import styles from './styles';
const _ = require('lodash');
import { isNull } from '../../utils/validators';

const LookupComponent = props => {
    let {
        attributes,
        theme,
        modalVisible,
        toggleSelect,
        toggleModalVisible,
        toggleSearchModalVisible,
        toggleFilterModalVisible,
        searchEnable,
        filterEnable,
        handleReset,
        filter,
        onEndReached,
    } = props;

    getLabel = item => {
        let label = '';
        let value = [];
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
        label = `${item['categoryLabel']}:${value.toString()}`;
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
        <Modal
            visible={modalVisible}
            animationType="none"
            onRequestClose={() => toggleModalVisible()}
        >
            <Container style={{ flex: 1 }}>
                <Header style={[theme.header]} androidStatusBarColor="#c8c8c8">
                    <Left>
                        <Button
                            transparent
                            onPress={() => toggleModalVisible()}
                        >
                            <Icon
                                name="arrow-back"
                                style={{ color: '#48BBEC' }}
                            />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={theme.headerText}>
                            {attributes.label || 'Select'}
                        </Title>
                    </Body>
                    <Right>
                        {searchEnable ? (
                            <Button
                                transparent
                                onPress={() => toggleSearchModalVisible()}
                            >
                                <Icon
                                    name="search"
                                    style={{ color: '#48BBEC', fontSize: 18 }}
                                    type="FontAwesome"
                                />
                            </Button>
                        ) : null}
                        {filterEnable ? (
                            <Button
                                transparent
                                onPress={() => toggleFilterModalVisible()}
                            >
                                <Icon
                                    name="filter"
                                    style={{ color: '#48BBEC', fontSize: 18 }}
                                    type="FontAwesome"
                                />
                            </Button>
                        ) : null}
                    </Right>
                </Header>
                <Content>
                    {filter && filter.length > 0 ? (
                        <View style={styles.filterContainer}>
                            {renderFilterSelected(filter)}
                        </View>
                    ) : null}

                    <View style={{ flex: 1 }}>
                        {!isNull(attributes['options']) && attributes['options'].length && (
                            <RecyclerList
                                dataProvider={attributes['options']}
                                onEndReached={onEndReached}
                                attributes={attributes}
                                toggleSelect={toggleSelect}
                            />
                        )}
                    </View>
                </Content>
            </Container>
        </Modal>
    );
};

export default LookupComponent;

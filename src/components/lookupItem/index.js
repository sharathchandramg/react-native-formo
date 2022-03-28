import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CheckBox } from 'native-base';
import styles from './styles';

const Item = props => {
    renderIcon = () => {
        return (
            <View style={{ width: 50, paddingHorizontal: 5 }}>
                <CheckBox
                    onPress={() => props.toggleSelect(props.item)}
                    checked={props.isSelected}
                    accessibilityLabel={props.attributes.objectType
                        ? props.item[props.attributes.labelKey]
                        : props.item}
                />
            </View>
        );
    };
    renderTitle = () => {
        return (
            <View style={styles.labelContainer}>
                <Text style={styles.labelText}>
                    {props.attributes.objectType
                        ? props.item[props.attributes.labelKey]
                        : props.item}
                </Text>
            </View>
        );
    };

    return (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => props.toggleSelect(props.item)}
        >
            {props.attributes.multiple && renderIcon()}
            {renderTitle()}
        </TouchableOpacity>
    );
};

export default Item;

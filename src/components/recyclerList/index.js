import React, { Component } from 'react';
import {
    RecyclerListView,
    LayoutProvider,
    DataProvider,
} from 'recyclerlistview';
import { Text, ListItem, CheckBox, Body, View } from 'native-base';
import { Dimensions } from 'react-native';
import { isNull } from '../../utils/validators';
import styles from './styles';

export default class RecyclerList extends Component {
    constructor(props) {
        super(props);
        let { width } = Dimensions.get('window');
        this.dataProvider = new DataProvider((r1, r2) => {
            return r1 !== r2;
        });
        this._layoutProvider = new LayoutProvider(
            () => {
                return true;
            },
            (type, dim) => {
                dim.width = width;
                dim.height = 35;
            }
        );

        this._rowRenderer = this._rowRenderer.bind(this);
    }

    _rowRenderer(type, item) {
        if (!isNull(item) && !isNull(this.props.attributes)) {
            let isSelected = false;
            if (this.props.attributes.multiple) {
                isSelected = this.props.attributes.objectType
                    ? this.props.attributes.value.findIndex(
                        option =>
                            option[this.props.attributes.primaryKey] ===
                            item[this.props.attributes.primaryKey]
                    ) !== -1
                    : this.props.attributes.value.indexOf(item) !== -1;
            }
            return (
                <ListItem
                    key={
                        this.props.attributes.objectType &&
                        item[this.props.attributes.labelKey]
                    }
                    onPress={() => this.props.toggleSelect(item)}
                    style={styles.labelContainer}
                >
                    {this.props.attributes.multiple && (
                        <CheckBox
                            onPress={() => this.props.toggleSelect(item)}
                            checked={isSelected}
                        />
                    )}
                    <Body>
                        <Text style={{ paddingHorizontal: 5 }}>
                            {this.props.attributes.objectType
                                ? item[this.props.attributes.labelKey]
                                : item}
                        </Text>
                    </Body>
                </ListItem>
            );
        }
        return null;
    }

    render() {
        return (
            <View style={{ minHeight:30, width: '100%', marginVertical: 10 }}>
                <RecyclerListView
                    layoutProvider={this._layoutProvider}
                    dataProvider={this.dataProvider.cloneWithRows(
                        this.props.dataProvider
                    )}
                    rowRenderer={this._rowRenderer}
                    canChangeSize={true}
                    onEndReached={this.props.onEndReached}
                    onEndReachedThreshold={0.1}
                />
            </View>
        );
    }
}

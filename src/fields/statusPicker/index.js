import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    Platform,
    Picker,
    TouchableOpacity,
    TouchableHighlight,
    Modal,
} from 'react-native';
import styles from './../../styles';

import { View, Text } from 'native-base';

const Item = Picker.Item;

export default class StatusPickerField extends Component {
    static propTypes = {
        attributes: PropTypes.object,
        theme: PropTypes.object,
        updateValue: PropTypes.func,
        ErrorComponent: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            value: null,
        };
    }

    handleChange(value) {
        this.setState({ value: value });
        this.props.updateValue(this.props.attributes.name, value);
    }

    setModalVisible = visible => {
        this.setState({ modalVisible: visible });
    };

    renderModal = () => {
        const { theme, attributes } = this.props;
        const pickerValue = attributes.options
            .indexOf(attributes.value)
            .toString();
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.setModalVisible(false)}
                style={{ backgroundColor: '#00000052' }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        backgroundColor: '#00000052',
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPressOut={() => this.setModalVisible(false)}
                        style={{
                            height: '100%',
                            width: '100%',
                            flexDirection: 'column-reverse',
                            alignItems: 'flex-end',
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#fff',
                                width: '100%',
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableHighlight
                                    onPress={() => this.setModalVisible(false)}
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        marginTop: 10,
                                        marginRight: 20,
                                    }}
                                >
                                    <View>
                                        <Text style={{ fontSize: 20 }}>
                                            {' '}
                                            Done
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <Picker
                                style={{ padding: 2 }}
                                textStyle={{ color: theme.pickerColorSelected }}
                                mode={attributes.mode}
                                selectedValue={pickerValue}
                                onValueChange={value =>
                                    this.handleChange(value)
                                }
                            >
                                {attributes.options.map((item, index) => (
                                    <Item
                                        key={index}
                                        label={item}
                                        value={item}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    };

    renderIOSPicker = isValueValid => {
        const { theme, attributes } = this.props;
        return (
            <View style={Object.assign(styles.pickerMainIOS)}>
                <TouchableOpacity
                    onPress={() => this.setModalVisible(true)}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 10,
                    }}
                >
                    <Text
                        style={{
                            color: theme.inputColorPlaceholder,
                            paddingStart: 5,
                        }}
                    >
                        {attributes.label}
                    </Text>
                    <Text style={{ color: theme.inputColorPlaceholder }}>
                        {isValueValid ? attributes.value : 'None'}
                    </Text>
                </TouchableOpacity>
                {this.renderModal()}
            </View>
        );
    };

    renderAndroidPicker = pickerValue => {
        const { theme, attributes } = this.props;
        return (
            <View
                style={{
                    ...styles.pickerMainAndroid,
                    ...{
                        backgroundColor: theme.pickerBgColor,
                        borderBottomColor: theme.inputBorderColor,
                        borderBottomWidth: theme.borderWidth,
                    },
                }}
            >
                <View style={{ flex: 5 }}>
                    <Text
                        style={{
                            color: theme.inputColorPlaceholder,
                            paddingStart: 5,
                        }}
                    >
                        {attributes.label}
                    </Text>
                </View>
                <View style={{ flex: 5 }}>
                    <Picker
                        style={{ padding: 2 }}
                        textStyle={{ color: theme.pickerColorSelected }}
                        iosHeader="Select one"
                        mode={attributes.mode}
                        selectedValue={pickerValue}
                        onValueChange={value => this.handleChange(value)}
                    >
                        {attributes.options.map((item, index) => (
                            <Item key={index} label={item} value={item} />
                        ))}
                    </Picker>
                </View>
            </View>
        );
    };

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        const isValueValid = attributes.options.indexOf(attributes.value) > -1;
        const pickerValue =
            this.state.value !== null
                ? this.state.value
                : typeof attributes.value !== 'undefined' &&
                  attributes.value !== null
                ? attributes.value
                : '';

        return (
            <View>
                {Platform.OS !== 'ios'
                    ? this.renderAndroidPicker(pickerValue)
                    : this.renderIOSPicker(isValueValid)}
                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}

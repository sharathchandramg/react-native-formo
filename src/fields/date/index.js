import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    Platform,
    DatePickerIOS,
    DatePickerAndroid,
    TouchableOpacity,
    TimePickerAndroid,
    Modal,
    TouchableHighlight,
} from 'react-native';
import { View, Text, Item,ListItem, Icon } from 'native-base';
import StarIcon from "../../components/starIcon";
const moment = require('moment');

export default class DateField extends Component {
    static propTypes = {
        attributes: PropTypes.object,
        updateValue: PropTypes.func,
        timeZoneOffsetInHours: PropTypes.number,
        theme: PropTypes.object,
        ErrorComponent: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.onDateChange = this.onDateChange.bind(this);
        this.showTimePicker = this.showTimePicker.bind(this);
        this.showDatePicker = this.showDatePicker.bind(this);
        this.showDateTimePicker = this.showDateTimePicker.bind(this);

        this.state = {
            modalVisible: false,
        };
    }

    onDateChange(date) {
        const epoch = moment(date).utc().valueOf();
        this.props.updateValue(this.props.attributes.name,  epoch);
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    dateFormatter = date => {
        switch (date) {
            case 'today':
                return new Date();
            case 'tomorrow':
                return new Date(moment().add(1, 'days'));
            case 'yesterday':
                return new Date(moment().subtract(1, 'days'));
            default:
                if (!isNaN(date)) {
                    return new Date(parseInt(date) * 1000);
                } else {
                    return new Date();
                }
        }
    };

    showDateTimePicker = async stateKey => {
        const { attributes } = this.props;
        const currentDate = attributes.value
            ? new Date(attributes.value)
            : new Date();
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: currentDate,
                minDate:
                    attributes.minDate &&
                    this.dateFormatter(attributes.minDate),
                maxDate:
                    attributes.maxDate &&
                    this.dateFormatter(attributes.maxDate),
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                const date = new Date(year, month, day);
                try {
                    const {
                        action,
                        minute,
                        hour,
                    } = await TimePickerAndroid.open({
                        hour: currentDate.getHours(),
                        minute: currentDate.getMinutes(),
                    });
                    if (action === TimePickerAndroid.timeSetAction) {
                        date.setHours(hour);
                        date.setMinutes(minute);
                        this.onDateChange(date);
                    } else {
                        const currentHour = currentDate.getHours();
                        const currentMinutes = currentDate.getMinutes();
                        date.setHours(currentHour);
                        date.setMinutes(currentMinutes);
                        this.onDateChange(date);
                    }
                } catch ({ code, message }) {
                    console.warn(`Error in example '${stateKey}': `, message);
                }
            }
        } catch ({ code, message }) {
            console.warn(`Error in example '${stateKey}': `, message);
        }
    };

    showTimePicker = async stateKey => {
        const { attributes } = this.props;
        const currentDate = attributes.value
            ? new Date(attributes.value)
            : new Date();
        try {
            const { action, minute, hour } = await TimePickerAndroid.open({
                hour: currentDate.getHours(),
                minute: currentDate.getMinutes(),
            });
            if (action === TimePickerAndroid.timeSetAction) {
                const date = currentDate;
                date.setHours(hour);
                date.setMinutes(minute);
                this.onDateChange(date);
            }
        } catch ({ code, message }) {
            console.warn(`Error in example '${stateKey}': `, message);
        }
    };

    showDatePicker = async stateKey => {
        const { attributes } = this.props;
        const currentDate = attributes.value
            ? new Date(attributes.value)
            : new Date();
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: currentDate,
                minDate:
                    attributes.minDate &&
                    this.dateFormatter(attributes.minDate),
                maxDate:
                    attributes.maxDate &&
                    this.dateFormatter(attributes.maxDate),
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                const currentHour = currentDate.getHours();
                const currentMinutes = currentDate.getMinutes();
                const date = new Date(year, month, day);
                if (currentHour) {
                    date.setHours(currentHour);
                }
                if (currentMinutes) {
                    date.setMinutes(currentMinutes);
                }
                this.onDateChange(date);
            }
        } catch ({ code, message }) {
            console.warn(`Error in example '${stateKey}': `, message);
        }
    };

    renderIOSDatePicker = () => {
        const { theme, attributes, ErrorComponent } = this.props;
        const value = (attributes.value && moment(attributes.value)) || null;
        let dateValue = 'Select';
        switch (attributes.mode) {
            case 'datetime':
                dateValue = value && moment(value).format('Do MMM YYYY HH:mm');
                break;
            case 'date':
                dateValue = value && moment(value).format('Do MMM YYYY');
                break;
            case 'time':
                dateValue = value && moment(value).format('hh:mm a');
                break;
            default:
                dateValue = value && moment(value).format('Do MMM YYYY HH:mm');
                break;
        }

        return (
            <View style={{flexDirection: 'row', flex:2}} >
                <Item error={theme.changeTextInputColorOnError ? attributes.error : null} style={{paddingVertical:10}}>
                    {attributes['required'] && <StarIcon required={attributes['required']} />}
                    <Text
                        style={{
                            flex: 1,
                            color:theme.labelActiveColor,
                            paddingStart: 5,
                        }}
                        onPress={() => this.setModalVisible(true)}
                    >
                        {attributes.label}
                    </Text>
                    <TouchableOpacity
                        hitSlop={{ top: 10, bottom: 10, right: 50, left: 50 }}
                        style={{
                            marginHorizontal: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}
                        onPress={() => this.setModalVisible(true)}
                    >
                        <Text>{dateValue}</Text>
                        <Icon
                            name="ios-arrow-forward"
                            style={{
                                fontSize: 18,
                                paddingStart: 10,
                                color: theme.inputColorPlaceholder,
                            }}
                        />
                    </TouchableOpacity>
                </Item>
            </View>
        );
    };

    renderAndroidDatePicker = () => {
        const { theme, attributes } = this.props;
        let handleOnPress = '';
        const value = (attributes.value && moment(attributes.value)) || null;
        let dateValue = 'Select';

        switch (attributes.mode) {
            case 'datetime':
                dateValue = value && moment(value).format('Do MMM YYYY HH:mm');
                handleOnPress = this.showDateTimePicker;
                break;
            case 'date':
                dateValue = value && moment(value).format('Do MMM YYYY');
                handleOnPress = this.showDatePicker;
                break;
            case 'time':
                dateValue = value && moment(value).format('hh:mm a');
                handleOnPress = this.showTimePicker;
                break;
            default:
                dateValue = value && moment(value).format('Do MMM YYYY HH:mm');
                handleOnPress = this.showDateTimePicker;
                break;
        }

        return (
            <View style={{flexDirection: 'row', flex:2}} >
                <Item error={theme.changeTextInputColorOnError ? attributes.error : null} style={{paddingVertical:10}}>
                    {attributes['required'] && <StarIcon required={attributes['required']} />}
                    <Text
                        style={{
                            flex: 1,
                            color: theme.inputColorPlaceholder,
                            paddingStart: 5,
                        }}
                        onPress={() => handleOnPress()}
                    >
                        {attributes.label}
                    </Text>
                    <TouchableOpacity
                            hitSlop={{ top: 10, bottom: 10, right: 50, left: 50 }}
                            style={{
                                marginHorizontal: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}
                        onPress={() => handleOnPress()}
                    >
                        <Text>{dateValue}</Text>
                        <Icon
                            name="ios-arrow-forward"
                            style={{
                                fontSize: 18,
                                paddingStart: 10,
                                color: theme.inputColorPlaceholder,
                            }}
                        />
                    </TouchableOpacity>
                </Item>
            </View>
        );
    };

    renderModal = () => {
        const { attributes } = this.props;
        const value =
            (attributes.value && new Date(attributes.value)) || new Date();
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
                            style={{ backgroundColor: '#828282', width: '100%' }}
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
                                        <Text style={{ fontSize: 20,color:'rgb(0,151,235)' }}>
                                            {'Done'}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <DatePickerIOS
                                date={value}
                                mode={attributes.mode}
                                maximumDate={
                                    attributes.maxDate &&
                                    this.dateFormatter(attributes.maxDate)
                                }
                                minimumDate={
                                    attributes.minDate &&
                                    this.dateFormatter(attributes.minDate)
                                }
                                timeZoneOffsetInMinutes={
                                    this.props.timeZoneOffsetInMinutes * 60 ||
                                    new Date().getTimezoneOffset() * 60
                                }
                                onDateChange={this.onDateChange}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    };

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        return (
            <View>
                <ListItem
                        style={{
                            borderBottomWidth: 0,
                            paddingVertical: 5,
                            marginLeft: 20,
                        }}
                    >
                    {Platform.OS === 'ios'
                        ? this.renderIOSDatePicker()
                        : this.renderAndroidDatePicker()}
                    {this.renderModal()}
                </ListItem>
                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}

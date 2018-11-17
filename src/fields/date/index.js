import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, DatePickerIOS, DatePickerAndroid, TouchableOpacity, TimePickerAndroid } from "react-native";

import { View, Text, Item } from "native-base";

const moment = require("moment");

import { getKeyboardType } from "./../../utils/helper";
import Panel from "../../components/panel";

export default class DateField extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        updateValue: PropTypes.func,
        timeZoneOffsetInHours: PropTypes.number,
        theme: PropTypes.object,
        ErrorComponent: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.onDateChange = this.onDateChange.bind(this);
        this.showTimePicker = this.showTimePicker.bind(this);
        this.showDatePicker = this.showDatePicker.bind(this);
    }

    onDateChange(date) {
        this.props.updateValue(this.props.attributes.name, date);
    }

    showTimePicker = async (stateKey) => {
        const { attributes } = this.props;
        const currentDate = attributes.value ? new Date(attributes.value) : new Date();
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

    showDatePicker = async (stateKey) => {
        const { attributes } = this.props;
        const currentDate = attributes.value ? new Date(attributes.value) : new Date();
        try {
            const { action, year, month, day } = await DatePickerAndroid.open(
                {
                    date: currentDate,
                    minDate: attributes.minDate && new Date(attributes.minDate),
                    maxDate: attributes.maxDate && new Date(attributes.maxDate),
                }
            );
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

    showAndroidDateOnlyPicker = () => {

        const { theme, attributes } = this.props;
        const value = (attributes.value && new Date(attributes.value)) || null;

        return (
            <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, right: 50, left: 50 }}
                style={{
                    marginHorizontal: 5,
                }}>
                <Text onPress={this.showDatePicker}>
                    {(value && moment(value, "Do MMM YYYY").format("Do MMM YYYY")) || "None"}
                </Text>                
            </TouchableOpacity>
        )
    }

    showAndroidTimeOnlyPicker = () => {

        const { attributes } = this.props;
        const value = (attributes.value && new Date(attributes.value)) || null;

        return (
            <TouchableOpacity
                style={{
                    marginHorizontal: 5,
                }}>
                <Text onPress={this.showTimePicker}>
                    {(value && moment(value, 'hh:mm a').format("hh:mm a")) || "None"}
                </Text>
            </TouchableOpacity>
        );
    }

    showIOSDateOnlyPicker = () => {

        const { attributes } = this.props;
        const value = (attributes.value && new Date(attributes.value)) || null;

        return (
            <View
                style={{
                    marginHorizontal: 5,
                }}>
                <Text>
                    {(value && moment(value, "Do MMM YYYY").format("Do MMM YYYY")) || "None"}
                </Text>
            </View>
        );
    }

    showIOSTimeOnlyPicker = () => {

        const { attributes } = this.props;
        const value = (attributes.value && new Date(attributes.value)) || null;

        return (
            <View
                style={{
                    marginHorizontal: 5,
                }}>
                <Text>
                    {(value && moment(value, 'hh:mm a').format("hh:mm a")) || "None"}
                </Text>
            </View>
        );
    }

    renderIOSDatePicker = () => {

        const { theme, attributes } = this.props;
        return (
            <View
                style={{
                    backgroundColor: theme.pickerBgColor,
                    borderBottomColor: theme.inputBorderColor,
                    borderBottomWidth: theme.borderWidth,
                    marginHorizontal: 10,
                    marginVertical: 0,
                    marginLeft: 15,
                }}>
                <TouchableOpacity
                    onPress={() => this.panel.toggle()}
                    style={{
                        paddingVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>

                    <Text style={{ color: theme.labelActiveColor }}>{attributes.label}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}>
                    </View>
                    {(attributes.mode === "date") ? this.showIOSDateOnlyPicker() : this.showIOSTimeOnlyPicker()}

                    <ErrorComponent {...{ attributes, theme }} />
                    <Panel
                        ref={(c) => { this.panel = c; }}>
                        <DatePickerIOS
                            date={value || new Date()}
                            mode={mode}
                            maximumDate={attributes.maxDate && new Date(attributes.maxDate)}
                            minimumDate={attributes.minDate && new Date(attributes.minDate)}
                            timeZoneOffsetInMinutes={this.props.timeZoneOffsetInHours * 60}
                            onDateChange={this.onDateChange}
                        />
                    </Panel>
                </TouchableOpacity>
            </View>
        );
    }

    renderAndroidDatePicker = () => {
        const { theme, attributes } = this.props;

        return (
            <TouchableOpacity
                style={{
                    backgroundColor: theme.pickerBgColor,
                    borderBottomColor: theme.inputBorderColor,
                    borderBottomWidth: theme.borderWidth,
                    marginHorizontal: 15,
                    marginVertical: 0,
                    paddingVertical: 15,
                    marginLeft: 23,                    
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>

                <Text style={{ color: theme.inputColorPlaceholder }}>{attributes.label}</Text>
                <View
                    style={{
                        flexDirection: 'row',
                    }}>

                    {(attributes.mode === "date") ? this.showAndroidDateOnlyPicker() : this.showAndroidTimeOnlyPicker()}
                </View>
                
            </TouchableOpacity>
            
        );
    }

    render() {
        return (
            <View>
                {(Platform.OS === 'ios') ? this.renderIOSDatePicker() : this.renderAndroidDatePicker(this.props)}
            </View>
        );
    }

}
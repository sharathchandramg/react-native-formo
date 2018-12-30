import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, DatePickerIOS, DatePickerAndroid, TouchableOpacity, TimePickerAndroid, Modal, TouchableHighlight } from "react-native";

import { View, Text, Item,Icon, } from "native-base";

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

        this.state = {
            modalVisible: false
        }
    }

    onDateChange(date) {
        this.props.updateValue(this.props.attributes.name, date);
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    showDateTimePicker = async (stateKey) => {
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
                const date = new Date(year, month, day);
                try {
                    const { action, minute, hour } = await TimePickerAndroid.open({
                        hour: currentDate.getHours(),
                        minute: currentDate.getMinutes(),
                    });
                    if (action === TimePickerAndroid.timeSetAction) {
                        date.setHours(hour);
                        date.setMinutes(minute);
                        this.onDateChange(date);
                    }else{
                        const currentHour = currentDate.getHours();
                        const currentMinutes = currentDate.getMinutes();
                        date.setHours(currentHour);
                        date.setMinutes(currentMinutes);
                        this.onDateChange(date);
                    }
                }catch ({ code, message }) {
                    console.warn(`Error in example '${stateKey}': `, message);
                }
            }
        } catch ({ code, message }) {
            console.warn(`Error in example '${stateKey}': `, message);
        }


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


    showAndroidDateTimePicker = ()=>{
        const { theme, attributes } = this.props;
        const value = (attributes.value && new Date(attributes.value)) || null;

        return (
            <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, right: 50, left: 50 }}
                style={{
                    marginHorizontal: 5,
                    justifyContent:'center',
                    alignItems:'center',
                    flexDirection:'row',
                }}>
                <Text onPress={this.showDateTimePicker}>
                    {(value && moment(value, "Do MMM YYYY HH:mm").format("Do MMM YYYY HH:mm")) || "None"}
                </Text>
                <Icon name="ios-arrow-forward" style={{fontSize:18,paddingStart:10,color:theme.inputColorPlaceholder}}/>
            </TouchableOpacity>
        )
    }

    showAndroidDateOnlyPicker = () => {

        const { theme, attributes } = this.props;
        const value = (attributes.value && new Date(attributes.value)) || null;

        return (
            <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, right: 50, left: 50 }}
                style={{
                    marginHorizontal: 5,
                    justifyContent:'center',
                    alignItems:'center',
                    flexDirection:'row'
                }}>
                <Text onPress={this.showDatePicker}>
                    {(value && moment(value, "Do MMM YYYY").format("Do MMM YYYY")) || "None"}
                </Text>
                <Icon name="ios-arrow-forward" style={{fontSize:18,paddingStart:10,color:theme.inputColorPlaceholder}}/>
            </TouchableOpacity>
        )
    }

    showAndroidTimeOnlyPicker = () => {

        const { attributes,theme } = this.props;
        const value = (attributes.value && new Date(attributes.value)) || null;

        return (
            <TouchableOpacity
                style={{
                    marginHorizontal: 5,
                    justifyContent:'center',
                    alignItems:'center',
                    flexDirection:'row'
                }}>
                <Text onPress={this.showTimePicker}>
                    {(value && moment(value, 'HH:mm').format("HH:mm")) || "None"}
                </Text>
                <Icon name="ios-arrow-forward" style={{fontSize:18,paddingStart:10,color:theme.inputColorPlaceholder}}/>
            </TouchableOpacity>
        );
    }


    showIOSDateTimePicker = ()=>{
        const { theme, attributes } = this.props;
        const value = (attributes.value && new Date(attributes.value)) || null;

        return (
            <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, right: 50, left: 50 }}
                style={{
                    marginHorizontal: 5,
                    justifyContent:'center',
                    alignItems:'center',
                    flexDirection:'row',
                }}>
                <Text onPress={this.showDateTimePicker}>
                    {(value && moment(value, "Do MMM YYYY HH:mm").format("Do MMM YYYY HH:mm")) || "None"}
                </Text>
                <Icon name="ios-arrow-forward" style={{fontSize:18,paddingStart:10,color:theme.inputColorPlaceholder}}/>
            </TouchableOpacity>
        )
    }

    showIOSDateOnlyPicker = () => {

        const { attributes ,theme} = this.props;
        const value = (attributes.value && new Date(attributes.value)) || null;

        return (
            <View
                style={{
                    marginHorizontal: 5,
                    justifyContent:'center',
                    alignItems:'center',
                    flexDirection:'row'
                }}>
                <Text>
                    {(value && moment(value, "Do MMM YYYY").format("Do MMM YYYY")) || "None"}
                    <Icon name="ios-arrow-forward" style={{fontSize:18,paddingStart:10,color:theme.inputColorPlaceholder}}/>
                </Text>
            </View>
        );
    }

    showIOSTimeOnlyPicker = () => {

        const { attributes, theme } = this.props;
        const value = (attributes.value && new Date(attributes.value)) || null;

        return (
            <View
                style={{
                    marginHorizontal: 5,
                    justifyContent:'center',
                    alignItems:'center',
                    flexDirection:'row'
                }}>
                <Text>
                    {(value && moment(value, 'hh:mm a').format("hh:mm a")) || "None"}
                    <Icon name="ios-arrow-forward" style={{fontSize:18,paddingStart:10,color:theme.inputColorPlaceholder}}/>
                </Text>
            </View>
        );
    }

    renderIOSDatePicker = () => {

        const { theme, attributes, ErrorComponent } = this.props;
        const value = (attributes.value && new Date(attributes.value)) || new Date();
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
                    onPress={() => this.setModalVisible(true)}
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
                    {(attributes.mode === "date") ? this.showIOSDateOnlyPicker() : 
                    (attributes.mode === "time") ? this.showIOSTimeOnlyPicker():this.showIOSDateTimePicker()}

                    <ErrorComponent {...{ attributes, theme }} />

                </TouchableOpacity>
                <Panel
                    ref={(c) => { this.panel = c; }}>
                    <DatePickerIOS
                        date={value}
                        mode={attributes.mode}
                        maximumDate={attributes.maxDate && new Date(attributes.maxDate)}
                        minimumDate={attributes.minDate && new Date(attributes.minDate)}
                        timeZoneOffsetInMinutes={this.props.timeZoneOffsetInHours * 60}
                        onDateChange={this.onDateChange}
                    />
                </Panel>
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
                    marginLeft: 20,                    
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>

                <Text style={{ color: theme.inputColorPlaceholder,paddingStart:5 }}>{attributes.label}</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        marginEnd:10
                    }}>

                    {(attributes.mode === "date") ? this.showAndroidDateOnlyPicker() :
                    (attributes.mode === "time") ?this.showAndroidTimeOnlyPicker():this.showAndroidDateTimePicker()}
                </View>
                
            </TouchableOpacity>
            
        );
    }

    renderModal = () => {
        const { attributes } = this.props;
        const value = (attributes.value && new Date(attributes.value)) || new Date();
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.setModalVisible(false)}
                style={{ backgroundColor: '#00000052' }}
            >

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    backgroundColor: '#00000052'
                }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPressOut={() => this.setModalVisible(false)}
                        style={{
                            height: '100%', width: '100%', flexDirection: 'column-reverse', alignItems: 'flex-end'
                        }}
                    >
                        <View style={{
                            backgroundColor: '#fff',
                            width: '100%',
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableHighlight
                                    onPress={() => this.setModalVisible(false)} style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        marginTop: 10,
                                        marginRight: 20
                                    }}>
                                    <View><Text style={{ fontSize: 20 }}> Done</Text></View>
                                </TouchableHighlight>
                            </View>
                            <DatePickerIOS
                                date={value}
                                mode={attributes.mode}
                                maximumDate={attributes.maxDate && new Date(attributes.maxDate)}
                                minimumDate={attributes.minDate && new Date(attributes.minDate)}
                                timeZoneOffsetInMinutes={this.props.timeZoneOffsetInHours * 60}
                                onDateChange={this.onDateChange}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    render() {
        return (
            <View>
                {(Platform.OS === 'ios') ? this.renderIOSDatePicker() : this.renderAndroidDatePicker(this.props)}
                {this.renderModal()}
            </View>
        );
    }

}
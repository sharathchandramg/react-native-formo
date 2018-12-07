import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, Picker, TouchableOpacity, TouchableHighlight, Modal } from "react-native";
import Panel from "../../components/panel";
import styles from "./../../styles";

import { View, Text, Switch } from "native-base";

const Item = Picker.Item;

export default class PickerField extends Component {
    static propTypes = {
        attributes: PropTypes.object,
        theme: PropTypes.object,
        updateValue: PropTypes.func,
        ErrorComponent: PropTypes.func,
    }

    constructor(props){
        super(props)
        this.state ={
            modalVisible: false
        }
    }


    handleChange(value) {
        const attributes = this.props.attributes;
        this.props.updateValue(attributes.name, attributes.options[value]);
    }

    setModalVisible = (visible) => {
        this.setState({modalVisible:visible})
    }
    renderModal = () => {
        const { theme, attributes, ErrorComponent } = this.props;
        const isValueValid = attributes.options.indexOf(attributes.value) > -1;
        const pickerValue = attributes.options.indexOf(attributes.value).toString();
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
                            <Picker
                                style={{ padding: 2 }}
                                textStyle={{ color: theme.pickerColorSelected }}
                                mode={attributes.mode}
                                selectedValue={pickerValue}
                                onValueChange={value => this.handleChange(value)}>
                                {
                                    attributes.options.map((item, index) => (
                                        <Item key={index} label={item} value={`${index}`} />
                                    ))
                                }
                            </Picker>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    render() {

        const { theme, attributes, ErrorComponent } = this.props;
        const isValueValid = attributes.options.indexOf(attributes.value) > -1;
        const pickerValue = attributes.options.indexOf(attributes.value).toString();

        if (Platform.OS !== "ios") {
            return (
                <View style={{...styles.pickerMainAndroid,...{
                        backgroundColor: theme.pickerBgColor,
                        borderBottomColor: theme.inputBorderColor,
                        borderBottomWidth: theme.borderWidth,
                }}}>
                    <View style={{ flex: 5 }}>
                        <Text style={{ color: theme.inputColorPlaceholder,paddingStart:5}}>{attributes.label}</Text>
                    </View>
                    <View style={{ flex: 5 }}>
                        <Picker
                            style={{ padding: 2 }}
                            textStyle={{ color: theme.pickerColorSelected }}
                            iosHeader="Select one"
                            mode={attributes.mode}
                            selectedValue={pickerValue}
                            onValueChange={value => this.handleChange(value)}>
                            {
                                attributes.options.map((item, index) => (
                                    <Item key={index} label={item} value={`${index}`} />
                                ))
                            }
                        </Picker>
                    </View>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            );
        }
        else {
            return (
                <View
                    style={Object.assign(styles.pickerMainIOS, {
                        // backgroundColor: theme.pickerBgColor,
                        // borderBottomColor: theme.inputBorderColor,
                        // borderBottomWidth: theme.borderWidth,
                    })}
                >
                    <TouchableOpacity
                        onPress={() => this.setModalVisible(true)}
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 10,
                        }}>
                        <Text style={{ color: theme.inputColorPlaceholder,paddingStart:5 }}>
                            {attributes.label}
                        </Text>
                        <Text style={{ color: theme.inputColorPlaceholder }}>
                            {isValueValid ? attributes.value : "None"}
                        </Text>
                    </TouchableOpacity>
                    <ErrorComponent {...{ attributes, theme }} />
                    {/* <View style={{ flex: 1 }}>
                        <Panel
                            ref={(c) => { this.panel = c; }}>
                            <Picker
                                style={{ padding: 2 }}
                                textStyle={{ color: theme.pickerColorSelected }}
                                mode={attributes.mode}
                                selectedValue={pickerValue}
                                onValueChange={value => this.handleChange(value)}>
                                {
                                    attributes.options.map((item, index) => (
                                        <Item key={index} label={item} value={`${index}`} />
                                    ))
                                }
                            </Picker>
                        </Panel>
                    </View> */}
                    {this.renderModal()}
                </View>

            );
        }

    }
}
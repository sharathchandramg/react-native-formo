import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, TouchableOpacity, TouchableHighlight, Modal } from "react-native";
import { View, Text} from "native-base";
import { Picker } from '@react-native-picker/picker';

import styles from "./../../styles";
import StarIcon from "../../components/starIcon";

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
            modalVisible: false,
            value: null
        }
    }


    handleChange(value) {
        this.setState({value:value})
        this.props.updateValue(this.props.attributes.name,value );
    }

    setModalVisible = (visible) => {
        this.setState({modalVisible:visible})
    }

    renderModal = () => {
        const { theme, attributes} = this.props;
        const pickerValue =  this.state.value !== null ? this.state.value : typeof attributes.value !=='undefined' && attributes.value !== null? attributes.value:'';
        
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
                        <View style={{ backgroundColor: '#fff', width: '100%'}}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableHighlight
                                    onPress={() => this.setModalVisible(false)} style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        marginTop: 10,
                                        marginRight: 20
                                    }}>
                                    <View><Text style={{ fontSize: 20,color:'rgb(0,151,235)' }}>{'Done'}</Text></View>
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
                                        <Item key={index} label={item} value={item} />
                                    ))
                                }
                            </Picker>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    renderIOSPicker =(isValueValid,defaultValue)=>{
        const { theme, attributes} = this.props;
        return (
            <View style={Object.assign(styles.pickerMainIOS)}>
                <TouchableOpacity
                    onPress={() => this.setModalVisible(true)}
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: 10,
                    }}>
                    <View style={{flexDirection:'row' }}>
                        {attributes['required'] && <StarIcon required={attributes['required']} />}
                        <Text
                            style={{
                                color: theme.inputColorPlaceholder,
                                paddingStart: 5,
                            }}
                        >
                            {attributes.label}
                        </Text>
                    </View>
                    <Text style={{ color: theme.inputColorPlaceholder }}>
                        {isValueValid ? attributes.value : defaultValue}
                    </Text>
                </TouchableOpacity>
                {this.renderModal()}
            </View>

        );
    }

    renderAndroidPicker =(pickerValue)=>{
        const { theme, attributes} = this.props;
        return (
            <View style={{...styles.pickerMainAndroid,...{
                    backgroundColor: theme.pickerBgColor,
                    borderBottomColor: theme.inputBorderColor,
                    borderBottomWidth: theme.borderWidth,
            }}}>
            <View style={{ flex: 5, flexDirection:'row', alignItems:'center' }}>
                {attributes['required'] && <StarIcon required={attributes['required']} />}
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
                        onValueChange={value => this.handleChange(value)}>
                        {
                            attributes.options.map((item, index) => (
                                <Item key={index} label={item} value={item} />
                            ))
                        }
                    </Picker>
                </View>
            </View>
        );
    }

    render() {

        const { theme, attributes, ErrorComponent } = this.props;
        const value = attributes['value']|| '';
        const defaultValue = attributes['defaultValue'] || "-Select-" ;

        const isValueValid = attributes.options.indexOf(attributes.value) > -1;
        const pickerValue =  this.state.value !== null ? this.state.value : value || defaultValue;
                

        return(
            <View>
                {Platform.OS !== "ios"?     
                    this.renderAndroidPicker(pickerValue)
                    :
                    this.renderIOSPicker(isValueValid,defaultValue)
                }
                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        )
    }
}
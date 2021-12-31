import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform,Modal,TouchableOpacity,TouchableHighlight } from "react-native";
import { View, Input, ListItem, Text } from "native-base";
import { Picker } from '@react-native-picker/picker';

import { getKeyboardType } from "./../../utils/helper";
import StarIcon from "../../components/starIcon";

const Item = Picker.Item;

export default class CurrencyField extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        theme: PropTypes.object,
        onSummitTextInput: PropTypes.func,
        ErrorComponent: PropTypes.func,
        updateValue: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state ={
            modalVisible: false,
            value:{
                curr_type:'INR',
                curr_value: 0
            }
        }
    }

    onCurrencyTypeChange = (curr_type)=> {
        let value = this.state.value;
        value.curr_type = curr_type;
        this.setState({value:value})
        this.props.updateValue(this.props.attributes.name,this.state.value)
    }
    
    onAmountChange(curr_value) {
        let value = this.state.value;
        value.curr_value = curr_value;
        this.setState({value:value})
        this.props.updateValue(this.props.attributes.name,this.state.value)
    }

    renderInputField = (attributes,theme) =>{
        const inputProps = attributes.props;
        const keyboardType = getKeyboardType(attributes.type);
        return(
            <Input
                style={{
                    height: inputProps && inputProps.multiline && (Platform.OS === 'ios' ? undefined : null),
                    paddingStart:5,
                }}
                keyboardType={keyboardType}
                underlineColorAndroid="transparent"
                numberOfLines={2}
                secureTextEntry={attributes.secureTextEntry || attributes.type === "password"}
                placeholder={attributes.label}
                blurOnSubmit={false}
                placeholderTextColor={theme.inputColorPlaceholder}
                editable={attributes.editable}
                onChangeText={text => this.onAmountChange(text)}
                // value={attributes.value}
                value={attributes.value && attributes.value.curr_value && attributes.value.curr_value.toString()}
            />
        )

    }

    renderModal = () => {
        const { theme, attributes, ErrorComponent } = this.props;
        let currencyType = typeof attributes.value !=='undefined' && attributes.value !== null?attributes.value.curr_type: this.state.value.curr_type;;
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
                            {attributes.currencyOptions &&
                                <Picker
                                    style={{ padding: 2 }}
                                    textStyle={{ color: theme.pickerColorSelected }}
                                    mode={attributes.mode}
                                    selectedValue={currencyType}
                                    onValueChange={value => this.onCurrencyTypeChange(value)}>
                                    {
                                        attributes.currencyOptions.map((item, index) => (
                                            <Item key={index} label={item} value={item} />
                                        ))
                                    }
                                </Picker>
                            }
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }


    renderCurrencyTypePicker = ()=>{
        const { theme, attributes, ErrorComponent } = this.props;
        let currencyType = typeof attributes.value !=='undefined' && attributes.value !== null?attributes.value.curr_type: this.state.value.curr_type;
        if(Platform.OS !== "ios"){
            return (
                <View style={{ 
                    flex:2,
                    flexDirection:'row', 
                    marginTop:5,
                    backgroundColor: theme.pickerBgColor,
                    borderBottomColor: theme.inputBorderColor,
                    borderBottomWidth: theme.borderWidth}}>
                    {attributes.currencyOptions && 
                        <Picker
                            style={{ flex:2,flexDirection:'row'}}
                            textStyle={{ color: theme.pickerColorSelected }}
                            iosHeader="Select one"
                            mode={attributes.mode}
                            selectedValue={currencyType}
                            onValueChange={value => this.onCurrencyTypeChange(value)}>
                            {
                                attributes.currencyOptions.map((item, index) => (
                                    <Item key={index} label={item} value={item} />
                                ))
                            }
                        </Picker>
                    }
                </View>
            );
        }else{
            return(
                <TouchableOpacity 
                    style={{ 
                        flex:2,
                        flexDirection:'row', 
                        backgroundColor: theme.pickerBgColor,
                        borderBottomColor: theme.inputBorderColor,
                        borderBottomWidth: theme.borderWidth}}
                    onPress={() => this.setModalVisible(true)}>
                    <Text style={{ color: theme.inputColorPlaceholder}}>{currencyType}</Text>
                </TouchableOpacity>
            )
        }
    }

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        return (
            <View>
                <ListItem style={{ borderBottomWidth: 0, paddingVertical: 5 }}>
                    {attributes['required'] && <StarIcon required={attributes['required']} />}
                    <View style={{ flex:5,flexDirection:'row'}}>
                        {attributes.showCurrencyOptions && 
                            <View style={{ flex:2,flexDirection:'row'}}>
                                {this.renderCurrencyTypePicker()}
                            </View>
                        }
                        <View
                            style={{ 
                                flex:attributes.showCurrencyOptions?3:5,
                                flexDirection:'row', 
                                backgroundColor: theme.pickerBgColor,
                                borderBottomColor: theme.inputBorderColor,
                                borderBottomWidth: theme.borderWidth}}
                            >
                            {this.renderInputField(attributes,theme)}
                        </View>
                    </View>
                </ListItem>
                <View style={{marginHorizontal:15}}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
                
            </View>
            
        );

    }
}
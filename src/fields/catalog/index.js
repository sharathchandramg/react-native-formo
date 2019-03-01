import PropTypes from "prop-types";
import React, { Component } from "react";
import {TouchableOpacity } from "react-native";
import {
    View,
    Text,
    Icon,
    
} from "native-base";


export default class CatalogField extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        updateValue: PropTypes.func,
        theme: PropTypes.object,
        ErrorComponent: PropTypes.func,
        onExternalComponent:PropTypes.func
    }

    constructor(props) {
        super(props);
        
    }

    handleOnclick =()=> {
        this.props.onExternalComponent(this.props)
    }

    
    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        
        //If multiple selections are allowed allow assignment via Id, Value or just a string value
        const label = "None";

        if(typeof attributes.value !=='undefined' && attributes.value && Object.keys(attributes.value).length){
            let quantity = attributes.value.total_quantity;
            let cost = attributes.value.total_cost;
            label =`Total ${quantity} items  Cost INR ${cost}`
        }        

        return (
            <View>
                <TouchableOpacity style={{
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
                    <Text style={{ color: theme.inputColorPlaceholder,paddingStart:5}}>{attributes.label}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginEnd:10,
                            justifyContent:'flex-end',alignItems:'flex-end',
                        }}>
                        <TouchableOpacity  
                            hitSlop={{ top: 10, bottom: 10, right: 50, left: 50 }}
                            style={{marginHorizontal: 5,justifyContent:'flex-end',alignItems:'flex-end',flexDirection:'row'}} 
                            onPress={() => this.handleOnclick()}>
                            <Text>{label}</Text>
                            <Icon name="ios-arrow-forward" style={{fontSize:18,paddingStart:10,color:theme.inputColorPlaceholder}}/>
                        </TouchableOpacity>
                    </View>

                </TouchableOpacity>
                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}
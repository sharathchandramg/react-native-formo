import PropTypes from "prop-types";
import React, { Component } from "react";
import {TouchableOpacity } from "react-native";
import {
    View,
    Text,
    ListItem,
    Left,
    Right,
    Body,
    Icon,
} from "native-base";

import styles from "./styles";

export default class CatalogForm extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        updateValue: PropTypes.func,
        theme: PropTypes.object,
        ErrorComponent: PropTypes.func,
        CustomComponent: PropTypes.func,
    }

    constructor(props) {
        super(props);
    }

    goToCustomComponent =()=> {
        // take to custom component.

    }

    renderIcon = ()=>{
        return (
            <TouchableOpacity style={styles.rightIcon}
                onPress={()=>this.goToCustomComponent()}>
                <Icon type="FontAwesome" name="arrow-circle-right" color ={'#828282'} style={styles.iconStyle}/>
            </TouchableOpacity>
        );
    }

    render() {

        const { theme, attributes, ErrorComponent,CustomComponent } = this.props;
        let label = attributes.label;
        if(typeof attributes.value !=='undefined' && attributes.value !== null && attributes.value){
            let quantity = attributes.value.total_quantity;
            let price    =  attributes.value.total_price;
            label = `Total ${quantity} items  Total Cost ${price}`
        }
        
        
        return (
            <View style ={styles.container}>
                <ListItem >
                    <Left>
                        <Text style={{ color: theme.inputColorPlaceholder,paddingStart:5}}>{label}</Text>
                    </Left>
                    <Body></Body>
                    <Right>
                        {this.renderIcon()}
                    </Right>
                </ListItem>
                <View style={{ paddingHorizontal:5 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}
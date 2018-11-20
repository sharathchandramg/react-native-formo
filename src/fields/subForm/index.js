import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, Modal, Dimensions,TouchableOpacity } from "react-native";
import {
    View,
    Text,
    Container,
    Header,
    Content,
    ListItem,
    CheckBox,
    Left,
    Right,
    Body,
    Title,
    Button,

} from "native-base";

import Icon from 'react-native-vector-icons/FontAwesome';
const deviceWidth = Dimensions.get('window').width;
import styles from "./styles";
import Form0 from "./../../index";
import FormField from "../form";


export default class SubForm extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        updateValue: PropTypes.func,
        theme: PropTypes.object,
        ErrorComponent: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            subFormData:{},
        };
    }

    toggleModalVisible =()=> {
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    }

    toggleSelect(value) {
        const attributes = this.props.attributes;
        const newSelected = attributes.multiple ? attributes.value : value;
        if (attributes.multiple) {
            const index = attributes.objectType ? newSelected.findIndex(option =>
                option[attributes.primaryKey] === value[attributes.primaryKey]
            ) : newSelected.indexOf(value);
            if (index === -1) {
                newSelected.push(value);
            } else {
                newSelected.splice(index, 1);
            }
        }
        this.setState({
            modalVisible: attributes.multiple ? this.state.modalVisible : false,
        }, () => this.props.updateValue(this.props.attributes.name, newSelected));
    }

    renderlookupIcon = ()=>{
        return (
            <TouchableOpacity style={styles.valueContainer}
                onPress={()=>this.toggleModalVisible()}>
                <Icon name="plus-circle" size={18} type={'regular'} color ={'#828282'} style={styles.iconStyle}/>
            </TouchableOpacity>
        );
    }

    renderAddedSubForm =(data,name)=>{
        let subForms = <View></View>;
        subForms = data.map((item, index) => {
            let label = `${name}${index}`;
            return (
                <TouchableOpacity
                    key={index}
                    style={styles.inputValue}
                    onPress={() => this.setState({subFormData:item},()=>this.toggleModalVisible())}>
                        <Text style={styles.labelText}>{label}</Text>
                </TouchableOpacity>
            );
        })

        return subForms;
    }
    

    render() {

        const { theme, attributes, ErrorComponent } = this.props;
        
        return (
            <View style ={styles.container}>
                <View style={[styles.inputField]}  error={theme.changeTextInputColorOnError ? attributes.error : null}>
                    <View style={[styles.inputLabel]}>
                        <Text style={[styles.labelText]}>{attributes.label}</Text>
                        {this.renderlookupIcon()}
                    </View>
                    {typeof attributes.value !== "undefined" && attributes.value.length> 0?
                        this.renderAddedSubForm(attributes.value,attributes.name)
                        :null
                    }
                </View>
                <Modal
                    visible={this.state.modalVisible}
                    animationType="none"
                    onRequestClose={() => this.toggleModalVisible()}>
                    <Container style={{ flex: 1 }}>
                        <Header>
                            <Left>
                                <Button transparent onPress={() => this.toggleModalVisible()}>
                                    <Icon name="arrow-left" color ={'white'} />
                                </Button>
                            </Left>
                            <Body>
                                <Title>{attributes.label || "Select"}</Title>
                            </Body>
                            <Right />
                        </Header>
                        <Content>
                            <FormField
                                ref={(c) => { this.group = c; }}
                                {...this.props}
                                formData={this.state.subFormData}
                                toggleModalVisible={this.toggleModalVisible}
                            />
                        </Content>
                    </Container>
                </Modal>
            </View>
        );
    }
}
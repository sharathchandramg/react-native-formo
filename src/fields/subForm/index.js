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
import shortid from 'shortid';
import styles from "./styles";
import ChildField from "../childForm";


export default class SubForm extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        updateValue: PropTypes.func,
        theme: PropTypes.object,
        ErrorComponent: PropTypes.func,
        onAddNewFields: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            mode: 'create',
            subFormData:{},
        };

        this.onAddNewFields ;
        
    }


    handleChange =(name,value)=>{
        if(value && typeof value._id !=='undefined' && value._id !== null){
            this.props.onAddNewFields(name,value)
        }else{
            value["_id"] = shortid.generate();
            this.props.onAddNewFields(name,value)
        }
    }

    toggleModalVisible =()=> {
        this.setState({
            modalVisible: !this.state.modalVisible,
            
        });
    }

    renderlookupIcon = ()=>{
        return (
            <TouchableOpacity style={styles.valueContainer}
                onPress={()=>this.setState({subFormData:{},mode:'create'},()=>this.toggleModalVisible())}>
                <Icon name="plus-circle" size={18} type={'regular'} color ={'#828282'} style={styles.iconStyle}/>
            </TouchableOpacity>
        );
    }

    constructDisplayField = (item)=>{
        let filtered = Object.keys(item)
            .filter(key => key !=='_id')
            .reduce((acc, key) => {
                acc.push(item[key]);
                return acc;
            },[]);
        
            let arr = [];
            filtered.forEach(function(item) {
                if(typeof item ==='object'){
                    let fArr = Object.values(item).filter(value => value)
                    arr.push(fArr);
                }
                if(typeof item ==='string'){
                    arr.push(item)
                }
            });
        if(arr.length >0)  
            return arr.toString()
        else 
            return         
    }

    renderAddedSubForm =(data,name)=>{
        let subForms = <View></View>;
        subForms = data.map((item, index) => {
            let label = this.constructDisplayField(item);
            return (
                <TouchableOpacity
                    key={index}
                    style={styles.inputValue}
                    onPress={() => this.setState({subFormData:item,mode:'update'},()=>this.toggleModalVisible())}>
                        <Text style={styles.subformText} numberOfLines={2}>{label}</Text>
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
                    {typeof attributes.value !== "undefined" && attributes.value !== null && attributes.value.length> 0?
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
                            <ChildField
                                ref={(c) => { this.group = c; }}
                                {...this.props}
                                formData={this.state.subFormData}
                                toggleModalVisible={this.toggleModalVisible}
                                handleChange={this.handleChange}
                                mode ={this.state.mode}
                            />
                        </Content>
                    </Container>
                </Modal>
                
                <View style={{ paddingHorizontal:5 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}
import PropTypes, { element } from "prop-types";
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
    Footer,
    Icon

} from "native-base";

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
        }else if(value && value !== null ){
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
                <Icon name="add" color ={'#828282'} style={styles.iconStyle}/>
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

    renderAddedSubForm =(attributes)=>{
        let data = attributes.value;
        let leftViewData = [];
        let rightViewData = [];
        let fields = attributes.fields;
        let lookupField = [];
        let ofd ;
        fields.map(field =>{
            if(field.type === 'lookup'){
                leftViewData = data.map(item =>item[field.name]);
                lookupField = field.fields;
            }else{
                ofd = data.map(item =>item[field.name]);
                rightViewData.push(ofd)
            }
        })

        return <View style={{flexDirection:'column', width:'100%'}}>
                {this.renderSubformData(leftViewData,rightViewData,lookupField,data)}
        </View>
    }

    renderSubformData =(leftViewData,rightViewData,lookupField,data)=>{
        let subForms = <View  style={styles.subForm}> </View>;
        let leftLabel = <View style={styles.leftLabel}> </View>
        const { attributes } = this.props;
        let fields = attributes.fields;
        
        if(leftViewData.length > 0 && rightViewData.length > 0){
            subForms = leftViewData.map((item,index )=>{
                let values = [];
                values = lookupField.map(e => item[e.name]);
                leftLabel = values.map(val =><Text style={styles.subformText}>{val}</Text>);
                let fdata = data[index];
                let rVal = []
                fields.map(f => f.type !=='lookup'?rVal.push(fdata[f.name]):'')
                rightLabel = rVal.map((item,index )=>{
                    if(typeof item ==='string'){
                        return <Text style={styles.subformText}>{item}</Text>;
                    }else if(typeof item ==='object'){
                        let val = Object.values(item).toString()
                        return <Text style={styles.subformText}>{val}</Text>;
                    }
                })
                return (
                    <TouchableOpacity 
                        style={{marginBottom:10,flex:4,flexDirection:'row'}}
                        onPress={() => this.setState({subFormData:data[index],mode:'update'},()=>this.toggleModalVisible())}>
                        <View style={styles.leftLabelWrapper}>
                            {leftLabel}
                        </View>
                        <View style={{flex:1,flexDirection:'column'}}>
                            {rightLabel}
                        </View>
    
                    </TouchableOpacity>
                )
            })

        }else if(leftViewData.length >0){
            subForms = leftViewData.map((item,index )=>{
                let values = [];
                values = lookupField.map(e => item[e.name]);
                leftLabel = values.map(val =><Text style={styles.subformText}>{val}</Text>);
                return (
                    <TouchableOpacity 
                        style={{marginBottom:10,flex:4,flexDirection:'row'}}
                        onPress={() => this.setState({subFormData:data[index],mode:'update'},()=>this.toggleModalVisible())}>
                        <View style={styles.leftLabelWrapper}>
                            {leftLabel}
                        </View>
                    </TouchableOpacity>
                )
            })

        }else if(rightViewData.length > 0){
            subForms = rightViewData.map((item,index )=>{
                if(typeof item ==='string'){
                    leftLabel = <Text style={styles.subformText}>{item}</Text>;
                }else if(typeof item ==='object'){
                    let val = Object.values(item).toString()
                    leftLabel = <Text style={styles.subformText}>{val}</Text>;
                }
                return (
                    <TouchableOpacity 
                        style={{marginBottom:10,flex:4,flexDirection:'row'}}
                        onPress={() => this.setState({subFormData:data[index],mode:'update'},()=>this.toggleModalVisible())}>
                        <View style={styles.leftLabelWrapper}>
                            {leftLabel}
                        </View>
                    </TouchableOpacity>
                )
            })
        }
        return subForms
    }

    addNewFields =()=>{
        let  fValue = this.child.getChildFields()
        if(typeof fValue !=='undefined' && fValue !== null){
            let uValue = this.props.mode ==='update'? {...fValue,"_id":this.props.subFormData._id}:fValue;
            this.handleChange(this.props.attributes.name,uValue)
            this.toggleModalVisible();
        }    
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
                        this.renderAddedSubForm(attributes)
                        :null
                    }
                </View>
                <Modal
                    visible={this.state.modalVisible}
                    animationType="none"
                    onRequestClose={() => this.toggleModalVisible()}>
                    <Container style={{ flex: 1 }}>
                        <Header style={[theme.header,{elevation:15,}]}>
                            <Left>
                                <Button transparent onPress={() => this.toggleModalVisible()}>
                                    <Icon name="arrow-back"   style={{color:'#48BBEC'}} />
                                </Button>
                            </Left>
                            <Body>
                                <Title style={theme.headerText}>{attributes.label || "Select"}</Title>
                            </Body>
                            <Right />
                        </Header>
                        <Content>
                            <ChildField
                                ref={(c) => { this.child = c; }}
                                {...this.props}
                                formData={this.state.subFormData}
                                toggleModalVisible={this.toggleModalVisible}
                                handleChange={this.handleChange}
                                mode ={this.state.mode}
                            />
                        </Content>
                        <Footer style={styles.button}>
                            <TouchableOpacity style={styles.button} onPress={() => this.addNewFields()}>
                                <Text style={styles.buttonText}>{this.state.mode ==='create'? 'Add':'Update'} </Text>
                            </TouchableOpacity>
                        </Footer>
                    </Container>
                </Modal>
                
                <View style={{ paddingHorizontal:5 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}
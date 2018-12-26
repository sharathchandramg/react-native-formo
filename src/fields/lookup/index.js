import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, Modal, Dimensions, TouchableOpacity } from "react-native";
import Form0 from "./../../index";
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
    Icon,
    Body,
    Title,
    Button,
} from "native-base";

const deviceWidth = Dimensions.get('window').width;
import styles from "./styles";

export default class LookupField extends Component {

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
        };
    }

    toggleModalVisible() {
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    }

    toggleSelect(value) {
        const attributes = this.props.attributes;
        this.setState({
            modalVisible: attributes.multiple ? this.state.modalVisible : false,
        },() => this.props.updateValue(this.props.attributes.name,updateValue));
    }

    renderlookupIcon = ()=>{
        return (
            <TouchableOpacity style={styles.labelText}
                onPress={()=>this.toggleModalVisible()}>
                <Icon name="ios-arrow-forward" size={14} type={'regular'} color ={'#828282'} style={styles.iconStyle}/>
            </TouchableOpacity>
        );
    }

    getLookupData = (value)=>{
        let attributes = this.props.attributes;
        let options = typeof attributes.options !=='undefined'?attributes.options: null;
        let data = null;
        if(options !== null && value !== null){
            let primaryKey = value[attributes.primaryKey];
            data = options.find(item =>item[attributes.primaryKey] === primaryKey)
            return data;
        }
    }

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        let value = typeof attributes.value !== 'undefined' && attributes.value !== null?attributes.value:null
        let fields = typeof attributes.fields !== 'undefined' && attributes.fields !== null?attributes.fields:[]
        let data = value !== null?this.getLookupData(value):{};
        return (
            <View style ={styles.container}>
                <View style={[styles.inputLabel]} error={theme.changeTextInputColorOnError ? attributes.error : null}>
                    <Text style={[styles.labelText]}>{attributes.label}</Text>
                    {this.renderlookupIcon()}
                </View>
                <View style={{flex:1,width:'100%',marginStart:0}}>
                    <Form0 
                        ref={(c) => {this.lookup = c; }} 
                        fields={fields} 
                        formData={data}
                    />
                </View>
                <Modal
                    visible={this.state.modalVisible}
                    animationType="none"
                    onRequestClose={() => this.toggleModalVisible()}>
                    <Container style={{ flex: 1 }}>
                        <Header>
                            <Left>
                                <Button transparent onPress={() =>this.toggleModalVisible()}>
                                    <Icon name="arrow-back" />
                                </Button>
                            </Left>
                            <Body>
                                <Title>{attributes.label || "Select"}</Title>
                            </Body>
                            <Right />
                        </Header>

                        <Content>
                            {
                                attributes.options.map((item, index) => {
                                    let isSelected = false;
                                    if (attributes.multiple) {
                                        isSelected = attributes.objectType ?
                                            attributes.value.findIndex(option =>
                                                option[attributes.primaryKey] === item[attributes.primaryKey]
                                            ) !== -1 : (attributes.value.indexOf(item) !== -1);
                                    }
                                    return (
                                        <ListItem
                                            key={index}
                                            onPress={() => this.toggleSelect(item)}>
                                            {attributes.multiple &&
                                                <CheckBox
                                                    onPress={() => this.toggleSelect(item)}
                                                    checked={isSelected}
                                                />
                                            }
                                            <Body>
                                                <Text style={{ paddingHorizontal: 5 }}>
                                                    {attributes.objectType ? item[attributes.labelKey] : item}
                                                </Text>
                                            </Body>
                                        </ListItem>);
                                })
                            }
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
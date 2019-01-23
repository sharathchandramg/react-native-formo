import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, Modal, Dimensions, TouchableOpacity } from "react-native";
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
export default class SelectField extends Component {

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

    render() {
        const { theme, attributes, ErrorComponent } = this.props;

        //If multiple selections are allowed allow assignment via Id, Value or just a string value        
        const selectedText = attributes.multiple ?
            attributes.value.length || "None" :
            attributes.objectType ?
                (attributes.value && attributes.value[attributes.labelKey]) || "None"
                : attributes.value || "None";

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
                            onPress={() => this.toggleModalVisible()}>
                            <Text>{selectedText}</Text>
                            <Icon name="ios-arrow-forward" style={{fontSize:18,paddingStart:10,color:theme.inputColorPlaceholder}}/>
                        </TouchableOpacity>
                    </View>

                </TouchableOpacity>
                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
                <Modal
                    visible={this.state.modalVisible}
                    animationType="none"
                    onRequestClose={() => this.toggleModalVisible()}>
                    <Container style={{ flex: 1 }}>

                        <Header style={theme.header}>
                            <Left>
                                <Button transparent onPress={() => this.toggleModalVisible()}>
                                    <Icon name="arrow-back" style={{color :'#48BBEC'}} />
                                </Button>
                            </Left>
                            <Body>
                                <Title style={theme.headerText}>{attributes.label || "Select"}</Title>
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
            </View>
        );
    }
}
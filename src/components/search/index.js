
import PropTypes from "prop-types";
import React, { Component } from "react";
import {Modal} from "react-native";

import {
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
    Button,
    Input,
    Item
} from "native-base";

import styles from "./styles"

const SearchComponent =(props)=>{
    const {
        theme,
        toggleSearchModalVisible,
        handleTextChange,
        handleOnSearchQuery,
        searchText
    } = props;
    return(
        <Modal
            visible={props.searchModalVisible}
            animationType="none"
            onRequestClose={() => toggleSearchModalVisible()}>
            <Container style={{ flex: 1 }}>
            <Header style={[theme.header]} androidStatusBarColor='#c8c8c8'>
                <Left>
                    <Button transparent onPress={() => toggleSearchModalVisible()}>
                        <Icon name="arrow-back"   style={{color :'#48BBEC'}}/>
                    </Button>
                </Left>
                <Body>
                <Item style={{height:30,width:'100%'}}>
                    <Input
                        keyboardType={'default'}
                        underlineColorAndroid="transparent"
                        numberOfLines={2}
                        placeholder={'Search'}
                        autoFocus={true}
                        value={searchText}
                        onChangeText={text => handleTextChange(text)}
                        returnKeyType={'search'}
                        onSubmitEditing ={()=> handleOnSearchQuery(searchText)}
                    />
                </Item>
                </Body>
                <Right>
                    <Button transparent onPress={() => handleOnSearchQuery(searchText)}>
                        <Icon name="search"   style={{color :'#48BBEC',fontSize:18}} type="FontAwesome"/>
                    </Button>
                </Right>
            </Header>
            <Content>
            </Content>
        </Container>
        </Modal>
    )
}

export default SearchComponent;
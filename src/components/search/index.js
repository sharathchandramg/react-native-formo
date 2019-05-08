
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
        attributes,
        theme,
        toggleSelect,
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
                                onPress={() => toggleSelect(item)}>
                                {attributes.multiple &&
                                    <CheckBox
                                        onPress={() => toggleSelect(item)}
                                        checked={isSelected}
                                    />
                                }
                                <Body>
                                    <Text style={{ paddingHorizontal: 5 }}>
                                        {attributes.objectType ? item[attributes.labelKey] : item}
                                    </Text>
                                </Body>
                            </ListItem>
                        );
                    })
                }
            </Content>
        </Container>
        </Modal>
    )
}

export default SearchComponent;
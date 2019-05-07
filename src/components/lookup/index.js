
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
    Title
} from "native-base";

import styles from "./styles"

const LookupComponent =(props)=>{
    let {
        attributes,
        theme,
        modalVisible,
        toggleSelect,
        toggleModalVisible,
        toggleSearchModalVisible,
        toggleFilterModalVisible,
        searchEnable,
        filterEnable 
    } = props;
    return(
        <Modal
            visible={modalVisible}
            animationType="none"
            onRequestClose={() =>toggleModalVisible()}>
            <Container style={{ flex: 1 }}>
                <Header style={[theme.header]} androidStatusBarColor='#c8c8c8'>
                    <Left>
                        <Button transparent onPress={() =>toggleModalVisible()}>
                            <Icon name="arrow-back"   style={{color :'#48BBEC'}}/>
                        </Button>
                    </Left>
                    <Body>
                        <Title style={theme.headerText}>{attributes.label || "Select"}</Title>
                    </Body>
                    <Right>
                        {searchEnable?
                            <Button transparent onPress={() =>toggleSearchModalVisible()}>
                                <Icon name="search"   style={{color :'#48BBEC',fontSize:18}} type="FontAwesome"/>
                            </Button>
                            : 
                            null
                        }
                        {filterEnable?
                            <Button transparent onPress={() =>toggleFilterModalVisible()}>
                                <Icon name="filter"   style={{color :'#48BBEC',fontSize:18}} type="FontAwesome"/>
                            </Button>
                            : 
                            null
                        }
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
                                    onPress={() =>toggleSelect(item)}>
                                    {attributes.multiple &&
                                        <CheckBox
                                            onPress={() =>toggleSelect(item)}
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

export default LookupComponent;
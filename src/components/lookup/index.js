
import PropTypes from "prop-types";
import React, { Component } from "react";
import {Modal,TouchableOpacity,View,FlatList} from "react-native";
import {isEmpty} from "../../utils/validators";

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
        filterEnable,
        handleReset,
        filter,
        activeCategory 
    } = props;

    renderFilterItem =({item,index})=>{
        let label = '';
        if(!isEmpty(activeCategory) && !isEmpty(activeCategory['name'])){
            label = attributes.objectType ? item[activeCategory['name']] : item
        }else{
            label = attributes.objectType ? item[attributes.labelKey] : item
        }

        return (
            <View style={styles.selectedContainer} key={index.toString()}>
                <TouchableOpacity style={styles.selectedStatusOuter} onPress={() => handleReset(item)}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={styles.selectedText}>
                        {label}
                    </Text>
                    <TouchableOpacity 
                        style={styles.removeFilterIcon}
                        onPress={() => handleReset(item)}>
                        <Icon name ={'times-circle'}  style={{ fontSize:14,color:'white'}} type="FontAwesome"/>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        )
    }

    renderFilterSelected = (filterArr) => {
        return(
            <FlatList
                horizontal={true}
                data={filterArr}
                extraData={props}
                keyExtractor={(item, index) => `feed_${index}`}
                renderItem={renderFilterItem}
            />  
        )
    } 



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
                    {filter && filter.length > 0? 
                        <View style={styles.filterContainer}>
                            {renderFilterSelected(filter)}
                        </View>
                        : 
                        null
                    }
                    
                    <View>
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
                    </View>
                </Content>
            </Container>
        </Modal>
    )
}

export default LookupComponent;
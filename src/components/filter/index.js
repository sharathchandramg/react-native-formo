
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Modal, FlatList} from "react-native";

import {
    Container,
    Header,
    Content,
    Footer,
    View,
    Text,
    ListItem,
    CheckBox,
    Left,
    Icon,
    Body,
    Button,
    Input
} from "native-base";

import styles from "./styles"

const FilterComponent =(props)=>{
    const {
        attributes,
        theme,
        toggleSelect,
        handleTextChange,
        searchText,
        applyFilterFunction,
        resetFilter,
        setFilterCategory,
        toggleFilterModalVisible,
        activeCategoryData
    } = props;



    renderCategoryDataItem =({item,index})=>{
        return (
            <ListItem 
                style={{height:50,width:'100%',justifyContent:'center',alignItem:'flex-start'}} 
                key={index} 
                onPress={() => toggleSelect(item)}>
                {attributes.multiple &&
                    <CheckBox
                        onPress={() => toggleSelect(item)}
                        checked={isSelected}
                    />
                }
                <View style={{height:50,width:'100%',justifyContent:'center',alignItem:'flex-start'}}>
                    <Text style={[styles.filterText,{fontSize:12,paddingEnd:5,alignSelf:'stretch'}]}>
                        {attributes.objectType ? item[attributes.labelKey] : item}
                    </Text>
                </View>
            </ListItem>
        );
    }

    renderCategoryData =()=>{
        return(
            <FlatList
                data={activeCategoryData}
                extraData={props}
                keyExtractor={(item, index) => index.toString()}
                listKey={(item, index) => 'D' + index.toString()}
                renderItem={this.renderCategoryDataItem}
            />
        )
    }


    renderCategoryItem =({item,index})=>{
        return (
            <ListItem  
                style={{height:50,width:'100%',justifyContent:'center',alignItem:'flex-start'}} 
                key={index} 
                onPress={() => setFilterCategory(item)}>
                <View style={{height:50,width:'100%',justifyContent:'center',alignItem:'flex-start'}} >
                    <Text style={[styles.filterText,{fontSize:14,paddingEnd:5,alignSelf:'stretch'}]}>{item['label']}</Text>
                </View>
            </ListItem>
        );
    }

    renderCategory =()=>{
        return(
            <FlatList
                data={[{type:'user',name:'user_name',label:'User'}]}
                extraData={props}
                keyExtractor={(item, index) => index.toString()}
                listKey={(item, index) => 'D' + index.toString()}
                renderItem={this.renderCategoryItem}
                style={{width:'100%'}}
            />
        )
    }



    renderfilterBottom =()=>{
        return(
            <View style={styles.filterFooter}>
                <Button style={[styles.filterFooterLeft]} onPress={()=>resetFilter()} >
                    <Text style={[styles.filterText,{fontSize:14}]}>CLEAR</Text>
                </Button>
                <Button style={[styles.filterFooterRight,{width:'50%'}]} onPress={()=> applyFilterFunction()}>
                    <Text style={[styles.filterText,{color:'#F36'}]}>APPLY</Text>
                </Button>
            </View>
        )
    }

    renderFilterBody =()=>{
        return(
            <View style={styles.filterBody}>
                    <View style={styles.filterBodyBottom}>
                        <View style={styles.filterBodyBottomLeft}>
                            {renderCategory()}
                        </View>
                        <View style={styles.filterBodyBottomRight}>
                            <View style={styles.searchContainer}>
                                <Icon name="search" style={{color:'grey',fontSize:16}} type="FontAwesome"/>
                                <View style={styles.inputWrapper}>
                                    <Input
                                        style={styles.inputText}
                                        placeholder ={'Search'}
                                        value ={searchText}
                                        onChangeText={(text) => handleTextChange(text)}
                                    />
                                </View>
                            </View>
                            {activeCategoryData && activeCategoryData.length >1?
                                renderCategoryData():null
                            }

                        </View>
                    </View>
            </View>
        )

    }


    return(
        <Modal
            visible={props.filterModalVisible}
            animationType="none"
            onRequestClose={() => toggleFilterModalVisible()}>
            <Container style={{ flex: 1 }}>
            <Header style={[theme.header]} androidStatusBarColor='#c8c8c8'>
                <Left>
                    <Button transparent onPress={() => toggleFilterModalVisible()}>
                        <Icon name="arrow-back"   style={{color :'#48BBEC'}} />
                    </Button>
                </Left>
                <Body>
                    <Text>Filter</Text>
                </Body>
            </Header>
            <Content>
                <View style={styles.filterContainer}>
                    {renderFilterBody()}
                </View>
            </Content>
            <Footer style={styles.button}>
                {renderfilterBottom()}
            </Footer>
        </Container>
        </Modal>
    )
}

export default FilterComponent;
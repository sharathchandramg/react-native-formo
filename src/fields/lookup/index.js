import PropTypes from "prop-types";
import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import Form0 from "./../../index";
const _ = require("lodash");
import {isEmpty} from "../../utils/validators";

import {
    View,
    Text,
    Icon,
} from "native-base";

import styles from "./styles"
import SearchComponent from "../../components/search";
import LookupComponent from "../../components/lookup";
import FilterComponent from "../../components/filter";

export default class LookupField extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        updateValue: PropTypes.func,
        theme: PropTypes.object,
        ErrorComponent: PropTypes.func,
        onGetQuery: PropTypes.func,
        onSearchQuery: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            searchModalVisible:false,
            searchText: '',

            activeCategoryData: [],
            activeCategory: null,
            filterModalVisible:false,
        };
    }

    componentDidMount(){
        const { attributes } = this.props;
        if(!isEmpty(attributes) && !isEmpty(attributes['data_source'])){
            const {type,key,url} = attributes['data_source'];
            if(!isEmpty(type) && type ==='remote'){
                this.handleOnGetQuery()
            }
        }
    }

    handleOnGetQuery =()=>{
        const {onGetQuery,attributes} = this.props;
        if(typeof onGetQuery ==='function'){
            onGetQuery(attributes);
        }
    }

    handleOnSearchQuery =(searchText)=>{
        const {onSearchQuery,attributes} = this.props;
        if(typeof onSearchQuery ==='function'){
            onSearchQuery(attributes,searchText)
        }
    }

    setFilterCategory =(item)=>{
        const {attributes} = this.props;
        this.setState({
            activeCategoryData:attributes['options'],
            activeCategory:item

        })
    }

    filterFunction =(item,index,data)=>{
        let activeCategory = this.state.activeCategory;
        switch(activeCategory.type){
            case 'date':{
                if(item.label ==='Custom'){
                    this.setState({customSelection: true, dateFilter:item})
                }else{
                    let period = dateFilterFormater(item.label);
                    item["value"] = period;
                    let filterArr = this.updateFilter(item);
                    let filterData = this.toggleSelect(item)
                    this.setState({filterArr:filterArr,filterData:filterData})    

                }
            }
            break;
            default:{
                 // put the item in filter array in not present.
                 // marked as selected and update the filterData.
                let filterArr = this.updateFilter(item);
                let filterData = this.toggleSelect(item)
                this.setState({filterArr:filterArr,filterData:filterData})   
            }
            break
        }     
    }

    handleTextChange =(searchText)=>{
        this.setState({searchText: searchText},()=>{
            this.handleOnSearchQuery(searchText)
        });
    }

    toggleSearchModalVisible =()=>{
        this.setState({
            searchModalVisible: !this.state.searchModalVisible,
        });
    }

    toggleFilterModalVisible =()=>{
        this.setState({
            filterModalVisible: !this.state.filterModalVisible,
        });
    }

    toggleModalVisible =()=> {
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    }


    toggleSelect =(value)=>{
        const { attributes } = this.props;
        let newSelected = attributes.multiple ? attributes.value : value;
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

        if(this.state.searchModalVisible){
            this.setState({
                searchModalVisible: attributes.multiple ? this.state.searchModalVisible : false,
                modalVisible: attributes.multiple ? this.state.modalVisible : false,
            },() => this.props.updateValue(attributes.name,value));
        }else{
            this.setState({
                modalVisible: attributes.multiple ? this.state.modalVisible : false,
            },() => this.props.updateValue(attributes.name,newSelected));
        }
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

    isFilterEnable =(attributes)=>{
        if(!isEmpty(attributes) && !isEmpty(attributes['additional'])){
            const{filterEnable} = attributes['additional'];
            if(typeof filterEnable !=='undefined' && filterEnable){
                return true;
            }
        }
        return false;

    }

    isSearchEnable =(attributes)=>{
        if(!isEmpty(attributes) && !isEmpty(attributes['additional'])){
            const{searchEnable} = attributes['additional'];
            if(typeof searchEnable !=='undefined' && searchEnable){
                return true;
            }
        }
        return false;
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
                <View style={{ paddingHorizontal:20 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
                <View style={{flex:1,width:'100%',marginHorizontal:-5}}>
                    <Form0 
                        ref={(c) => {this.lookup = c; }} 
                        fields={fields} 
                        formData={data}
                    />
                </View>
                {this.state.modalVisible?
                    <LookupComponent 
                        modalVisible={this.state.modalVisible}
                        theme ={theme}
                        attributes ={attributes}
                        toggleSelect = {this.toggleSelect}
                        toggleModalVisible ={this.toggleModalVisible}
                        toggleSearchModalVisible ={this.toggleSearchModalVisible}
                        toggleFilterModalVisible ={this.toggleFilterModalVisible}
                        searchEnable ={this.isSearchEnable(attributes)}
                        filterEnable ={this.isFilterEnable(attributes)}
                    />: null
                }
                {this.state.searchModalVisible?
                    <SearchComponent
                        searchModalVisible={this.state.searchModalVisible}
                        attributes ={this.state.attributes}
                        theme ={theme}
                        toggleSearchModalVisible={this.toggleSearchModalVisible}
                        handleOnSearchQuery={this.handleOnSearchQuery}
                        searchText = {this.state.searchText}
                        toggleSelect = {this.toggleSelect}
                        handleTextChange ={this.handleTextChange}
                    />
                    : null
                }
                { this.state.filterModalVisible?
                    <FilterComponent 
                        filterModalVisible ={this.state.filterModalVisible}
                        theme ={theme}
                        attributes ={attributes}
                        toggleFilterModalVisible ={this.toggleFilterModalVisible}
                        handleTextChange ={this.handleTextChange}
                        applyFilterFunction ={this.applyFilterFunction}
                        setFilterCategory ={this.setFilterCategory}
                        filterFunction ={this.filterFunction}
                        activeCategoryData ={this.state.activeCategoryData}
                    />: null

                }
            </View>
        );
    }
}
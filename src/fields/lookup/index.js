import PropTypes from "prop-types";
import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import Form0 from "./../../index";
const _ = require("lodash");

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
        const { attributes,} = this.props;
        this.setState({attributes:attributes})
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

    handleOnSearchQuery =(searchText)=>{
        
    }

    handleTextChange =(searchText)=>{
        const {labelKey,options} = this.state.attributes;
        let updatedOption = [];
        updatedOption = _.filter(options,(item)=>{
            let sItem = (item[labelKey]).toString().toLowerCase().search(searchText.trim().toLowerCase()) > -1;
            if(sItem) {
                return item;
            }
        })

        if(searchText && updatedOption.length){
            this.state.attributes['options'] = [...updatedOption]
            this.setState({searchText: searchText, attributes: {...this.state.attributes}})
        }else{
            this.setState({searchText: searchText,attributes: {...this.props.attributes}})
        }
    }

    toggleSelect=(value)=> {
        if(this.state.searchModalVisible){
            const attributes = this.props.attributes;
            this.setState({
                searchModalVisible: attributes.multiple ? this.state.modalVisible : false,
                modalVisible: attributes.multiple ? this.state.modalVisible : false,
            },() => this.props.updateValue(this.props.attributes.name,value));
        }else{
            const attributes = this.props.attributes;
            this.setState({
                modalVisible: attributes.multiple ? this.state.modalVisible : false,
            },() => this.props.updateValue(this.props.attributes.name,value));
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
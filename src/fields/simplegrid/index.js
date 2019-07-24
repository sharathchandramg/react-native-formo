import PropTypes from "prop-types";
import React, { Component } from "react";
import {TouchableOpacity } from "react-native";
import {
    View,
    Text,
    Icon,
} from "native-base";
import styles from "./styles"

import Grid from "../../components/grid";
import {isEmpty} from "../../utils/validators";


export default class SimpleGrideView extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        updateValue: PropTypes.func,
        theme: PropTypes.object,
        ErrorComponent: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state={
            modalVisible:false,
            selectedItm:{},
            data: {},
        }
    }

    componentDidMount(){
        const { attributes } = this.props;
        if(attributes){
            const data = this.getGridData();
            if(Object.keys(data).length){
                this.setGridData(data) 
            }
        }
    }

    getGridData =()=>{
        const { attributes } = this.props;
        let data = {};
        if(attributes){
            if(!isEmpty(attributes['value']) && !isEmpty(attributes['value']['data'])){
                data =  attributes['value']['data'];
            }else{
                if(!isEmpty(attributes['data'])){
                    data =  attributes['data'];
                }
            }
        }
        return data;
    }

    onChangeText = (rk,ck,text)=>{
        let data = this.state.data;
        let selectedItm = this.state.selectedItm;
        let preColVal = data[rk][ck];
        let preColSum = data[`${String.fromCharCode(931)}`][ck];
        data[rk][ck] = text;
        const header_type = data['type'];
        const ck_type = header_type[ck];
        
        if(ck_type.toLowerCase() ==='number'){
            if(text){
                if(preColVal){
                    const diff = Math.abs(`${parseInt(preColVal) - parseInt(text)}`)
                    data[`${String.fromCharCode(931)}`][ck] = parseInt(preColSum) + parseInt(diff);
                }else{
                    data[`${String.fromCharCode(931)}`][ck] = parseInt(preColSum) + parseInt(text);
                }
            }else{
                data[`${String.fromCharCode(931)}`][ck] = parseInt(preColSum) - parseInt(preColVal);
            }
        }
        selectedItm[rk] = data[rk];
        this.setState({data:data,selectedItm:selectedItm})
    }

    setGridData =(data)=>{
        const header = data['header'];
        const header_type = data['type'];
        let summary = {}
        Object.keys(header).map((ck)=>{
            let ckTotal = 0;
            Object.keys(data).map((rk)=>{
                if(!rk.match(/header/) && !rk.match(/style/) && !rk.match(/type/) && rk !== `${String.fromCharCode(931)}`){
                    if(header_type && header_type[ck].toLowerCase()==='number'){
                        const ckValue = data[rk][ck];
                        if(ckValue){
                            ckTotal =  parseInt(ckTotal) +  parseInt(ckValue);
                        }
                    }
                }
            })
            summary[`${ck}`] = ckTotal;
        })
        data[`${String.fromCharCode(931)}`] = summary;
        this.setState({data:data})
    
    }

    handleOnDoneClick=()=>{
        let summary = {
            label: this.getSummaryLabel(),
            data: this.state.data,
        }
        this.props.updateValue(this.props.attributes.name, summary);
        this.toggleModal()
    }

    toggleModal = () => {
        if (this.state.modalVisible) {
            this.setState({
                modalVisible: false,
            });
        } else {
            const { attributes } = this.props;
            if(attributes){
                const data = this.getGridData();
                if(Object.keys(data).length){
                    this.setGridData(data) 
                }
            }
            this.setState({modalVisible:true});
        }
    };

    getLabel =(value)=>{
        let label = "None"
        if(typeof value !=='undefined' && value && Object.keys(value).length){
            return value.label?value.label:'None';
        }
        return label;
    }


    renderChecklistIcon = () => {
        return (
            <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => this.toggleModal()}
            >
                <Icon
                    name="ios-arrow-forward"
                    style={styles.iconStyle}
                />
            </TouchableOpacity>
        );
    };

    getSummaryLabel =()=>{
        const data = this.state.data;
        let rowLabel = '';
        if(data && Object.keys(data).length){
            const summaryRow = data[`${String.fromCharCode(931)}`];
            const header_type = data['type']
            Object.keys(summaryRow).map((key)=>{
                const type = header_type[key];
                let colLabel = '';
                if(type.toLowerCase()==='number'){
                    colLabel = `${key} : ${summaryRow[key]}`
                    if(rowLabel && rowLabel.length){
                        rowLabel =  `${rowLabel}, ${colLabel}`
                    }else{
                        rowLabel = `${colLabel}`
                    }
                }
            })
        }
        return rowLabel;
    }

    // added now

    getTableHeader =(data)=>{
		let tableHeader = [];
		if(data && Object.keys(data).length && !isEmpty(data["header"])){
			const header = data["header"];
			Object.keys(header).map((hk)=>{
				let headerCell = {
						rowKey: '#',
						colKey:hk,
						type: 'string',
						value: header[hk],
						editable: false,
				}
				tableHeader.push(headerCell)
			});
		}
		if(tableHeader.length){
			tableHeader.unshift({
				rowKey: '#',
				colKey:'#',
				type: 'string',
				value: '#',
				editable: false,
			})
		}
		return tableHeader
	}

	getRowTitle = (data)=>{
		let tableTitle = [];
		if(data && Object.keys(data).length){
			Object.keys(data).map((rk) => {
				if(!rk.match(/header/) && !rk.match(/style/) && !rk.match(/type/) && rk !== `${String.fromCharCode(931)}`){
					let titleCell = {
						rowKey: rk,
						colKey: '',
						type: 'string',
						value: rk,
						editable: false,
					}
					tableTitle.push(titleCell);
				}
			});
		}
		return tableTitle;
	}

	getTableData =(data)=>{
		let tableData = [];
		if(data && Object.keys(data).length && !isEmpty(data["type"])){
			Object.keys(data).map((rk) => {
				if(!rk.match(/header/) && !rk.match(/style/) && !rk.match(/type/) && rk !== `${String.fromCharCode(931)}`){
					let dataItem = {};
					dataItem['name']= rk;
					let value = []
					Object.keys(data[rk]).map((ck) => {
						let dataCell = { 
							rowKey:rk,
							colKey:ck,
							type:data.type[ck],
							value: data[rk][ck],
							editable: rk == `${String.fromCharCode(931)}`? false: true
						}
						value.push(dataCell);
					})
					dataItem['data'] = value;
					tableData.push(dataItem)
				}
			})
		}
		return tableData;
	}

	getHeaderWidth = (data)=>{
		let widthArr = [];
		if(data && Object.keys(data).length && !isEmpty(data["style"])){
			const column_width = data['style']['column_width'];
			widthArr = Object.keys(column_width).map((key)=>{
				return parseInt(column_width[key])
			})
		}else{
			if(!isEmpty(data["header"])){
				const len = Object.keys(data['header']).length ;
				for(let i = 0 ; i < len; i++){
					widthArr.push(100)
				}
			}
        }

		return widthArr;
	}

	getRowHeight =(data)=>{
		let height = 40;
		if(data && Object.keys(data).length && !isEmpty(data["style"])){
			if(!isEmpty(data["style"]['row_height'])){
				height = parseInt(data['style']['row_height']);
			}
		}
		return height;
	}

    render() {

        const { theme, attributes, ErrorComponent } = this.props;

        return (
            <View  style = {styles.container}>
                <View style = {styles.inputLabelWrapper}>
                    <TouchableOpacity
                        style={[styles.inputLabel]}
                        error={
                            theme.changeTextInputColorOnError
                                ? attributes.error
                                : null
                        }
                        onPress={() => this.toggleModal()}
                    >
                        <View style = {styles.labelTextWrapper}>
                            <Text style={[styles.labelText]} numberOfLines={2}>{attributes.label}</Text>
                        </View>
                        <View style={styles.valueWrapper}>
                            <Text style={styles.inputText} numberOfLines={2}>{this.getLabel(attributes.value)} </Text>
                        </View>
                        {this.renderChecklistIcon()}
                    </TouchableOpacity>
                </View>
                {this.state.modalVisible && <Grid 
                        modalVisible={this.state.modalVisible}
                        theme={theme}
                        attributes={attributes}
                        toggleModalVisible={this.toggleModal}
                        data ={this.state.data}
                        onChangeText={this.onChangeText}
                        handleOnDoneClick={this.handleOnDoneClick}
                        summary = {this.getSummaryLabel()}
                        rowHeight   = {this.getRowHeight(this.state.data)}
                        widthArr    = {this.getHeaderWidth(this.state.data)}
                        tableHeader = {this.getTableHeader(this.state.data)}
                        rowTitle    = {this.getRowTitle(this.state.data)}
                        tableData   = {this.getTableData(this.state.data)}
                    /> }
                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}

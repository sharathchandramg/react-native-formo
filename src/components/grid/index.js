import PropTypes from "prop-types";
import React, { Component } from "react";
import {
	Modal,
	TouchableOpacity,
	View,
	ScrollView
} from "react-native";

import {
	Text,
	Container,
	Header,
	Content,
	Left,
	Right,
	Icon,
	Body,
	Button,
	Title,
	Footer
} from "native-base";

import styles from "./styles";
import { Row, Rows } from "./rows";
import { Table, TableWrapper } from "./table";
import { Col } from "./cols";
import {isEmpty} from "../../utils/validators"


const SimpleGrid = props => {
	const { 
		attributes, 
		theme,
		modalVisible, 
		toggleModalVisible, 
		onChangeText,
		handleOnDoneClick,
		data,
		summary,
	} = props



	getTableHeader =()=>{
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

	getTableTitle = ()=>{
		let tableTitle = [];
		if(data && Object.keys(data).length){
			Object.keys(data).map((rk) => {
				if(!rk.match(/header/) && !rk.match(/style/) && !rk.match(/header_type/) && rk !== `${String.fromCharCode(931)}`){
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

	getTableData =()=>{
		let tableData = [];
		if(data && Object.keys(data).length && !isEmpty(data["header_type"])){
			Object.keys(data).map((rk) => {
				if(!rk.match(/header/) && !rk.match(/style/) && !rk.match(/header_type/) && rk !== `${String.fromCharCode(931)}`){
					let dataItem = {};
					dataItem['name']= rk;
					let value = []
					Object.keys(data[rk]).map((ck) => {
						let dataCell = { 
							rowKey:rk,
							colKey:ck,
							type:data.header_type[ck],
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

	getTableHeaderWidth = ()=>{
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

	getTableRowHeight =()=>{
		let height = 40;
		if(data && Object.keys(data).length && !isEmpty(data["style"])){
			if(!isEmpty(data["style"]['row_height'])){
				height = parseInt(data['style']['row_height']);
			}
		}
		return height;
	}

	let widthArr = getTableHeaderWidth();
	widthArr.unshift(100)


	renderGridView =()=>{
		return(
			<ScrollView horizontal={true}>
				<View>
					<Table>
						<Row 
							data ={getTableHeader()} 
							widthArr={widthArr}
							height={this.getTableRowHeight()}
							backgroundColor={'#48BBEC'}
						/>
					</Table>
					<ScrollView style={styles.dataWrapper}>
						<TableWrapper style={styles.wrapper}>
							<Table>
								<Col 
									data={getTableTitle()} 
									theme={attributes.theme} 
									wth={widthArr[0]}
									height={this.getTableRowHeight()}
								/>
							</Table>
							<ScrollView style={styles.dataWrapper}>
								<Rows 
									data={getTableData()} 
									theme={attributes.theme}
									onChangeText= {onChangeText}
									widthArr={getTableHeaderWidth()}
									height={this.getTableRowHeight()}
								/>
							</ScrollView>
						</TableWrapper>
					</ScrollView>
				</View>	
			</ScrollView>	
		)
	}

	return (
		<Modal
			visible={modalVisible}
			animationType="none"
			onRequestClose={() => toggleModalVisible()}
		>
			<Container style={{ flex: 1 }}>
				<Header style={[theme.header]} androidStatusBarColor="#c8c8c8">
					<Left>
						<Button transparent onPress={() => toggleModalVisible()}>
							<Icon name="arrow-back" style={{ color: "#48BBEC" }} />
						</Button>
					</Left>
					<Body>
						<Title style={theme.headerText}>
							{attributes.label || "Select"}
						</Title>
					</Body>
				</Header>
				<Content style={{marginBottom:150}}>
					<View style={styles.container}>
						{data && Object.keys(data).length ? renderGridView(): null}
					</View>
				</Content>
				<Footer style={styles.footer}>
					<View style={styles.aggregateWrapper}>
						<View style={styles.aggregateTextWrapper}>
							<Text style={styles.summaryText}>{summary?summary:''}</Text>
						</View>
					</View>
					<TouchableOpacity style={styles.button} onPress={() => handleOnDoneClick()}>
						<Text style={styles.buttonText}>{'SAVE'} </Text>
					</TouchableOpacity>
                </Footer>
			</Container>
		</Modal>
	);
};

export default SimpleGrid;


import React from "react";
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
		tableHeader,
		rowHeight,
		widthArr,
		rowTitle,
		tableData
	} = props

	let headerWidthArr = [...widthArr];
	headerWidthArr.unshift(100)

	renderGridView =()=>{
		return(
			<ScrollView 
				directionalLockEnabled={false} 
				horizontal={true}
			>
				<View>
					<Table>
						<Row 
							data ={tableHeader} 
							widthArr={headerWidthArr}
							height={rowHeight}
							backgroundColor={'#48BBEC'}
						/>
					</Table>
					<View style={styles.dataWrapper}>
						<TableWrapper style={styles.wrapper}>
							<Table>
								<Col 
									data={rowTitle} 
									theme={attributes.theme} 
									wth={headerWidthArr[0]}
									height={rowHeight}
								/>
							</Table>
							<View style={styles.dataWrapper}>
								<Rows 
									data={tableData} 
									theme={attributes.theme}
									onChangeText= {onChangeText}
									widthArr={widthArr}
									height={rowHeight}
								/>
							</View>
						</TableWrapper>
					</View>
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
					<Right></Right>
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


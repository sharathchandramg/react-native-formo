
import React from "react";
import {
	TouchableOpacity,
	View,
	ScrollView
} from "react-native";

import { Text } from "native-base";
import CustomHeader from '../headers/header'
import styles from "./styles";
import { Row, Rows } from "./rows";
import { Table, TableWrapper } from "./table";
import { Col } from "./cols";

const GridComponent= props => {
	const { 
		attributes, 
		toggleEditModal,
		handleOnDoneClick,
		data,
		summary,
		tableHeader,
		rowHeight,
		widthArr,
		rowTitle,
		tableData
	} = props

	const headerWidthArr = [...widthArr];
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
							rowNumber={0}
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
									toggleEditModal= {toggleEditModal}
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
    <View style={styles.modalContent}>
      <CustomHeader {...props} />
      <View style={{ marginBottom: 150, flex: 1 }}>
        <ScrollView>
          <View style={styles.container}>
            {data && Object.keys(data).length ? renderGridView() : null}
          </View>
        </ScrollView>
      </View>
      <View style={styles.aggregateWrapper}>
        <View style={styles.aggregateTextWrapper}>
          <Text style={styles.summaryText}>{summary ? summary : ""}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleOnDoneClick()}
      >
        <Text style={styles.buttonText}>{"Done"} </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GridComponent;
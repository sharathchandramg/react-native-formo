import React from "react";
import { View} from "react-native";
import { Cell } from "./cell";
import {sum} from "../../utils/validators"

import styles from "./styles";

export const Row = props =>{
	const { data, theme,onChangeText,widthArr,height,backgroundColor } = props;
	let width = widthArr ? sum(widthArr) : 0;
	return data.length ? (
		<View style={[styles.row, height && { height }, width && { width }, backgroundColor && {backgroundColor}]}>
			{data.map((item, i) => {
				const wth = widthArr && widthArr[i];
			return (
				<Cell
					rowKey={item['rowKey']}
					colKey={item['colKey']}
					type={item['type']}
					value={item['value']}
					key={i}
					editable={item['editable']}
					theme={theme}
					onChangeText= {onChangeText}
					width ={wth}
					height={height}
				/>
			);
			})}
		</View>
	) : null;
	
}

export const Rows = props =>{
	const { data, theme,onChangeText, widthArr ,height} = props;
	return data ? (
		<View style={{paddingTop :1}}>
			{data.map((item, i) => {
				return (
					<Row
						key={i}
						data={item['data']}
						theme={theme}
						onChangeText= {onChangeText}
						widthArr={widthArr}
						height ={height}
						backgroundColor={ i%2 == 0 ?'#E1FBFF':'white'} 
					/>
				);
			})}
		</View>
	) : null;

}


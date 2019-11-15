import React from "react";
import { View, Text,Platform } from "react-native";
import styles from "./styles";

export const Cell  = props =>{
	const {keyIndex, type, value,width,height,color } = props
	const textboxStyle = (Platform.OS ==='android')? 
		[styles.textBox,color && {color}, height && {height}]

		: [styles.textBoxIos,color && {color}]
	return (
		<View style={[styles.cellTextBox,{width:width,height:height}]} key={keyIndex}>
			<Text style={textboxStyle} >
				{value}
			</Text>
		</View>
	);
}
import React from "react";
import { View, TextInput,Text} from "react-native";
import styles from "./styles";

export const Cell  = props =>{
	const { rowKey, colKey, type, value, editable,onChangeText,width,maxLength,height,color } = props
	let keyboardType = 'default';
	let textAlin = 'left'
	if(type.toLowerCase()==='number'){
		keyboardType = 'numeric';
		textAlin = 'center'
	}

	if(editable){
		return(
			<View style={[styles.cell,{width:width,height:height}]}>
				<View style={[styles.inputBoxWrapper,{width:width,height:height}]}>
					<TextInput
						style={[styles.inputBox,{textAlign: textAlin}]}
						underlineColorAndroid="transparent"
						numberOfLines={5}
						maxLength={maxLength}
						multiline={true}
						autoGrow={true}
						maxHeight={100}
						keyboardType={keyboardType}
						placeholder={'______'}
						placeholderTextColor={'#FA9917'}
						editable={editable}
						onChangeText={text => onChangeText(rowKey,colKey,text)}
						value={ value!== null && value.toString()}
					/>
				</View>
				
			</View>
		)
		
	}else{
		return (
			<View style={[styles.cellTextBox,{width:width,height:height}]}>
				<Text style={[styles.textBox, color && {color}]}>
					{value}
				</Text>
			</View>
		);
	}
}


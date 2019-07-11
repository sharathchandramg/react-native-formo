import React from "react";
import { View, TextInput,Text} from "react-native";
import styles from "./styles";

export const Cell  = props =>{
	const { rowKey, colKey, type, value, editable,onChangeText,width,maxLength } = props
	let keyboardType = 'default';
	let textAlin = 'left'
	if(type.toLowerCase()==='number'){
		keyboardType = 'numeric';
		textAlin = 'center'
	}

	if(editable){
		return(
			<View style={[styles.cell,{width:width}]}>
				<View style={styles.inputBoxWrapper}>
					<TextInput
						style={[styles.inputBox,{textAlign: textAlin}]}
						underlineColorAndroid="transparent"
						numberOfLines={2}
						maxLength={maxLength}
						keyboardType={keyboardType}
						placeholder={'____'}
						placeholderTextColor={'#FA9917'}
						editable={editable}
						onChangeText={text => onChangeText(rowKey,colKey,text)}
						value={value.toString()}
					/>
				</View>
				
			</View>
		)
		
	}else{
		return (
			<View style={[styles.cell,{width:width}]}>
				<Text style={styles.textBox}>
					{value}
				</Text>
			</View>
		);
	}
}


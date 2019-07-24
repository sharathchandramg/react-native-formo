import React from "react";
import { View, TextInput,Text,TouchableOpacity,Platform } from "react-native";
import styles from "./styles";

export const Cell  = props =>{
	const { rowKey, colKey, type, value, editable,onChangeText,width,maxLength,height,color } = props

	let keyboardType = 'default';
	let textAlign = 'left';

	if(type.toLowerCase()==='number'){
		keyboardType = 'numeric';
		textAlign = 'center';
	}

	let inboxStyle = (Platform.OS ==='android')? 
		[styles.inputBox, color && {color},{textAlign:textAlign,height:height}]
		: [styles.inputBoxIos, color && {color},{textAlign:textAlign}]
	
	let textboxStyle = (Platform.OS ==='android')? 
		[styles.textBox,color && {color}, height && {height}]
		: [styles.textBoxIos,color && {color}]


	if(editable){
		return(
			<TouchableOpacity  
				style={[styles.cell,{width:width,height:height}]}
				activeOpacity={1}
				onPress={()=> this[`textInput${rowKey}${colKey}`].focus()}>
				<View 
					style={[styles.inputBoxWrapper,{width:width,height:height}]} 
					pointerEvents="none">
						<TextInput
							style={inboxStyle}
							underlineColorAndroid="transparent"
							numberOfLines={5}
							maxLength={maxLength}
							multiline={true}
							keyboardType={keyboardType}
							placeholder={'______'}
							placeholderTextColor={'#FA9917'}
							editable={editable}
							onChangeText={text => onChangeText(rowKey,colKey,text)}
							value={ value!== null && value.toString()}
							ref={input => this[`textInput${rowKey}${colKey}`] = input}
						
						/>
				</View>
			</TouchableOpacity>
		)
		
	}else{
		return (
			<View style={[styles.cellTextBox,{width:width,height:height}]}>
				<Text style={textboxStyle}>
					{value}
				</Text>
			</View>
		);
	}
}

import React from "react";
import {
	TouchableOpacity,
    View,
    Text,
    Platform
} from "react-native";

import { Input } from "native-base";
import CustomHeader from '../headers/header'
import styles from "./styles";
import {isEmpty} from "../../utils/validators";

const EditComponent = props => {
	const { 
        theme,
        rowData,
        onChangeText,
        handleOnSaveClick,
    } = props

    
	renderItemList =(rowData)=>{
        return rowData ? (
            <View style={{ borderBottomWidth: 0, paddingVertical: 5, flex:1, }} >
                <View style={{marginVertical:20,marginHorizontal:10}}>
                    <Text style={styles.topLabel}>
                        {rowData[0]['rowKey']||''}
                    </Text>
                </View>
                
                {rowData.map((item, i) =>{
                    const keyboardType =  item['type'] && item['type'].toLowerCase()==='number'? 'numeric': 'default';
                    const editable = !item['editable'] ? item['editable'] : true;
                    return(
                        <View key ={`${item['rowKey']+""+item['colKey']}`} style={{flex:1,marginBottom:5}}>
                            <View style={{height:50}}>
                                <Input
                                    style={{
                                        height:Platform.OS === 'ios' ? undefined : null,
                                        paddingStart:5,
                                    }}
                                    underlineColorAndroid="transparent"
                                    numberOfLines={5}
                                    maxLength={100}
                                    multiline={true}
                                    placeholder={item['colKey']||'None'}
                                    placeholderTextColor={theme.inputColorPlaceholder}
                                    onChangeText={text => onChangeText(item['rowKey'] ,item['colKey'],text)}
                                    value={item['value']}
                                    keyboardType={keyboardType}
                                    editable={editable}
                                
                                />
                            </View>
                        </View>
                    )})
                } 
            </View>
        ):null
	}

	return (
		<View style={styles.modalContent}>
				<CustomHeader {...props } />
				<View style={{marginBottom:50, flex: 1}}>
					<View style={styles.container}>
						{!isEmpty(rowData) && Array.isArray(rowData)? renderItemList(rowData): null}
					</View>
				</View>
                <TouchableOpacity style={styles.button} onPress={() => handleOnSaveClick()}>
                    <Text style={styles.buttonText}>{'SAVE'} </Text>
                </TouchableOpacity>
			</View>
		
	);
};

export default EditComponent;
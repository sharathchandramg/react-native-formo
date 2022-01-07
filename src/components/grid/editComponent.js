
import React from "react";
import {
	TouchableOpacity,
    View,
    Text,
    Platform
} from "react-native";

import {
	Container,
	Content,
    Item,
    Input,
    Title
} from "native-base";
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
            <View style={{ borderBottomWidth: 0, paddingVertical: 5 }} >
                <View style={{marginVertical:20,marginHorizontal:10}}>
                    <Title style={styles.topLabel}> 
                        {rowData[0]['rowKey']||''}
                    </Title>
                </View>
                
                {rowData.map((item, i) =>{
                    const keyboardType =  item['type'] && item['type'].toLowerCase()==='number'? 'numeric': 'default';
                    const editable = !item['editable'] ? item['editable'] : true;
                    return(
                        <View key ={`${item['rowKey']+""+item['colKey']}`} style={{flex:1,marginBottom:5}}>
                            <Item style={{height:50}}>
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
                            </Item>
                        </View>
                    )})
                } 
            </View>
        ):null
	}

	return (
		<Container style={{ flex: 1 }}>
				<CustomHeader {...props } />
				<Content style={{marginBottom:50}}>
					<View style={styles.container}>
						{!isEmpty(rowData) && Array.isArray(rowData)? renderItemList(rowData): null}
					</View>
				</Content>
                <TouchableOpacity style={styles.button} onPress={() => handleOnSaveClick()}>
                    <Text style={styles.buttonText}>{'SAVE'} </Text>
                </TouchableOpacity>
			</Container>
		
	);
};

export default EditComponent;



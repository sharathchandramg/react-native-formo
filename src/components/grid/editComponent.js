
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
    Footer,
    Item,
    Input
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
            <View style ={{flex:1}} >
                <Text style={styles.topLabel}
                > 
                    {rowData[0]['rowKey']||''}
                </Text>
                {rowData.map((item, i) =>{
                    const keyboardType =  item['type'] && item['type'].toLowerCase()==='number'? 'numeric': 'default';
                    const editable = !item['editable'] ? item['editable'] : true;
                    return(
                        <Item
                            key ={`${item['rowKey']+""+item['colKey']}`}
                            style={{height:40,width:'90%',marginBottom:5}}>
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
                    )})
                } 
            </View>
        ):null
	}

	return (
		<Container style={{ flex: 1 }}>
				<CustomHeader {...props } />
				<Content style={{marginBottom:150}}>
					<View style={styles.container}>
						{!isEmpty(rowData) && Array.isArray(rowData)? renderItemList(rowData): null}
					</View>
				</Content>
				<Footer style={[styles.footer,{borderTopWidth:0, height:50,}]}>
					<TouchableOpacity style={styles.button} onPress={() => handleOnSaveClick()}>
						<Text style={styles.buttonText}>{'SAVE'} </Text>
					</TouchableOpacity>
                </Footer>
			</Container>
		
	);
};

export default EditComponent;



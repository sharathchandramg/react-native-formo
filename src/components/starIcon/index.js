import React from 'react';
import {Text,View} from 'native-base';
import styles from './styles';

const StarIcon = (props)=>{
    const required = props['required'];
    if(typeof required !=='undefined' && required){
        return(
            <View style={styles.iconStyleWrapper}>
                <Text style={styles.iconStyle}>
                {'*'}
                </Text>
            </View>
        )
    }
    return null;
}

export default StarIcon;
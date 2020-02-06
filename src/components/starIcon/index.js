
import React from 'react';
import {Text} from 'native-base';
import styles from './styles';

const StarIcon = (props)=>{
    const required = props['required'];
    if(typeof required !=='undefined' && required){
        return(
            <Text style={styles.iconStyle}>
                {'*'}
            </Text>
        )
    }
    return null;
}

export default StarIcon;
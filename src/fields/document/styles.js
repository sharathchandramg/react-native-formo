import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    topContainer: {
        width: '90%',
        marginHorizontal: 20,
    },
    valueContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconStyle: {
        fontFamily: 'roboto',
        alignSelf: 'flex-end',
        marginEnd:5,
    },
    fileTopWrapper:{
        height: 40,
        marginBottom: 10,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        borderWidth: 1, 
    },
    fileInnerWrapper:{
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    fileIconWrapper:{
        width: '25%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',  
    }
});

export default styles;

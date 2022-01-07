import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    noDataWrapper: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    nodataText: {
        height: 30,
        lineHeight: 20,
        color: '#989898',
        fontFamily: 'roboto',
        width: '100%',
        fontSize: 14,
        padding: 5,
        fontWeight: '700',
        alignSelf: 'center',
        textAlign: 'center',
    },
    searchForWrapper:{
        width: '100%',
        height:60,
        paddingLeft:20,
        marginBottom:20,
        backgroundColor: '#FFF',
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.22,
        shadowRadius: 4,
        elevation: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
            },
            android: {
                shadowColor: '#E0E0E0',
            },
        }),
    },
    searchForButton:{
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        height:'100%'
    },
    searchForText:{
        height: 30,
        lineHeight: 20,
        color: '#989898',
        fontFamily: 'roboto',
        fontSize: 14,
        padding: 5,
        fontWeight: '700',
        alignSelf: 'center',
        textAlign: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        flexDirection: 'column',
        borderTopWidth: 2,
        borderColor: '#d6d7da',
        elevation: 20,
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        bottom: 0,
    },
});

export default styles;

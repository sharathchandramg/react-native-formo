import {
    StyleSheet,
    Dimensions
} from "react-native";

const styles = StyleSheet.create({

    container:{
        minHeight:80,
        alignItems:'flex-start',
        justifyContent:'center',
        marginBottom:10,
        marginHorizontal:15,
    },

    rightIcon:{
        alignItems: 'flex-end',
        justifyContent: 'center',
        width:'50%'
    },

    iconStyle:{
        fontFamily:'roboto',
        alignSelf:'flex-end',
        color:'#41E1FD',
        marginEnd:15,
    },
    iconStyle:{
        fontFamily:'roboto',
        alignSelf:'flex-end',
        fontSize: 16,
        lineHeight:20,
        color:'#41E1FD',
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        margin: 0,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },

    valueText:{
        fontSize:15,
        lineHeight:20,
        minHeight:40,
        width:'100%',
        color: '#575757',
        fontFamily:'roboto',
        alignSelf: 'flex-start',
        fontWeight:'100',
        marginHorizontal:5,
    },

    buttonText:{
        fontFamily:'roboto',
        color:'white',
        alignSelf:'center',
        fontSize:14

    }
})

export default styles;
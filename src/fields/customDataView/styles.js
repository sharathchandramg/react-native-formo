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
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        margin: 0,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },

    buttonText:{
        fontFamily:'roboto',
        color:'white',
        alignSelf:'center',
        fontSize:14

    }
})

export default styles;
import {
    StyleSheet,
    Dimensions
} from "react-native";



const styles = StyleSheet.create({
    container:{
        marginHorizontal:15,
        borderBottomWidth:0.5,
        borderBottomColor:'#D9D5DC',
        margin:10,
        

    },
    textStyle:{
        color:'blue',
        fontFamily:'roboto',
        alignSelf:'flex-start',
        fontSize:12,
        lineHeight:16,
        height:16,
        flex:1,
    },
    placeHolder:{
        color:  '#ADADAD',
        alignSelf:'flex-start',
        marginLeft: -10
    },
    valueContainer:{
        padding:5,
        marginLeft:10,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex:1,
    }
});

export default styles;
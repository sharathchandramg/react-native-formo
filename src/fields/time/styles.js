import {
    StyleSheet,
    Dimensions
} from "react-native";



const styles = StyleSheet.create({
    container:{
        borderBottomWidth:0.5,
        borderBottomColor:'#D9D5DC',
    },
    textStyle:{
        color:'blue',
        fontFamily:'roboto',
        alignSelf:'flex-start',
        // fontSize:16,
        lineHeight:16,
        height:16,
    },
    placeHolder:{
        color:  '#ADADAD',
        // alignSelf:'flex-start',
        paddingHorizontal:5,
        // fontSize:16
        
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
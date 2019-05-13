import {
    StyleSheet,
    Dimensions
} from "react-native";

const styles = StyleSheet.create({

    filterContainer:{
        flexDirection:'row', 
        height: 50,
        alignItems:'center',
        justifyContent:'flex-start',
        margin:10,
        flex:1,
    },

    selectedContainer:{
        flexDirection:'row', 
        height: 40,
        flex:1,
        alignItems:'flex-start',
        justifyContent:'center',
        marginEnd:5
    },

    selectedStatusOuter: {
        height: 30,	
        flexDirection:'row',
        width:'100%',
        backgroundColor: '#6AD97B',
        borderRadius:50,
        borderColor: 'white',
        borderWidth: 1,
        justifyContent:'center',
        alignItems:'center',
        margin:5,
    },

    selectedText:{
        color: 'white',
        fontFamily: 'roboto',
        paddingLeft:10,
        paddingRight:10,
        alignItems:'center',
        fontSize:12,
    },

    removeFilterIcon:{
        alignItems:'center',
        justifyContent:'center',
        height:30,
        width:30,
        marginEnd:10
    },
    
})

export default styles;
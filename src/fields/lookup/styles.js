import {
    StyleSheet,
    Dimensions
} from "react-native";

const styles = StyleSheet.create({
    container:{
        minHeight:40,
        alignItems:'flex-start',
        justifyContent:'center',
        marginTop:15,
        marginHorizontal:5,
    },
    
    inputField:{
        minHeight:60,
        width:'100%',
        alignItems:'flex-start',
        justifyContent:'flex-start',
        borderBottomColor: '#D9D5DC',
        borderBottomWidth:1,
        marginHorizontal:5,
    },

    errorField:{
        height:20,
        width:'100%',
        alignItems:'flex-start',
        justifyContent:'flex-start',
        
    },

    inputLabel:{
        height:30,
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        paddingTop:10,
        marginHorizontal:15,
    },
    inputValue:{
        minHeight:40,
        width:'100%',
        flexDirection:'row',
        paddingBottom:2,
    },


    labelText:{
        fontSize: 16,
        lineHeight:20,
        height:20,
        width:'50%',
        color: '#ADADAD',
        fontFamily:'roboto',
        alignSelf: 'flex-start',
        fontWeight:'300',
        marginHorizontal:5,
    },

    inputText:{
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

    image: {
        height:100,
        width:'100%'
    },

    valueContainer:{
        alignItems: 'center',
        justifyContent: 'flex-start',
        width:'50%',
        marginEnd:15,
        backgroundColor:'green'
    },

    iconStyle:{
        fontFamily:'roboto',
        alignSelf:'flex-end',
        width:'30%',
        fontSize: 16,
        lineHeight:20,
        height:20,
        color:'#41E1FD',
    },

    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        margin: 0,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    
    topContainer: {
        overflow: 'hidden',
        marginBottom:5,
        height: 150,
        width:'100%',
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        borderRadius: 4,
        paddingVertical: 10,
        borderWidth:1,
        borderColor: 'grey',
    },
})

export default styles;
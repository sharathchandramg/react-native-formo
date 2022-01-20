import {
    StyleSheet,
    Dimensions
} from "react-native";

const styles = StyleSheet.create({
    container:{
        minHeight:40,
        alignItems:'flex-start',
        justifyContent:'center',
        marginVertical:10,
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

    inputLabelWrapper:{
        height:56,
        width:'92%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#41E1FD',
        marginHorizontal:10,
        borderColor: '#D9D5DC',
        borderWidth:1,
        borderRadius:4,
    },

    inputLabel:{
        height:50,
        width:'99%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        elevation:4,
        borderRadius:4,
        shadowColor: "#000",
        shadowOpacity:0.2,
        shadowRadius:4,
        backgroundColor:'white',
        shadowOffset: {width:0, height:0},
        paddingStart:5
    },

    labelTextWrapper:{
        height:50,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        // paddingLeft:5
    },

    valueWrapper:{
        width:'60%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
    },

    iconWrapper: {
        height:50,
        flexDirection:'row',
        width:'7%',
        alignItems:'center',
        justifyContent:'flex-start',
    },

    labelText:{
        fontSize: 18,
        lineHeight:20,
        minHeight:20,
        color: '#ADADAD',
        fontFamily:'roboto',
        textAlign: 'left',
        fontWeight:'300',
        paddingStart:5,
        flex:1
    },

    iconStyle:{
        fontFamily:'roboto',
        alignSelf:'center',
        width:'25%',
        fontSize: 18,
        lineHeight:20,
        height:20,
        color:'#41E1FD',
    },

    inputValue:{
        minHeight:40,
        width:'100%',
        flexDirection:'row',
        paddingBottom:2,
    },

    inputText:{
        fontSize:15,
        lineHeight:20,
        minHeight:20,
        color: '#575757',
        fontFamily:'roboto',
        alignSelf:'center',
        fontWeight:'100',
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
    modalContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    modalPreview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
})

export default styles;
import {
    StyleSheet,
    Dimensions
} from "react-native";

const styles = StyleSheet.create({
    container:{
        minHeight:80,
        alignItems:'flex-start',
        justifyContent:'center',
        marginVertical:10,
        marginHorizontal:15,
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
        width:'95%',
        flexDirection:'row',
        paddingBottom:5,
        alignItems:'center',
        justifyContent:'flex-start',
        paddingEnd:10
    },

    inputValue:{
        minHeight:30,
        width:'100%',
        flexDirection:'row',
        paddingBottom:2,
    },

    subformText:{
        fontSize: 14,
        lineHeight:16,
        height:16,
        width:'95%',
        color: '#575757',
        fontFamily:'roboto',
        alignSelf: 'stretch',
        fontWeight:'300',
        marginHorizontal:5,
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
        alignItems: 'flex-end',
        justifyContent: 'center',
        width:'50%'
    },

    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        margin: 0,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    iconStyle:{
        fontFamily:'roboto',
        alignSelf:'flex-end',
        color:'#41E1FD',
        marginEnd:15,
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
    leftLabel:{flexDirection:'column',width:'100%',minHeight:50,alignItems:'center',justifyContent:'center'},
    leftLabelWrapper:{flex:3,flexDirection:'column',alignItems:'center',justifyContent:'center'},
    rightLabel:{flexDirection:'column',width:'100%',minHeight:50,alignItems:'center',justifyContent:'center'},
    subForm:{flexDirection:'column',width:'75%',alignItems:'center',justifyContent:'center'},
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    footerWrapper:{
        position:'absolute',
        bottom:0,
        width:'100%'
    },
    headerWrapper: {
        alignSelf: 'stretch',
        backgroundColor: 'rgb(255,255,255)',
        height: 60,
        ...Platform.select({
            ios: {
                paddingTop: 30,
                marginBottom: 30,
            },
            android: {
                paddingTop: 0,
                marginBottom: 0,
            },
        }),
    },
    header: {
        alignSelf: 'stretch',
        backgroundColor: 'rgb(255,255,255)',
        flexDirection: 'row',
        elevation: 5,
        height: 59,
    },
    headerLeft: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center',
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
})

export default styles;
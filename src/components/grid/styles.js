import {
    StyleSheet,
    Dimensions
} from "react-native";


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding:10,
    },
    header: {
      height:40,
      backgroundColor: '#537791'
    },
    text: {
      textAlign: 'center',
      fontWeight: '100'
    },
    dataWrapper: {
      marginTop: -1,
    },
    row: {
      height:40,
      flexDirection: "row",
      overflow: "hidden",
    },
    col:{
      // borderRightWidth:0.5,
      // borderBottomWidth:0.5,
      borderColor:'#BDCCDB',
      overflow: "hidden"
  
    },
    cell:{
      height:40,
      minWidth:60,
      borderColor:'#BDCCDB',
      borderTopWidth:0.5,
      borderRightWidth:0.5,
      borderStyle:'solid',
      justifyContent:'center',
      alignItems:'center',
      // backgroundColor: '#E7E6E1',
    },
    wrapper: {
      flexDirection: 'row',
      borderLeftWidth:0.5,
      borderBottomWidth:0.5,
      borderStyle: 'solid',
      borderColor:'#BDCCDB',
    },
    tableStyle:{
      borderLeftWidth:0.5,
      borderBottomWidth:0.5,
      borderStyle: 'solid',
      borderColor:'#BDCCDB',
    },

    textBox:{
      fontFamily: 'roboto',
      fontSize:14,
      fontWeight: '400',
      color: '#989898',
      lineHeight: 24,
      textAlign:'center',
      height:30,
      width:'100%'
    },
    inputBoxWrapper:{
      width:'80%',
      height:40,
      marginBottom:10,
      marginTop:5,
      alignItems:'center',
      justifyContent:'center',
    },
    inputBox:{
      fontFamily: 'roboto',
      fontSize:12,
      fontWeight: '300',
      color: 'black',
      lineHeight:20,
      width:'100%',
      textAlign:'center',
      borderBottomWidth:0.5,
      borderStyle: 'solid',
      borderColor:'#BDCCDB',
      
    },

    footer:{
      height:150,
      width:'100%',
      position:'absolute',
      bottom: 0,
      backgroundColor:'white',
      borderTopWidth: 0.5,
      borderColor: '#d6d7da',
    },
    button: {
      height: 50,
      width:'100%',
      backgroundColor: '#48BBEC',
      bottom: 0,
      position:'absolute',
      alignSelf: 'stretch',
      justifyContent: 'center'
  },
  buttonText:{
    fontFamily: 'roboto',
    fontSize:16,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 24,
    textAlign:'center',
  },
  aggregateWrapper: {
    height: 100,
    width: '100%',
    flexDirection: 'row',
    borderColor: '#d6d7da',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0.5,
    position:'absolute',
    bottom:50,
    left:0
  },
  aggregateTextWrapper:{
    height:80,
    width:'80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryText:{
    fontFamily: 'roboto',
    fontSize:14,
    fontWeight: '300',
    color: '#989898',
    lineHeight: 24,
    textAlign:'center',

  }
  
  });
  
export default styles;
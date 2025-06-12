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
    // backgroundColor:'#E1FBFF',
  },

  col:{
    // borderRightWidth:0.5,
    // borderBottomWidth:0.5,
    borderColor:'#BDCCDB',
    overflow: "hidden"

  },
  cell:{
    height:40,
    width:100,
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

  cellTextBox:{
    height:40,
    width:100,
    borderColor:'#BDCCDB',
    borderTopWidth:0.5,
    borderRightWidth:0.5,
    borderStyle:'solid',
    justifyContent:'center',
    alignItems:'center',

  },

  textBoxIos:{
    fontFamily: 'roboto',
    // fontSize:14,
    paddingHorizontal:5,
    textAlign:'center',
    fontWeight: '400',
    lineHeight:16,
    paddingVertical:0,
    color:'black', 
  },

  textBox:{
    fontFamily: 'roboto',
    // fontSize:14,
    fontWeight: '400',
    lineHeight:16,
    height:16,
    width:'100%',
    color: 'black',
    paddingVertical:0,
    textAlignVertical: 'center',
    textAlign:'center',
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center',
    paddingHorizontal:5,
  },

  
  inputBoxWrapper:{
    width:100,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center',
  },

  inputBoxIos:{
    fontFamily: 'roboto',
    fontSize:12,
    paddingHorizontal:5,
    fontWeight: '300',
    lineHeight:16,
    paddingVertical:0,
    color: '#989898', 
  },

  inputBox:{
    fontFamily: 'roboto',
    fontSize:12,
    flexDirection:'row',
    textAlign:'center',
    alignSelf:'center',
    width:'100%',
    height:16,
    lineHeight:16,
    paddingVertical:0,
    textAlignVertical: 'center',
    alignItems:'center',
    justifyContent:'center',
    fontWeight: '300',
    color: '#989898', 
    paddingHorizontal:5,
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
  // fontSize:16,
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
  // fontSize:14,
  fontWeight: '300',
  color: '#989898',
  lineHeight: 24,
  textAlign:'center',

},
topLabel:{
  // fontSize:18,
  color: 'rgb(0,151,235)',
  alignSelf:'flex-start',
  minWidth:'18%',
  paddingHorizontal:15,
  textAlign:'center',
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
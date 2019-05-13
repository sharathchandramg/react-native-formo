import { StyleSheet, Dimensions, Platform } from 'react-native';
const styles = StyleSheet.create({
    modalItem: {
        marginVertical: 10,
        height: 30,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 0.5
    },
    modalItemIcon: {
        height: 30,
        width: '20%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        paddingStart: 10
    },

    modalItemText: {
        height: 30,
        width: '80%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },

    text: {
        fontFamily: 'roboto',
        fontSize: 14,
        alignSelf: 'center',
        paddingStart: 10,
        
    },

    textContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    filterContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white'
    },
    filterCategoryItem:{
        height:45,
        width:'100%',
        justifyContent:'center',
        alignItems:'flex-start',
        backgroundColor: "#F2F2F2",
    },


    // filter footer
    filterFooter: {
        flexDirection: 'row',
        flex:1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#F2F2F2",
    },
    filterFooterLeft: {
        flexDirection: 'row',
        width:'40%',
        justifyContent:'space-around',
        alignItems:'center',
        paddingEnd:'10%',
        height:'100%',
        backgroundColor: "#F2F2F2",
        elevation:-5
    },
    
    filterFooterRight: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingStart:'10%',
        width:'40%',
        height:'100%',
        backgroundColor: "#F2F2F2",
        elevation:-5
    },

    filterBody: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    filterBodyTop: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 50,
        marginBottom: 10
    },
    filterBodyTopLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 30,
        marginVertical: 10,
        width: '20%',
        marginHorizontal: 15
    },
    filterBodyTopRight: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 30,
        marginVertical: 10,
        marginHorizontal: 15,
        width: '75%',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5
    },
    filterBodyBottom: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    filterBodyBottomLeft: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '30%',
        backgroundColor: '#F8F8F8',
    },
    filterBodyBottomRight: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '70%',
        marginHorizontal: 15
    },
    filterText: {
        fontSize: 12,
        lineHeight: 14,
        fontWeight: '300',
        fontFamily: 'roboto',
        color: 'grey',
        opacity: 1,
        alignSelf: 'center',
        padding: 6
    },
    
    inputStyle: {
        height: 30,
        lineHeight: 30,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        color: 'blue',
        fontSize: 14,
    },
    searchContainer: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        borderBottomColor:'grey',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    filterItem: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomColor:'grey',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    inputWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    inputText: {
        fontSize: 14,
        fontFamily: 'roboto',
        color:'grey',
        flex: 1,
    },

    // popup style

    modalContainerBackground: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },

    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        elevation: 10,
        borderRadius: 8,
        borderColor: '#bbb',
        borderWidth: StyleSheet.hairlineWidth,
        width: '90%',
        height: 250,
        marginHorizontal: '5%',
        top: '25%',
        bottom: '25%',
        backgroundColor: 'white'
    },

    footerItemOk: {
        backgroundColor: '#48BBEC',
        width: '45%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    footerItemCancel: {
        backgroundColor: '#FF5F58',
        width: '45%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    footerItemText: {
        height: 30,
        lineHeight: 16,
        color: 'white',
        fontFamily: 'roboto',
        width: '100%',
        fontSize: 16,
        paddingVertical: 7,
        marginVertical: 10,
        fontWeight: '700',
        textAlign: 'center',
    },

    datePickerStyle:{
        fontSize: 14,
        fontFamily: 'roboto',
        fontWeight: '300',
    },

    dialogBodyText: {
        width: '100%',
        lineHeight: 16,
        fontSize: 14,
        fontFamily: 'roboto',
        fontWeight: '300',
    },

    dialogHeaderText: {
        width: '100%',
        height: 30,
        fontFamily: 'roboto',
        fontWeight: '700',
        lineHeight: 20,
        fontSize: 18
    },

    dialogFooter: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    dialogBody: {
        width: '100%',
        height: 100,
        marginBottom: 10,
        borderBottomColor: '#bbb',
        borderBottomWidth: 0.5,
    },

    dialogHeader: {
        width: '100%',
        height: 50,
        marginBottom: 10,
        borderBottomColor: '#bbb',
        borderBottomWidth: 0.5,
    },

    dialog: {
        width: '90%',
        height: 200,
        opacity: 1,
        marginHorizontal: '5%',
    },


    // search bar 
    mainContainer: {
        height: '100%',
        width: '100%',
        marginTop:0,
        backgroundColor: '#fff'
    },
    itemText:{
        marginVertical:15,  
        fontSize:12,
        alignSelf:'center',
        width:'85%',
        justifyContent:'center',
        height:20,
    },
    
    button: {
        height: 50,
        backgroundColor: "#F2F2F2",
        margin: 0,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
});

export default styles;
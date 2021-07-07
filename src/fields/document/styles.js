import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    topContainer: {
        width: '90%',
        marginHorizontal: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        borderRadius: 4,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'grey',
    },
    image: {
        height: 100,
    },
    valueContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        margin: 0,
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    iconStyle: {
        fontFamily: 'roboto',
        alignSelf: 'flex-end',
        marginEnd:5,
    },
    hScrollView: {
        flexDirection: 'column',
    },
    moreIconContainer: {
        position: 'absolute',
        width: 55,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        right: 0,
        top: 30,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    moreIconOuter: {
        width: 55,
        height: 40,
        marginEnd: 0,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        elevation: 10,
        zIndex: 100,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    moreIconInner: {
        height: 30,
        width: 30,
        margin: 5,
        borderRadius: 15,
        backgroundColor: '#E0E0E0',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: 'black',
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
    modalHeader: {
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeaderTitle: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 12,
        paddingLeft: 5,
        lineHeight: 15,
    },
    imageWrapper: {
        height: '90%',
        width: '100%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
});

export default styles;
import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    topContainer: {
        overflow: 'hidden',
        marginBottom: 12,
        height: 150,
        width: '90%',
        marginHorizontal: 20,
        backgroundColor: '#E0E0E0',
        padding: 2,
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
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingEnd: 0,
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
});

export default styles;

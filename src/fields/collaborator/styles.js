import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    container: {
        minHeight: 40,
        alignItems: 'flex-start',
        justifyContent: 'center',
        margin: 15,
        marginHorizontal: 5,
    },

    inputLabelWrapper: {
        height: 56,
        width: '92%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#41E1FD',
        marginHorizontal: 10,
        borderColor: '#D9D5DC',
        borderWidth: 1,
        borderRadius: 4,
    },

    inputLabel: {
        height: 50,
        width: '99%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        backgroundColor: 'white',
        shadowOffset: { width: 0, height: 0 },
    },

    labelTextWrapper: {
        height: 50,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    valueWrapper: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    iconWrapper: {
        height: 50,
        flexDirection: 'row',
        width: '7%',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    labelText: {
        fontSize: 18,
        lineHeight: 20,
        minHeight: 20,
        color: '#ADADAD',
        fontFamily: 'roboto',
        textAlign: 'left',
        fontWeight: '300',
        paddingStart: 5,
    },

    iconStyle: {
        fontFamily: 'roboto',
        alignSelf: 'center',
        fontSize: 18,
        lineHeight: 20,
        height: 20,
        color: '#41E1FD',
    },

    inputText: {
        fontSize: 15,
        lineHeight: 20,
        minHeight: 20,
        color: '#575757',
        fontFamily: 'roboto',
        alignSelf: 'center',
        fontWeight: '100',
    },

    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        margin: 0,
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
    },
});

export default styles;

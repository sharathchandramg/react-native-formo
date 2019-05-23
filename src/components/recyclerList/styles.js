import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    labelContainer: {
        height: 30,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
    },

    labelText: {
        fontSize: 16,
        lineHeight: 20,
        height: 20,
        width: '50%',
        color: '#ADADAD',
        fontFamily: 'roboto',
        alignSelf: 'flex-start',
        fontWeight: '300',
        marginHorizontal: 5,
    },
});

export default styles;

import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    itemContainer: {
        height: 50,
        marginBottom: 5,
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    labelContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },

    labelText: {
        fontSize: 16,
        lineHeight: 18,
        paddingHorizontal: 5,
        color: '#ADADAD',
        fontFamily: 'roboto',
        textAlign: 'left',
        fontWeight: '300',
    },
});

export default styles;

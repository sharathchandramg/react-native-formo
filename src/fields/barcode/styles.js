import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    valueContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection:'row',
        flex: 1,
    },
    iconStyle: {
        fontFamily: 'roboto',
        alignSelf: 'flex-end',
        marginEnd:5,
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

});

export default styles;
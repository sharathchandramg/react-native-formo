import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    noDataWrapper: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },

    nodataText: {
        height: 30,
        lineHeight: 20,
        color: '#989898',
        fontFamily: 'roboto',
        width: '100%',
        fontSize: 14,
        padding: 5,
        fontWeight: '700',
        alignSelf: 'center',
        textAlign: 'center',
    },
});

export default styles;

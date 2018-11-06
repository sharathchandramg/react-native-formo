import {
    StyleSheet,
    Dimensions
} from "react-native";



const styles = StyleSheet.create({
    topContainer: {
        overflow: 'hidden',
        borderRadius: 4,
        marginBottom: 12,
        height: 150,
        borderColor: 'grey',
        borderWidth: 1
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e6e6e6',

        height: 100,
        borderRadius: 4
    },

    image: {
        height: 100
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        margin: 0,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
});

export default styles;
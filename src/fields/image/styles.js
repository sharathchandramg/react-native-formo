import {
    StyleSheet,
    Dimensions
} from "react-native";



const styles = StyleSheet.create({
    topContainer: {
        overflow: 'hidden',
        marginBottom: 12,
        height: 150,
        marginHorizontal:20,
        
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        borderRadius: 4,
        paddingVertical: 10,
        borderWidth:1,
        borderColor: 'grey',
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
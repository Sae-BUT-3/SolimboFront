import { StyleSheet } from 'react-native';
import { Colors } from './color';

const searchStyle = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        minHeight: "100%",
        backgroundColor: Colors.Licorice,
        margin: 'auto',
        padding : 10
    },
    searchContainer: {
        paddingBottom: 10,
        paddingTop: 10,
        position: "sticky",
        top: 0,
        backgroundColor: Colors.Licorice,
        zIndex: 1,
    },
    resultItemContainer: {
        width: "95%",
        margin: "auto"
    },
    messageText: {
        fontSize: 50,
        fontWeight: "500",
        color: Colors.Celadon,
        paddingLeft: 15,
        paddingRight: 15,
    }
});

export default searchStyle;

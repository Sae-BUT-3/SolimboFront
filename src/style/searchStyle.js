import { StyleSheet } from 'react-native';
import {Colors} from './color'
const searchStyle = StyleSheet.create({
    searchContainer: {
        width: "95%",
        paddingBottom: 10
    },
    resultContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "95%",
        paddingLeft: "5px",
    },
    messageText: {
        fontSize: 50,
        fontWeight: "500",
        color: Colors.Celadon
    }
});

export default searchStyle;

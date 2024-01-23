import { Colors } from "./color";
import { StyleSheet } from "react-native";

const pressableBasicStyle = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: Colors.SeaGreen,
        padding: 10,
        margin: 10,
        width: 300,
        position: 'relative',
    },
    button_text: {
        color: Colors.White,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonPressed: {
        backgroundColor: Colors.Licorice,
    }
});

export default pressableBasicStyle;
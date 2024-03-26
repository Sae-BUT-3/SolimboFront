import { Colors } from "./color";
import { StyleSheet } from "react-native";

const pressableBasicStyle = StyleSheet.create({
    button: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: Colors.SeaGreen,
        padding: 10,
        margin: 10,
        width: 270,
        position: 'relative',
    },
    button_text: {
        color: Colors.White,
        fontSize: 16,
        fontFamily: "inter-semi-bold",
    },
    buttonPressed: {
        backgroundColor: Colors.CalPolyGreen,
    },
    buttonDisabled: {
        backgroundColor: Colors.Onyx,
    }
});

export default pressableBasicStyle;
import { Colors } from "./color";
import { Platform, StyleSheet } from "react-native";

const pressableBasicStyle = StyleSheet.create({
    button: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: Colors.DarkSpringGreen,
        padding: 10,
        margin: 10,
        width: 270,
        position: 'relative',
        shadowColor: Colors.Onyx,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: Platform.OS === 'android' ? 3 : 0, 
        transition: 'background-color 0.3s ease'
    },
    button_text: {
        color: Colors.White,
        fontSize: 16,
        fontFamily: "inter-semi-bold",
    },
    buttonPressed: {
        backgroundColor: Colors.SeaGreen,
    }
});

export default pressableBasicStyle;
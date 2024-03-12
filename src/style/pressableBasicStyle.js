import { Colors } from "./color";
import { StyleSheet } from "react-native";

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
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' , 
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
import { StyleSheet } from 'react-native';
import { Colors } from './color';

const commonStyles = StyleSheet.create({
    container: {
        minHeight: "100%",
        backgroundColor: Colors.Licorice,
        display: "flex",
        flexDirection: "column",
        minWidth: "100vw",
        alignItems: "center",
        // justifyContent: "center",
        paddingTop: 20,
    },
    text: {
        fontSize: 16,
        color: Colors.White,
        fontFamily : "inter-regular",
    },
    pressable: {
        padding: 10,
        backgroundColor: Colors.SeaGreen,
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: 10,
    },
    input : {
        borderRadius: 10,
        padding: 10,
        width: 300,
        margin: 10,
        backgroundColor: Colors.Jet,
        color: Colors.BattleShipGray,
        height: 40,
        fontFamily : "inter-regular",
        // outlineStyle: "none",
    },
    inputFocused: {
        color : Colors.White,
    },
    inputsContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        margin : 10,
    },
    label: {
        color: Colors.CalPolyGreen,
        fontFamily : "inter-regular",
    },
    inputLabelContainer: {
        backgroundColor: Colors.White,
        borderRadius: 5,
        padding: 10,
        width: 300,
        marginTop: 10,
    },
    logo: {
        width: 150,
        height: 150,
        margin: 20,
    },
});

export default commonStyles;

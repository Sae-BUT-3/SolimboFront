import { StyleSheet } from 'react-native';
import { Colors } from './color';

const commonStyles = StyleSheet.create({
    safeAreaContainer: {
        minHeight: "100%",
        backgroundColor: Colors.Licorice,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
        paddingTop: "20%",
        width: "100%",
    },
    centerW50percent : {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "100%",
        height: "50%",
    },
    row :{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    text: {
        fontSize: 16,
        color: Colors.GreyWhite,
        fontFamily : "inter-semi-bold",
    },
    textInfo: {
        fontSize: 16,
        color: Colors.CalPolyGreen,
        fontFamily : "inter-semi-bold",
    },
    textLink: {
        fontSize: 16,
        color: Colors.SeaGreen,
        fontFamily : "inter-semi-bold",
    },
    textUnderline: {
        textDecorationLine: "underline",
    },
    textError: {
        fontSize: 16,
        color: Colors.CalPolyGreen,
        fontFamily : "inter-semi-bold",
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
        width: 270,
        margin: 10,
        backgroundColor: Colors.Jet,
        color: Colors.BattleShipGray,
        height: 40,
        fontFamily : "inter-semi-bold",
        borderWidth: 2,
        borderColor: "transparent",
        // outlineStyle: "none",
    },
    inputFocused: {
        color : Colors.White,
        borderColor: Colors.Onyx,
        borderWidth: 2,
    },
    columnCenterContainer: {
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
        margin: 30,
    },
    SpotifynotAvailable: {
        display: "flex",
        flexDirection: "column",
        margin: 40,
    },
});

export default commonStyles;

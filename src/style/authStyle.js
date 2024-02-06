import { StyleSheet } from 'react-native';
import { Colors } from './color';

const authStyle = StyleSheet.create({
    formContainer: {
        width: 200,
    },
    lineContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 140,
        marginVertical: 5,
    },
    line :{
        width: "100%",
        borderBottomColor: Colors.Jet,
        borderBottomWidth: 5,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    textOr : {
        color: Colors.Silver,
        fontSize: 16,
        // fontWeight: 'bold',
        fontFamily : "inter-bold",
    },
    spotifyLogo: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    textPasswordForgot: {
        color: Colors.Silver,
        fontSize: 14,
        fontFamily : "inter-semi-bold",
    },
    noAccount: {
        color: Colors.Silver,
        fontFamily : "inter-semi-bold",
    },
});

export default authStyle;

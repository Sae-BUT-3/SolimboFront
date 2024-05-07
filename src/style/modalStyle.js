import { StyleSheet } from 'react-native';
import { Colors } from './color';

const modalStyle = StyleSheet.create({
    modalContainer: {
        padding: 20,
    },
    modal : {
        backgroundColor : Colors.Onyx,
        marginTop: 100,
        borderRadius: 30,
        padding: 20,

        height : '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    modalHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
    },
    modalTitle : {
        color: Colors.White,
        fontSize: 20,
    },
    reviewContainer : {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 650,
        padding: 10,
    },
    musicItemContainer : {
        width: "100%",
        maxHeight: 60,
        margin: 5,
    },
    input : {
        backgroundColor: Colors.Jet,
        color: Colors.Silver,
        fontFamily : "inter-regular",
        borderRadius: 10,
        height: "65%",
        width: "100%",
        margin: 10,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        textAlignVertical: 'top',
        borderColor: Colors.Jet,
        borderWidth: 1,
    },
    inputFocused : {
        borderColor: Colors.Licorice,
        borderWidth: 1,
    },
});

export default modalStyle;
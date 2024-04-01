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
    },
    modalTitle : {
        color: Colors.White,
        fontSize: 20,
    },
});

export default modalStyle;
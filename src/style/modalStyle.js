import { StyleSheet } from 'react-native';
import { Colors } from './color';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

const modalStyle = StyleSheet.create({
    modalContainer: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modal : {
        backgroundColor : Colors.Onyx,
        marginTop: 60,
        borderRadius: 30,
        padding: 20,
        height : heightPercentageToDP('100%'),
        display: 'flex',
    },
    messageText: {
        fontSize: 20,
        color: Colors.Silver,
        paddingTop: 30,
        paddingLeft: 15,
        paddingRight: 15,
        textAlign: 'justify'
    },
    modalHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
        paddingBottom: 10
    },
    modalTitle : {
        color: Colors.Silver,
        fontSize: 20,
    },
    reviewContainer : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer:{
        display: 'flex',
        backgroundColor: Colors.Jet,
        borderRadius: 15,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 5
    },
    musicItemContainer : {
        width: widthPercentageToDP("100%"),
        maxHeight: 60,
        margin: 5,
    },
    input : {
        backgroundColor: Colors.Jet,
        color: Colors.White,
        fontSize: 16,
        fontFamily : "inter-regular",
        borderRadius: 10,
        height: heightPercentageToDP("50%"),
        marginTop: 10,
        marginBottom: 5,
        paddingTop: 15,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        textAlignVertical: 'top',
        textAlign: 'justify',
        borderColor: Colors.Onyx,
        borderWidth: 1,
    },
    inputFocused : {
        borderColor: Colors.BattleShipGray,
    },
});

export default modalStyle;
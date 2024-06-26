import { Platform, StyleSheet } from "react-native";
import { Colors } from "./color";

const screenStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Licorice,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 30,
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: 'rgba(43, 43, 43, 0.3)',
        marginBottom: 20
    },
    title: {
        fontSize: Platform.OS === "web" ? 35 : 25,
        color: Colors.White,
        fontWeight: 'bold',
        paddingTop: 15,
    },
    sectionTitle: {
        color: Colors.SeaGreen,
        fontWeight: 'bold',
        fontSize: Platform.OS === 'web' ? 35 : 27,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
        padding: 5,
        fontFamily : "inter-semi-bold",
    },
    sectionFilter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 30,
        padding: 5
    },
    buttonText: {
        color: Colors.White,
        fontWeight: 'bold',
        marginRight: 30,
        fontSize: 16,
        fontFamily : "inter-regular",
    },
    filterButton: {
        marginRight: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.Jet,
        shadowColor: Colors.Onyx,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: Platform.OS === 'android' ? 3 : 0,
        transition: 'background-color 0.3s ease'
    },
    btnHovered: {
        backgroundColor: Colors.Onyx,
    },
    filterText: {
        fontWeight: 'bold',
        color: Colors.White,
        fontSize: Platform.OS  === 'web' ? 17 : 14
    },
    btn: {
        marginRight: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 9,
        borderColor: Colors.Silver,
        borderWidth: 1,
        backgroundColor:  Colors.Jet,
        shadowColor: Colors.Onyx,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: Platform.OS === 'android' ? 3 : 0, 
    },
    text: {
        fontSize: Platform.OS === 'web' ? 20 : 16,
        color: Colors.Celadon,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        flex: 1,
        marginLeft: 15
    },
    titleHeader: {
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1,
        paddingTop: Platform.OS === 'web' ? 10 : 45,
        paddingLeft: 10,
        paddingBottom: 20,
        fontFamily : "inter-semi-bold",
    },
    emptyListContainer: {
        justifyContent: 'center',
        alignItems: "center",
        marginLeft: 30,
        gap: 55
    },
    emptyImage: {
        width: 165,
        height: 165,
        opacity: 0.3,
    },
    noItemsText: {
        fontSize: 20,
        color: Colors.White,
        textAlign: 'center'
    },
    relatedItem: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    relatedName: {
        color: Colors.White,
        marginTop: 10,
        fontFamily : "inter-regular",
        fontSize: 19,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
    },
    followButton: {
        backgroundColor: Colors.DarkSpringGreen,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 10,
        shadowColor: Colors.Onyx,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: Platform.OS === 'android' ? 4 : 0, 
        transition: 'background-color 0.3s ease',
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    },
    
})

export default screenStyle
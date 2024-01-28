import { StyleSheet } from 'react-native';

const searchStyle = StyleSheet.create({
    searchContainer: {
        width: "95%",
        paddingBottom: 10
    },
    resultContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "95%",
        paddingLeft: "5px",
    }
});

export default searchStyle;

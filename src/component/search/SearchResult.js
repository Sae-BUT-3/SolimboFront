import React from 'react';
import { View, Text, Image,StyleSheet } from 'react-native';

function SearchResult({imageURL, title, subtitle}) {
    const styles = StyleSheet.create({
        diplayContainer: {
            display: "flex",
            flexDirection: "row"
        },
        resultImage: {
            height: "50px",
            width: "50px"
        }
    })
    return (
        <View
            style={styles.diplayContainer}
        >
            <Image
                source={{
                uri: imageURL
                }}
                style={styles.resultImage}
            />
            <View
                style={styles.diplayContainer}
            >
                <Text>{title}</Text>
                <Text>{subtitle}</Text>
            </View>

            <Image source={{
                uri: "https://i.scdn.co/image/ab67616d0000b273bd1a52b3d5903ee01c216da0"
            }}/>
        </View>
    );
}

export default SearchResult;

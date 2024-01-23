import React from 'react';
import { View, Text, Image,StyleSheet } from 'react-native';

function SearchResult({imageURL, title, subtitle}) {
    const baseImageURL = "https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg"
    const styles = StyleSheet.create({
        diplayContainer: {
            display: "flex",
            flexDirection: "row"
        },
        searchResultContainer: {
            gap: "10px"
        },
        infoContainer: {
            alignItems: "center",
            width: "calc(95vw - 100px)",
            gap: "15px"
        },
        resultImage: {
            height: "50px",
            width: "50px"
        },
        imageSquare: {
            borderRadius: "5",
        },
        imageRound: {
            borderRadius: "50%",
        },
        tempText: {
            color: "#FFFFFF",
        },
        dot: {
            width: "100%",
            height: "100%",
            alignItems: "center",
            color: "#B3B3B3",
            fontSize: "6px"
        },
        subtitleContainer: {
            gap: "10px"
        },
        subtitles: {

            color: "#B3B3B3",
        }
    })

    const imageStyle = subtitle ? styles.imageRound : styles.imageSquare
    return (
        <View
            style={[styles.diplayContainer,styles.searchResultContainer]}
        >
            <Image
                source={{
                uri: imageURL || baseImageURL
                }}
                style={[styles.resultImage,imageStyle]}
            />
            <View
                style={[styles.diplayContainer, styles.infoContainer]}
            >
                <Text
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    style={styles.tempText}
                >
                    {title}
                </Text>
                {subtitle ?
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.subtitleContainer,styles.diplayContainer]}
                    >
                        <Text>
                            <Text

                                style={[styles.dot,styles.diplayContainer]}
                            >
                                {'\u2B24'}
                            </Text>
                        </Text>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.subtitles}
                        >
                            {subtitle}
                        </Text>
                    </Text>
                     : null}

            </View>

        </View>
    );
}

export default SearchResult;

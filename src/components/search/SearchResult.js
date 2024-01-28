import React from 'react';
import { View, Text, Image,StyleSheet } from 'react-native';
import commonStyles from "../../style/commonStyle";
import {Colors} from "../../style/color";

function SearchResult({imageURL, title, subtitle}) {
    const baseImageURL = "https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg"
    const styles = StyleSheet.create({
        diplayContainer: {
            display: "flex",
            flexDirection: "row",
            flex: 1,
        },
        searchResultContainer: {
            gap: 10,
        },
        infoContainer: {
            alignItems: "center",
            width: "90%",
            gap: 15
        },
        resultImage: {
            height: 50,
            width: 50
        },
        imageSquare: {
            borderRadius: 5,
        },
        imageRound: {
            borderRadius: 50,
        },
        dot: {
            alignItems: "center",
            color: Colors.Silver,
            fontSize: 10,
        },
        subtitleContainer: {
            alignItems: "center",
            flex: 1,
            gap: 10
        },
        subtitles: {
            color: Colors.Silver,
            paddingLeft: 10

        },
        limitSize: {
            maxWidth: "60%"
        }
    })

    const imageStyle = subtitle ? styles.imageRound : styles.imageSquare
    const limitSize = subtitle ? styles.limitSize : {}
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
                    style={[commonStyles.text,limitSize]}
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

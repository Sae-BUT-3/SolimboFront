import React, {useState} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    useWindowDimensions,
    Platform,
    Pressable,
    TouchableHighlight
} from 'react-native';
import commonStyles from "../../style/commonStyle";
import {Colors} from "../../style/color";
import {useNavigation} from '@react-navigation/native'
import { widthPercentageToDP as wp} from 'react-native-responsive-screen';

function SearchResult({id, type, imageURL, title, subtitle, rounded, onPress}) {
    const baseImageURL = "https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg"
    const {height, width} = useWindowDimensions()
    const [isHovered,setIsHovered] = useState(false)
    const handlePressIn = () => {
        setIsHovered(true);

    };
    const handlePressOut = () => {
        setIsHovered(Platform.OS === "web" && isHovered);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const navigation = useNavigation();
    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            if(id && type){
                switch(type){
                    case 'artist':
                        navigation.navigate('artist', {id: id });
                        break;
                    case 'user':
                        navigation.navigate('user', {id: id });
                        break;
                    case 'track':
                        navigation.navigate('oeuvre', {type:'track', id: id });
                        break;
                    case 'album':
                    case 'single':
                    case 'compliation':
                        navigation.navigate('oeuvre', {type:'album', id: id });
                        break;
                }
            }
        }
    };
    const styles = StyleSheet.create({
        diplayContainer: {
            display: "flex",
            flexDirection: "row",
            flex: 1,
            gap: 10,
        },
        searchResultContainer: {
            width: Platform.OS === 'web'? wp("93%"): wp("100%"),
            backgroundColor: isHovered ? Colors.Jet : "transparent",
            borderRadius: 5,
        },
        infoContainer: {
            alignItems: "center",
            width: "90%",
            gap: 15
        },
        resultImage: {
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 5,
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
            marginLeft: 10,
            marginRight: Platform.OS === 'web' ? 15 : 0
        },
        limitSize: {
            maxWidth: "60%"
        }
    })

    const imageStyle = rounded ? styles.imageRound : styles.imageSquare
    return (
        <TouchableHighlight
            onPress={handlePress}
            onPressOut={handlePressOut}
            onMouseEnter={handlePressIn} onMouseLeave={handleMouseLeave}
            underlayColor={Colors.Jet}
            style={[styles.searchResultContainer]}
        >
            <View
                style={[styles.diplayContainer]}
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
                        style={[commonStyles.text,styles.limitSize]}
                    >
                        {title}
                    </Text>
                    {subtitle && width > 250 ?
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[styles.subtitleContainer,styles.diplayContainer]}
                        >
                            <Text>
                                <Text

                                    style={[styles.dot,styles.diplayContainer]}
                                >
                                    {'\u2B24' + "     "}
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
        </TouchableHighlight>
    );
}

export default SearchResult;

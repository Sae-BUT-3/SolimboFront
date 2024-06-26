import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable, View, Text, Platform, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import { Avatar } from 'react-native-elements';
import { Rating } from 'react-native-ratings';
import { Colors } from '../../style/color';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../../api/axiosInstance';
import Date from '../common/DateT';
import PointTrait from '../common/PointTrait';
import ReadMore from 'react-native-read-more-text';
import Tokenizer from '../../utils/Tokenizer';
import ActionsPanel from '../common/ActionsPanel';
import { Share } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const toCapitalCase = (mot) => {
    if (mot === 'artist') mot = mot + 'e';
    return mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;
}

const Review = ({ data }) => {
    const navigation = useNavigation();
    const [like, setLike] = useState(false);
    const [countlikes, setCountLikes] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentUser, setUser] = useState({});
    const [isActive, setActive] = useState(false);

    const renderTruncatedFooter = (handlePress) => (
        <Text onPress={handlePress} style={{ color: Colors.SeaGreen, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal', fontFamily: 'inter-regular' }}>
            Lire plus
        </Text>
    );

    const renderRevealedFooter = (handlePress) => (
        <Text onPress={handlePress} style={{ color: Colors.SeaGreen, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal', fontFamily: 'inter-regular' }}>
            Lire moins
        </Text>
    );

    const getData = async () => {
        setUser(await Tokenizer.getCurrentUser());
    }

    useEffect(() => {
        getData();
        setLike(data.doesUserLike);
        setCountLikes(data.countlike);
    }, [data]);

    const handlePress = () => {
        axiosInstance.post(`review/${data.id_review}/like`)
            .then(res => {
                if (!like) {
                    setLike(true);
                    setCountLikes(countlikes + 1);
                } else {
                    setLike(false);
                    setCountLikes(countlikes - 1);
                }
            }).catch(e => console.log(`review/${data.id_review}/like : ${e.response.data}`));
    }

    const handleCommentButtonClick = () => {
        setActive(false);
        navigation.navigate('comment', { id: data.id_review });
    };

    const goTo = () => {
        switch (data.oeuvre.type) {
            case 'artist':
                navigation.navigate('artist', { id: data.oeuvre.id });
                break;
            case 'track':
                navigation.navigate('oeuvre', { type: 'track', id: data.oeuvre.id });
                break;
            case 'single':
            case 'album':
            case 'compliation':
                navigation.navigate('oeuvre', { type: 'album', id: data.oeuvre.id });
                break;
        }
    }

    const deleteReview = () => {
        axiosInstance.delete('review', { params: { idReview: data.id_review } })
            .then(res => {

            }).catch(e => console.log(`delete review : ${e.response.data}`));
    }

    const handleDelete = () => {
        Alert.alert(
            'Confirmation',
            'Voulez-vous vraiment supprimer cette review ?',
            [
                {
                    text: 'Annuler',
                    onPress: () => console.log('Annulation de la suppression'),
                    style: 'cancel',
                },
                { text: 'Supprimer', onPress: () => { setActive(false); deleteReview(); } },
            ],
            { cancelable: false }
        );
    };

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Partage de la review de ${data.utilisateur.pseudo}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const actions = [
        {
            name: 'comment-medical',
            handle: () => {
                setActive(false);
                navigation.navigate('response', { type: 'review', id: data.id_review });
            },
            color: Colors.SeaGreen,
            text: 'Commenter',
            textColor: Colors.White,
            solid: true,
            size: wp('6%')
        },
        {
            name: 'comment-dots',
            handle: handleCommentButtonClick,
            color: Colors.SeaGreen,
            text: 'Afficher les commentaires',
            textColor: Colors.White,
            solid: true,
            size: wp('6%')
        },
        {
            name: 'share',
            handle: onShare,
            color: Colors.SeaGreen,
            text: 'Partager',
            textColor: Colors.White,
            solid: true,
            size: wp('6%')
        }
    ];

    if (currentUser.id_utilisateur === data.utilisateur.id_utilisateur) {
        actions.push(
            {
                name: 'trash-alt',
                handle: handleDelete,
                color: Colors.Red,
                text: 'Supprimer',
                textColor: Colors.Red,
                solid: true,
                size: wp('4%')
            }
        );
    }

    return (
        <Pressable onLongPress={() => setActive(!isActive)} onPress={handleCommentButtonClick}>
            <View key={data.id_review} style={styles.reviewContainer}>
                <View style={styles.reviewerInfo}>
                    <View style={styles.avatarContainer}>
                        <Pressable onPress={() => goTo()}>
                            <Avatar source={{ uri: data.oeuvre.type === 'track' ? data.oeuvre.album?.image : data.oeuvre?.image }} size={Platform.OS === 'web'? 90 : 74} containerStyle={styles.avatar} />
                        </Pressable>
                        <View style={styles.avatarTextContainer}>
                            <Text numberOfLines={1} style={styles.oeuvreName}>{toCapitalCase(data.oeuvre.name)}</Text>
                            <Text style={styles.oeuvreType}>{data.oeuvre.type === 'track' ? 'Titre' : toCapitalCase(data.oeuvre.type)}</Text>
                        </View>
                    </View>
                    <View style={styles.ratingContainer}>
                        <Rating
                            type="custom"
                            ratingCount={5}
                            imageSize={30}
                            tintColor={Colors.Jet}
                            ratingColor={Colors.DarkSpringGreen}
                            ratingBackgroundColor={Colors.Licorice}
                            startingValue={data.note}
                            readonly
                        />
                        {Platform.OS != 'web' && <PointTrait point={true} />}
                        <Pressable onPress={() => navigation.navigate('user', { id: data.utilisateur.id_utilisateur })}>
                            <Text numberOfLines={1} style={styles.userAlias}>{'@' + data.utilisateur.alias}</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={styles.descriptionContainer}>
                    <ReadMore
                        numberOfLines={5}
                        renderTruncatedFooter={renderTruncatedFooter}
                        renderRevealedFooter={renderRevealedFooter}
                        onReady={() => setIsExpanded(false)}
                        onExpand={() => setIsExpanded(true)}
                    >
                        <Text style={styles.descriptionText}>{toCapitalCase(data.description)}</Text>
                    </ReadMore>
                </View>
                <View style={styles.actionsContainer}>
                    <View style={styles.countContainer}>
                        <View style={styles.countContainer}>
                            <Pressable onPress={handlePress}>
                                {like ? <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} solid /> : <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} regular />}
                            </Pressable>
                            <Text style={styles.counText}>{countlikes}</Text>
                        </View>
                        <View style={styles.countContainer}>
                            <Pressable onPress={handleCommentButtonClick}>
                                <FontAwesome5 name="comment-dots" size={30} color={Colors.DarkSpringGreen} regular />
                            </Pressable>
                            <Text style={styles.counText}>{data.countComment}</Text>
                        </View>
                    </View>
                    <Date dateString={data.createdAt} />
                </View>
            </View>
            {isActive && <ActionsPanel actions={actions} />}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    reviewContainer: {
        backgroundColor: Colors.Jet,
        display: 'flex',
        marginBottom: Platform.OS == 'web' ? 30 : 20,
        marginLeft: Platform.OS  == "web" ? 20 : 0,
        marginRight: Platform.OS  == "web" ? 20 : 0,
        borderRadius: 15,
        padding: 20,
        justifyContent: 'space-between',
        width:  Platform.OS  == "web" ? wp('80%') : wp('90%'),
        shadowColor: Colors.Onyx,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: Platform.OS === 'android' ? 3 : 0,
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    },
    reviewerInfo: {
        justifyContent: 'space-between',
        color: Colors.White,
        gap: 10
    },
    avatarContainer: {
        flexDirection: 'row',
        gap: 5,
    },
    avatar: {
        borderRadius: 10,
        shadowColor: Colors.Onyx,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: Platform.OS === 'android' ? 3 : 0,
    },
    avatarTextContainer: {
        display: 'flex',
        paddingLeft: 10,
        gap: 5,
    },
    oeuvreName: {
        color: Colors.White,
        fontSize: Platform.OS == 'web' ? 20 : 19,
        fontWeight: 'bold',
        maxWidth: wp('40%'),
        fontFamily : "inter-semi-bold",
    },
    oeuvreType: {
        color: Colors.White,
        fontSize: Platform.OS == 'web' ? 20 : 19,
        fontWeight: 'normal',
        fontFamily : "inter-regular",
    },
    ratingContainer: {
        gap: 10,
        flexDirection: 'row',
        alignItems: Platform.OS != 'web' ? 'center' : null,
        flexWrap: 'nowrap',
    },
    userAlias: {
        maxWidth: wp('50%'),
        color: Colors.DarkSpringGreen,
        fontSize: Platform.OS == 'web' ? 20 : 19,
        fontWeight: 'normal',
        textAlign: 'right',
        fontFamily : "inter-regular",
    },
    descriptionContainer: {
        marginBottom: Platform.OS == 'web' ? 20 : 5,
        marginTop: Platform.OS == 'web' ? 20 : 5,
    },
    descriptionText: {
        color: Colors.White,
        fontSize: Platform.OS == 'web' ? 20 : 19,
        fontWeight: 'normal',
        textAlign: 'justify',
        fontFamily : "inter-regular",
    },
    actionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    countContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10, 
        justifyContent: 'space-between'
    },
    counText: {
        color: Colors.White,
        fontSize: 20,
        fontFamily : "inter-regular",
    },
});

export default Review;

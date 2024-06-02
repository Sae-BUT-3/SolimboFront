import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { StyleSheet, ScrollView, Text, View, Pressable, Platform, Animated, RefreshControl } from 'react-native';
import Discography from '../../components/artist/Discograpy';
import Profil from '../../components/artist/Profil';
import Loader from '../../components/common/Loader';
import ErrorRequest from '../../components/common/ErrorRequest';
import ArtistReview from '../../components/artist/ArtistReview';
import { Colors } from '../../style/color';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import ArtistAppearsOn from '../../components/artist/ArtistAppearsOn';
import DiscograpyPopup from '../../components/artist/DicograpyPopup';
import { Snackbar } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import Filter from '../../components/search/Filter';
import ImagePanel from '../../components/common/ImagePanel';
import { useTranslation } from "react-i18next";

const ArtistScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params;
    const [filter, setFilter] =  useState(false);
    const [discography, setDiscography] = useState([]);
    const [friendsFollowers, setFriendsFollowers] = useState(0);
    const [follow, setFollow] = useState(false);
    const [appearsOn, setAppearsOn] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [artistProfile, setArtistProfile] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fail, setFailed] = useState(null);
    const [response, setResponse] = useState(null);
    const [isDiscograpyPopupVisible, setDiscograpyPopupVisible] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const { t } = useTranslation();
    const handleShowAll = () => {
      setShowAll(true);
    };

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      updateData();
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }, []);

    const handlePress = () => {
        if(Platform.OS === 'web')
            setDiscograpyPopupVisible(true);
        else
            navigation.navigate('discographie', {id})
    };

    const handleClose = () => {
        setResponse(null);
    };

    const onfollowArtist = () => {
        axiosInstance.post('/users/follow', { artistId: artistProfile.id })
        .then(res => {
            if (!follow) {
                artistProfile.follower_count++;
                setFollow(true);
            } else {
                artistProfile.follower_count--;
                setFollow(false);
            }
        }).catch(e => setResponse('Une erreur interne à notre serveur est survenue. Réessayer plus tard !'));
    };

    useFocusEffect(
        useCallback(() => {
            updateData();
        }, [])
    );

    const updateData = () => {
        axiosInstance.get('/artist/' + id)
        .then(response => {
            setArtistProfile(response.data.artist);
            setDiscography(response.data.albums);
            setFriendsFollowers(response.data.friends_followers);
            setReviews(response.data.reviewsByTime);
            setFollow(response.data.doesUserFollow);
        }).catch(e => console.log(e.response.data));

        axiosInstance.get('/spotify/fetchArtistSongs', {
            params: {
                id: id,
                filter: 'appears_on'
            },
        })
        .then(response => {
            setAppearsOn(response.data);
        }).catch(e => console.log(e.response.data));
    }

    useEffect(() => {
        axiosInstance.get('/artist/' + id)
            .then(response => {
                setArtistProfile(response.data.artist);
                navigation.setOptions({ title: response.data.artist?.name + ' | Solimbo' });
                setDiscography(response.data.albums);
                setFriendsFollowers(response.data.friends_followers);
                setReviews(response.data.reviewsByTime);
                setFollow(response.data.doesUserFollow);
            }).catch(e => setFailed(e.response.data));

        axiosInstance.get('/spotify/fetchArtistSongs', {
            params: {
                id: id,
                filter: 'appears_on'
            },
        })
            .then(response => {
                setAppearsOn(response.data);
                setIsLoading(false);
            }).catch(e => setFailed(e.response.data));
    }, []);

    const [scrollY] = useState(new Animated.Value(0));

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowTitle(offsetY > 0);
    };
    console.log(reviews)
    if (fail) {
        return <ErrorRequest err={fail} />;
    }

    return (
        
        <View style={styles.container}>
            {isLoading ? (<Loader />) : (
                <>
                    <ScrollView
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.DarkSpringGreen]} tintColor={Colors.DarkSpringGreen} size='large' title={t('common.refreshing')} titleColor={Colors.White}/>
                        }
                    >
                        <View style={{ height: showTitle ? (Platform.OS === 'web' ? 450 : 300 ): (Platform.OS === 'web' ? 650 : 500) }}>
                            <Profil data={artistProfile} friends_followers={friendsFollowers} follow={follow} followArtist={onfollowArtist} show={setShowAll}/>
                        </View>
                        { friendsFollowers.length > 1 && showAll && <ImagePanel avatars={friendsFollowers} type={'user'} show={setShowAll} onRefresh={updateData}/>}
                        <ScrollView
                            scrollEventThrottle={16}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                { useNativeDriver: true }
                            )}
                        >
                            <View style={styles.sectionFilter}>
                                <Text style={styles.sectionTitle}>Discographie</Text>
                                {(Platform.OS === 'web' && discography.length > 0) && <Pressable onPress={handlePress}>
                                    <Text style={styles.buttonText}>Afficher plus</Text>
                                </Pressable>}
                            </View>
                            <Discography items={discography} id={id} />
                            {isDiscograpyPopupVisible && (
                                <DiscograpyPopup onClose={() => setDiscograpyPopupVisible(false)} _id={id} />
                            )}
                            <View style={[styles.sectionFilter,  {marginBottom: 10}]}>
                                <Text style={styles.sectionTitle}>{t("review.newreview")}</Text>
                                { (reviews.length > 3 && Platform.OS === 'web') && <Pressable onPress={() => { navigation.navigate('review', { id }) }}>
                                    <Text style={styles.buttonText}>{t("common.displaymore")}</Text>
                                </Pressable>}
                            </View>
                            {reviews.length > 3 && <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10,marginBottom: 25, marginLeft: 30}}>
                                <FontAwesome5 name="filter" size={20} color={Colors.SeaGreen} />
                                <Filter 
                                    onPressHandler={()=>{setFilter(!filter)}}
                                    text={t("follow.onlyfollow")}
                                />
                            </View>}
                            <ArtistReview items={reviews} id={id} />
                           
                            <View style={styles.sectionFilter}>
                                <Text style={styles.sectionTitle}>{t("common.appearson")}</Text>
                            </View>
                            <ArtistAppearsOn items={appearsOn} />
                            {response && (<Snackbar
                                visible={response !== null}
                                onDismiss={handleClose}
                                action={{
                                    label: t("common.close"),
                                    onPress: handleClose
                                }}
                                duration={Snackbar.DURATION_MEDIUM}
                                style={{width: Platform.OS == 'web' ? 500 : 400, position: 'absolute'}}
                            >
                                {response}
                            </Snackbar>)}
                        </ScrollView>
                    </ScrollView>
                    <View style={styles.titleHeader}>
                        <Pressable onPress={() => { navigation.goBack() }}>
                            <FontAwesome5 name="chevron-left" size={25} color={Colors.White} />
                        </Pressable>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Licorice,
    },
    sectionTitle: {
        color: Colors.SeaGreen,
        fontWeight: 'bold',
        fontSize: Platform.OS === 'web' ? 35 : 27,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
        padding: 5,
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
        fontSize: 16
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
    },
});

export default ArtistScreen;

import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { StyleSheet, ScrollView, Text, View, Pressable, Platform, Animated } from 'react-native';
import Discography from '../../components/artist/Discograpy';
import Profil from '../../components/artist/Profil';
import Loader from '../../components/Loader';
import ErrorRequest from '../../components/ErrorRequest';
import ArtistReview from '../../components/artist/ArtistReview';
import { Colors } from '../../style/color';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import ArtistAppearsOn from '../../components/artist/ArtistAppearsOn';
import DiscograpyPopup from '../../components/artist/DicograpyPopup';
import { Snackbar } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5

const ArtistScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params;
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

    const handlePress = () => {
        setDiscograpyPopupVisible(true);
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
                    >
                        <View style={{ height: showTitle ? 300 : 500 }}>
                            <Profil data={artistProfile} friends_followers={friendsFollowers} follow={follow} followArtist={onfollowArtist} />
                        </View>
                        <ScrollView
                            scrollEventThrottle={16}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                { useNativeDriver: true }
                            )}
                        >
                            <View style={styles.sectionFilter}>
                                <Text style={styles.sectionTitle}>Discographie</Text>
                                {Platform.OS === 'web' && discography.length > 0 ? <Pressable onPress={handlePress}>
                                    <Text style={styles.buttonText}>Afficher plus</Text>
                                </Pressable> : null}
                            </View>
                            <Discography items={discography} id={id} />
                            {isDiscograpyPopupVisible && (
                                <DiscograpyPopup onClose={() => setDiscograpyPopupVisible(false)} _id={id} />
                            )}
                            <View style={styles.sectionFilter}>
                                <Text style={styles.sectionTitle}>Récentes reviews</Text>
                                {Platform.OS === 'web' && reviews.length > 0 ? <Pressable onPress={() => { navigation.navigate('Review', { id }) }}>
                                    <Text style={styles.buttonText}>Afficher plus</Text>
                                </Pressable> : null}
                            </View>
                            <ArtistReview items={reviews} id={id} />
                           
                            <View style={styles.sectionFilter}>
                                <Text style={styles.sectionTitle}>Apparaît sur</Text>
                            </View>
                            <ArtistAppearsOn items={appearsOn} />
                            {response && (<Snackbar
                                visible={response !== null}
                                onDismiss={handleClose}
                                action={{
                                    label: 'Fermer',
                                    onPress: handleClose
                                }}
                                duration={Snackbar.DURATION_MEDIUM}
                                style={{width: Platform.OS == 'web' ? 500 : 400, position: 'absolute'}}
                            >
                                {response}
                            </Snackbar>)}
                        </ScrollView>
                    </ScrollView>
                    {showTitle && (
                        <View style={styles.titleHeader}>
                            <Pressable onPress={() => { navigation.goBack() }}>
                                <FontAwesome5 name="arrow-left" size={35} color={Colors.DarkSpringGreen} />
                            </Pressable>
                        </View>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Licorice,
        color: Colors.White
    },
    sectionTitle: {
        color: Colors.DarkSpringGreen,
        fontWeight: 'bold',
        fontSize: 35,
        elevation: Platform.OS === 'android' ? 3 : 0
    },
    sectionFilter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 30,
        marginBottom: 30,
        alignItems: 'flex-end'
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
        backgroundColor: 'rgba(43, 43, 43, 0.3)',
        zIndex: 1,
        paddingTop: 30,
        paddingLeft: 20,
        paddingBottom: 10,
    },
});

export default ArtistScreen;

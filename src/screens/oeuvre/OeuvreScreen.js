import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { StyleSheet, ScrollView, Text, View, Pressable, Platform, Animated } from 'react-native';
import Loader from '../../components/Loader';
import ErrorRequest from '../../components/ErrorRequest';
import { Colors } from '../../style/color';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import OeuvreReview from '../../components/oeuvre/OeuvreReview';
import Oeuvre from '../../components/oeuvre/Oeuvre';
import Trackgraphy from '../../components/oeuvre/Trackgraphy';
import { SafeAreaView } from 'react-native-safe-area-context';
import Item from '../../components/common/Item';

const OeuvreScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { type, id } = route.params;
    const [tracks, setTracks] = useState([]);
    const [friendsLikes, setFriendsLikes] = useState(0);
    const [like, setLike] = useState(false);
    const [favoris, setFavoris] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [oeuvre, setOeuvre] = useState([]);
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fail, setFailed] = useState(null);
    const [response, setResponse] = useState(null);
    const [showTitle, setShowTitle] = useState(type === 'track');

    const handleClose = () => {
        setResponse(null);
    };

    const onLike = () => {
      axiosInstance.post(`/oeuvre/${type}/${id}/like`)
      .then(res => {
          if (!like) {
              oeuvre.like_count++;
              setLike(true);
          } else {
              oeuvre.like_count--;
              setLike(false);
          }
      }).catch(e => setResponse('Une erreur interne à notre serveur est survenue. Réessayer plus tard !'));
    };

    useEffect(() => {
        axiosInstance.get(`/oeuvre/${id}`)
        .then(response => {
            setOeuvre(response.data.oeuvre);
            setArtists(response.data.artist);
            navigation.setOptions({ title: response.data.oeuvre.name + ' | Solimbo' });
            setTracks(response.data.oeuvre.tracks);
            setFriendsLikes(response.data);
            setReviews(response.data.reviewsByTime);
            setLike(response.data.doesUserLikes);
            setFavoris(response.data.doesUserFav)
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
                <SafeAreaView>
                    <ScrollView
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        <View style={{ height: showTitle ? 300 : 500 }}>
                            <Oeuvre data={oeuvre} artists={artists} friends_likes={friendsLikes} favoris={favoris} like={like} likeOeuvre={onLike} />
                        </View>
                        <ScrollView
                            scrollEventThrottle={16}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                { useNativeDriver: true }
                            )}
                        >
                           { type !== 'track' && (<><View style={styles.sectionFilter}>
                                <Text style={styles.sectionTitle}>Titres</Text>
                                {Platform.OS === 'web' && oeuvre.total_tracks > 0 ? <Pressable onPress={handlePress}>
                                    <Text style={styles.buttonText}>Afficher plus</Text>
                                </Pressable> : null}
                            </View>
                            <Trackgraphy items={tracks} id={id} /></>)}
                            <View style={styles.sectionFilter}>
                                <Text style={styles.sectionTitle}>Récentes reviews</Text>
                                {Platform.OS === 'web' && reviews.length > 0 ? <Pressable onPress={() => { navigation.navigate('Review', { id }) }}>
                                    <Text style={styles.buttonText}>Afficher plus</Text>
                                </Pressable> : null}
                            </View>
                            <OeuvreReview items={reviews} id={id} />
                            {response && (<Snackbar
                                visible={response !== null}
                                onDismiss={handleClose}
                                action={{
                                    label: 'Fermer',
                                    onPress: handleClose
                                }}
                                duration={Snackbar.DURATION_SHORT}
                                style={{width: Platform.OS == 'web' ? 500 : 400, position: 'absolute'}}
                            >
                                {response}
                            </Snackbar>)}
                        </ScrollView>
                    </ScrollView>
                    {showTitle && (
                        <View style={styles.titleHeader}>
                            <Pressable onPress={() => { navigation.goBack() }}>
                                <FontAwesome5 name="arrow-left" size={30} color={Colors.DarkSpringGreen} />
                            </Pressable>
                        </View>
                    )}
                </SafeAreaView>
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
        fontSize: Platform.OS === 'web' ? 35 : 25,
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

export default OeuvreScreen;

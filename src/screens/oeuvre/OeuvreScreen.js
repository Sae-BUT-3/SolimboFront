import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { StyleSheet, ScrollView, Text, View, Pressable, Platform, RefreshControl, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Loader from '../../components/common/Loader';
import ErrorRequest from '../../components/common/ErrorRequest';
import { Colors } from '../../style/color';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import Oeuvre from '../../components/oeuvre/Oeuvre';
import Trackgraphy from '../../components/oeuvre/Trackgraphy';
import ImagePanel from '../../components/common/ImagePanel';
import Filter from '../../components/search/Filter';
import ListReview from '../../components/review/ListReview';
import Item from '../../components/artist/Item';
import screenStyle from '../../style/screenStyle';

const OeuvreScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();  
    const { type, id } = route.params || {}; // Handle missing params gracefully

    const [tracks, setTracks] = useState([]);
    const [like, setLike] = useState(false);
    const [favoris, setFavoris] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [oeuvre, setOeuvre] = useState(null);
    const [related, setRelated] = useState([]);
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fail, setFailed] = useState(null);
    const [response, setResponse] = useState(null);
    const [showTitle, setShowTitle] = useState(type === 'track');
    const [refreshing, setRefreshing] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [filter, setFilter] = useState(false);

    // Function to handle showing all artists
    const handleShowAll = () => {
        setShowAll(true);
    };

    // Function to handle refreshing the screen
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData(); // Call the function to fetch data
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    // UseFocusEffect to update data whenever screen focus changes
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    // Function to fetch data from the API
    const fetchData = () => {
        axiosInstance.get(`/oeuvre/${id}`)
            .then(response => {
                const { oeuvre, artist, tracks, reviewsByTime, doesUserLikes, doesUserFav } = response.data;
                setOeuvre(oeuvre);
                setRelated(oeuvre.topTracks);
                setArtists(artist);
                if (tracks) setTracks(tracks);
                else setTracks([]);
                setReviews(reviewsByTime);
                setLike(doesUserLikes);
                setFavoris(doesUserFav);
                setIsLoading(false);
                navigation.setOptions({ title: oeuvre.name + ' | Solimbo' });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setFailed(error.response.data);
                setIsLoading(false);
            });
    };

    // Handle scroll event to show/hide title
    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowTitle(offsetY > 0);
    };

    // Render error if API request fails
    if (fail) {
        return <ErrorRequest err={fail} />;
    }

    return (
        <View style={screenStyle.container}>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <ScrollView
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[Colors.DarkSpringGreen]}
                                tintColor={Colors.DarkSpringGreen}
                                size='large'
                                title='Actualisation...'
                                titleColor={Colors.White}
                            />
                        }
                    >
                        <View style={{ height: showTitle && (type !== 'track' && reviews?.length > 2) ? 300 : 500, marginBottom: 25 }}>
                            <Oeuvre data={oeuvre} artists={artists} favoris={favoris} likeUser={like} setResponse={setResponse} show={handleShowAll} />
                        </View>
                        {(artists.length > 1 && showAll) && <ImagePanel avatars={artists} type={'artist'} show={setShowAll} onRefresh={fetchData} />}
                            
                            {type !== 'track'  && tracks?.length > 0 && 
                                <Trackgraphy items={tracks} id={id} />
                            }
                        
                        <View style={[screenStyle.sectionFilter, { marginBottom: 25 }]}>
                            <Text style={screenStyle.sectionTitle}>Récentes reviews</Text>
                            {reviews.length > 0 && Platform.OS === 'web' && (
                                <Pressable onPress={() => { navigation.navigate('review', { id }) }}>
                                    <Text style={screenStyle.buttonText}>Afficher plus</Text>
                                </Pressable>
                            )}
                        </View>
                        {reviews && reviews.length > 3 && (
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 25, marginLeft: 30 }}>
                                <FontAwesome5 name="filter" size={20} color={Colors.SeaGreen} />
                                <Filter
                                    onPressHandler={() => { setFilter(!filter) }}
                                    text={"Suivis uniquement"}
                                />
                            </View>
                        )}
                        <ListReview items={filter ? reviews.filter(item => item.made_by_friend) : reviews} id={id} />
                        {related.length > 0 && (
                            <View style={screenStyle.sectionFilter}>
                                <Text style={screenStyle.sectionTitle}>Plus de contenus </Text>
                            </View>
                        )}
                        <FlatList
                            data={related.slice(0, 5)}
                            renderItem={({ item }) => (
                                <Item data={item} />
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal={Platform.OS === 'web'}
                            showsHorizontalScrollIndicator={false}
                        />
                    </ScrollView>

                    <View style={screenStyle.titleHeader}>
                        <Pressable onPress={() => { navigation.goBack() }}>
                            <FontAwesome5 name="chevron-left" size={25} color={Colors.White} />
                        </Pressable>
                    </View>

                    {/* Snackbar for displaying response */}
                    {response && (
                        <Snackbar
                            visible={response !== null}
                            onDismiss={() => setResponse(null)}
                            action={{
                                label: 'Fermer',
                                onPress: () => setResponse(null)
                            }}
                            duration={Snackbar.DURATION_MEDIUM}
                            style={{ width: Platform.OS === 'web' ? 500 : 400, position: 'relative' }}
                        >
                            {response}
                        </Snackbar>
                    )}
                </>
            )}
        </View>
    );
};

export default OeuvreScreen;
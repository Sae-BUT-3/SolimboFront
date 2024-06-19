import React, { useCallback,useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { StyleSheet, ScrollView, Text, View, Pressable, Platform, Animated, RefreshControl } from 'react-native';
import Loader from '../../components/common/Loader';
import ErrorRequest from '../../components/common/ErrorRequest';
import { Colors } from '../../style/color';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import OeuvreReview from '../../components/oeuvre/OeuvreReview';
import Oeuvre from '../../components/oeuvre/Oeuvre';
import Trackgraphy from '../../components/oeuvre/Trackgraphy';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePanel from '../../components/common/ImagePanel';
import Filter from '../../components/search/Filter';

const OeuvreScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { type, id } = route.params;
    const [tracks, setTracks] = useState([]);
    const [like, setLike] = useState(false);
    const [favoris, setFavoris] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [oeuvre, setOeuvre] = useState([]);
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fail, setFailed] = useState(null);
    const [response, setResponse] = useState(null);
    const [showTitle, setShowTitle] = useState(type === 'track');
    const [refreshing, setRefreshing] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [filter, setFilter] =  useState(false);

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

    const handleClose = () => {
        setResponse(null);
    };

    useFocusEffect(
        useCallback(() => {
            updateData();
        }, [])
    );
    const updateData = () => {
        axiosInstance.get(`/oeuvre/${id}`)
        .then(response => {
            if (response.data.oeuvre) setOeuvre(response.data.oeuvre);
            if (response.data.artist) setArtists(response.data.artist);
            if (response.data.oeuvre.tracks) setTracks(response.data.oeuvre.tracks);
            if (response.data.reviewsByTime) setReviews(response.data.reviewsByTime);
            if (response.data.doesUserLikes) setLike(response.data.doesUserLikes);
            if (response.data.doesUserFav) setFavoris(response.data.doesUserFav);
            setIsLoading(false);
        }).catch(e => setFailed(e.response.data));
    }

    useEffect(() => {
        axiosInstance.get(`/oeuvre/${id}`)
        .then(response => {
            setOeuvre(response.data.oeuvre);
            setArtists(response.data.artist);
            navigation.setOptions({ title: response.data.oeuvre.name + ' | Solimbo' });
            setTracks(response.data.oeuvre.tracks);
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
                <>
                    <ScrollView
                        scrollEventThrottle={16}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.DarkSpringGreen]} tintColor={Colors.DarkSpringGreen} size='large' title='Actualisation...' titleColor={Colors.White}/>
                        }
                    >
                        <View style={{ height: showTitle && (type!== 'track' && reviews?.length > 2) ? 300 : 500, marginBottom: 25 }}>
                            <Oeuvre data={oeuvre} artists={artists} favoris={favoris} likeUser={like} setResponse={setResponse} show={handleShowAll} />
                        </View>
                        { (artists.length > 1 && showAll) && <ImagePanel avatars={artists} type={'artist'} show={setShowAll} onRefresh={updateData}/>}
                        <ScrollView
                            scrollEventThrottle={16}
                        >
                            { type !== 'track' && (<Trackgraphy items={tracks} id={id} />)}
                            <View style={[styles.sectionFilter,  {marginBottom: 25}]}>
                                <Text style={styles.sectionTitle}>Récentes reviews</Text>
                                { (reviews && reviews.length > 3 && Platform.OS === 'web') &&
                                    <Pressable onPress={() => { navigation.navigate('review', { id }) }}>
                                        <Text style={styles.buttonText}>Afficher plus</Text>
                                    </Pressable>}
                            </View>
                            {reviews && reviews.length > 3 && <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10,marginBottom: 25, marginLeft: 30}}>
                                <FontAwesome5 name="filter" size={20} color={Colors.SeaGreen} />
                                <Filter 
                                    onPressHandler={()=>{setFilter(!filter)}}
                                    text={"Suivis uniquement"}
                                />
                            </View>}
                            <OeuvreReview items={reviews.filter(item => {
                                    if(filter) 
                                        return item.made_by_friend
                                    return 1
                                })} id={id} 
                            />  
                        </ScrollView>
                    </ScrollView>
                  
                    <View style={styles.titleHeader}>
                        <Pressable onPress={() => { navigation.goBack() }}>
                            <FontAwesome5 name="chevron-left" size={25} color={Colors.White} />
                        </Pressable>
                    </View>
                    {response && (<Snackbar
                        visible={response !== null}
                        onDismiss={handleClose}
                        action={{
                            label: 'Fermer',
                            onPress: handleClose
                        }}
                        duration={Snackbar.DURATION_MEDIUM}
                        style={{width: Platform.OS == 'web' ? 500 : 400, position: 'relative'}}
                    >
                        {response}
                    </Snackbar>)}
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
        color: Colors.SeaGreen,
        fontWeight: 'bold',
        fontSize: Platform.OS === 'web' ? 35 : 27,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
    },
    sectionFilter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 15,
        marginBottom: 20,
        alignItems: 'center'
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

export default OeuvreScreen;

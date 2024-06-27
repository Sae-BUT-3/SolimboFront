import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { screenStyleheet, ScrollView, Text, View, Pressable, Platform, Animated, RefreshControl, FlatList } from 'react-native';
import Discography from '../../components/artist/Discograpy';
import Profil from '../../components/artist/Profil';
import Loader from '../../components/common/Loader';
import ErrorRequest from '../../components/common/ErrorRequest';

import { Colors } from '../../style/color';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import ArtistAppearsOn from '../../components/artist/ArtistAppearsOn';
import DiscograpyPopup from '../../components/artist/DicograpyPopup';
import { Snackbar } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import Filter from '../../components/search/Filter';
import ImagePanel from '../../components/common/ImagePanel';
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import ListReview from '../../components/review/ListReview';
import screenStyle from '../../style/screenStyle';
import { Avatar } from 'react-native-paper';

const ArtistScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { checkLogin } = useAuth();
    checkLogin(navigation);
    const { id } = route.params;
    const [filter, setFilter] =  useState(false);
    const [discography, setDiscography] = useState([]);
    const [friendsFollowers, setFriendsFollowers] = useState(0);
    const [follow, setFollow] = useState(false);
    const [appearsOn, setAppearsOn] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [artistProfile, setArtistProfile] = useState([]);
    const [related, setRelated] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fail, setFailed] = useState(null);
    const [response, setResponse] = useState(null);
    const [isDiscograpyPopupVisible, setDiscograpyPopupVisible] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const { t } = useTranslation();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        updateData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, [id]);

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
            setIsLoading(true)
            updateData();
        }, [id])
    );

    const updateData = () => {
        axiosInstance.get('/artist/' + id)
        .then(response => {
            setArtistProfile(response.data.artist);
            setRelated(response.data.artist.relatedArtist);
            setDiscography(response.data.albums);
            setFriendsFollowers(response.data.friends_followers);
            setReviews(response.data.reviewsByTime);
            setFollow(response.data.doesUserFollow);
            setIsLoading(false);
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
                setRelated(response.data.artist.relatedArtist)
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
    }, [id]);

    if (fail) {
        return <ErrorRequest err={fail} />;
    }

    return (
        <View style={screenStyle.container}>
            {isLoading ? (<Loader />) : (
                <>
                    <ScrollView
                        scrollEventThrottle={16}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.DarkSpringGreen]} tintColor={Colors.DarkSpringGreen} size='large' title={t('common.refreshing')} titleColor={Colors.White}/>
                        }
                    >
                        <View style={{ height: showTitle ? (Platform.OS === 'web' ? 450 : 300 ): (Platform.OS === 'web' ? 650 : 500) }}>
                            <Profil data={artistProfile} friends_followers={friendsFollowers} follow={follow} followArtist={onfollowArtist} show={setShowAll}/>
                        </View>
                        { friendsFollowers.length > 1 && showAll && <ImagePanel avatars={friendsFollowers} type={'user'} show={setShowAll} onRefresh={updateData}/>}

                        <View style={screenStyle.sectionFilter}>
                            <Text style={screenStyle.sectionTitle}>{t("discography.title")}</Text>
                            {(Platform.OS === 'web' && discography.length > 0) && <Pressable onPress={handlePress}>
                                <Text style={screenStyle.buttonText}>{t("commmon.displaymore")}</Text>
                            </Pressable>}
                        </View>
                        <Discography items={discography} id={id} />
                        {isDiscograpyPopupVisible && (
                            <DiscograpyPopup onClose={() => setDiscograpyPopupVisible(false)} _id={id} />
                        )}
                        <View style={[screenStyle.sectionFilter,  {marginBottom: 10}]}>
                            <Text style={screenStyle.sectionTitle}>{t("review.newreview")}</Text>
                            { (reviews.length > 3 && Platform.OS === 'web') && <Pressable onPress={() => { navigation.navigate('review', { id }) }}>
                                <Text style={screenStyle.buttonText}>{t("common.displaymore")}</Text>
                            </Pressable>}
                        </View>
                        {reviews.length > 3 && <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10,marginBottom: 25, marginLeft: 30}}>
                            <FontAwesome5 name="filter" size={20} color={Colors.SeaGreen} />
                            <Filter 
                                onPressHandler={()=>{setFilter(!filter)}}
                                text={t("follow.onlyfollow")}
                            />
                        </View>}
                        <ListReview items={reviews} id={id} />
                        
                        {appearsOn.length > 0 && 
                        (
                            <>
                            <View style={screenStyle.sectionFilter}>
                                <Text style={screenStyle.sectionTitle}>{t("common.appearson")}</Text>
                            </View>
                            <ArtistAppearsOn items={appearsOn} />
                            </>
                        )}

                        {related.length > 0 &&        
                            (<View style={screenStyle.sectionFilter}>
                                <Text style={screenStyle.sectionTitle}>{t("common.fanalsolike")}</Text>
                            </View>
                        )}
                        
                        <FlatList
                            data={related.slice(0, 5)}
                            renderItem={({ item }) => (
                                <View style={screenStyle.relatedItem}>
                                        <Pressable
                                        activeOpacity={1}
                                        onPress={() => navigation.navigate('artist', { id: item.id })}
                                    >    
                                        <Avatar.Image source={{ uri: item.image }} size={164} />
                                    </Pressable>
                                    <Text style={screenStyle.relatedName}>{item.name}</Text>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{marginBottom: 30}}
                        />

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
                    <View style={screenStyle.titleHeader}>
                        <Pressable onPress={() => { navigation.goBack() }}>
                            <FontAwesome5 name="chevron-left" size={25} color={Colors.White} />
                        </Pressable>
                    </View>
                </>
            )}
        </View>
    );
}

export default ArtistScreen;

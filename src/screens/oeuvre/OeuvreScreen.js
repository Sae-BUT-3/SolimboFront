import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Platform,
  Animated,
  RefreshControl,
  FlatList,
} from "react-native";
import Loader from "../../components/common/Loader";
import ErrorRequest from "../../components/common/ErrorRequest";
import { Colors } from "../../style/color";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { Snackbar } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons"; // Importation de FontAwesome5
import Oeuvre from "../../components/oeuvre/Oeuvre";
import Trackgraphy from "../../components/oeuvre/Trackgraphy";
import ImagePanel from "../../components/common/ImagePanel";
import Filter from "../../components/search/Filter";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import screenStyle from '../../style/screenStyle';
import ListReview from "../../components/review/ListReview";

const OeuvreScreen = () => {
  const navigation = useNavigation();
  const { checkLogin } = useAuth();
  checkLogin(navigation);
  const route = useRoute();
  const { type, id } = route.params;
  const [tracks, setTracks] = useState([]);
  const [like, setLike] = useState(false);
  const [favoris, setFavoris] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [oeuvre, setOeuvre] = useState([]);
  const [related, setRelated] = useState([]);
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fail, setFailed] = useState(null);
  const [response, setResponse] = useState(null);
  const [showTitle, setShowTitle] = useState(type === "track");
  const [refreshing, setRefreshing] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState(false);
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
  }, [id]);

  const handleClose = () => {
    setResponse(null);
  };

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            updateData();
        }, [id])
    );
    const updateData = () => {

        axiosInstance.get(`/oeuvre/${id}`)
        .then(response => {
            if (response.data.oeuvre) {
              setOeuvre(response.data.oeuvre);
              setRelated(response.data.oeuvre.topTracks);
            }
            if (response.data.artist) setArtists(response.data.artist);
            if (response.data.oeuvre.tracks) setTracks(response.data.oeuvre.tracks);
            if (response.data.reviewsByTime) setReviews(response.data.reviewsByTime);
            if (response.data.doesUserLikes) setLike(response.data.doesUserLikes);
            if (response.data.doesUserFav) setFavoris(response.data.doesUserFav);
            setIsLoading(false);
        }).catch(e => setFailed(e.response.data));
    }

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get(`/oeuvre/${id}`)
      .then((response) => {
        setOeuvre(response.data.oeuvre);
        setArtists(response.data.artist);
        navigation.setOptions({
          title: response.data.oeuvre.name + " | Solimbo",
        });
        setTracks(response.data.oeuvre.tracks);
        setReviews(response.data.reviewsByTime);
        setLike(response.data.doesUserLikes);
        setFavoris(response.data.doesUserFav);
        setIsLoading(false);
      })
      .catch((e) => setFailed(e.response.data));
  }, [id]);

  const [scrollY] = useState(new Animated.Value(0));

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowTitle(offsetY > 0);
  };

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
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.DarkSpringGreen]} tintColor={Colors.DarkSpringGreen} size='large' title='Actualisation...' titleColor={Colors.White}/>
                }
            >
                <View style={{ height: showTitle && (type!== 'track' && reviews?.length > 2) ? 300 : 500, marginBottom: 25 }}>
                    <Oeuvre data={oeuvre} artists={artists} favoris={favoris} likeUser={like} setResponse={setResponse} show={handleShowAll} />
                </View>
                { (artists.length > 1 && showAll) && <ImagePanel avatars={artists} type={'artist'} show={setShowAll} onRefresh={updateData}/>}
                { type !== 'track' && (<Trackgraphy items={tracks} id={id} />)}
                <View style={[screenStyle.sectionFilter,  {marginBottom: 25}]}>
                    <Text style={screenStyle.sectionTitle}>Récentes reviews</Text>
                    { (reviews && reviews.length > 3 && Platform.OS === 'web') &&
                        <Pressable onPress={() => { navigation.navigate('review', { id }) }}>
                            <Text style={screenStyle.buttonText}>Afficher plus</Text>
                        </Pressable>}
                </View>
                {reviews && reviews.length > 3 && <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10,marginBottom: 25, marginLeft: 30}}>
                    <FontAwesome5 name="filter" size={20} color={Colors.SeaGreen} />
                    <Filter 
                        onPressHandler={()=>{setFilter(!filter)}}
                        text={"Suivis uniquement"}
                    />
                </View>}
                <ListReview items={reviews.filter(item => {
                        if(filter) 
                            return item.made_by_friend
                        return 1
                    })} id={id} 
                />  
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
};

export default OeuvreScreen;

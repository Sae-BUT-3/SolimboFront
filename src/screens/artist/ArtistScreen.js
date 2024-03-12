import React, {useEffect, useState} from 'react';
import axiosInstance from '../../api/axiosInstance';
import {StyleSheet, ScrollView, Text, View, Pressable, Platform, Animated } from 'react-native';
import Discography from '../../components/artist/Discograpy';
import Profil from '../../components/artist/Profil';
import Loader from '../../components/Loader';
import ErrorRequest from '../../components/ErrorRequest';
import ArtistReview from '../../components/artist/ArtistReview';
import { Colors } from '../../style/color';
import ArtistAppearsOn from '../../components/artist/ArtistAppearsOn';
import DiscograpyPopup from '../../components/artist/DicograpyPopup';

const ArtistScreen = ({route, navigation}) => {
    const { id } = route.params;
    const [discography, setDiscography] = useState([]);
    const [friendsFollowers, setFriendsFollowers] = useState(0);
    const [follow, setFollow] = useState(false);
    const [appearsOn, setAppearsOn] = useState([])
    const [reviews, setReviews] = useState([]);
    const [artistProfile, setArtistProfile] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fail, setFailed] = useState(null);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [isDiscograpyPopupVisible, setDiscograpyPopupVisible] = useState(false);

    const handlePress = () => {
      setDiscograpyPopupVisible(true);
    };

    const onfollowArtist = () => {
      axiosInstance.post('/users/follow', {artistId : artistProfile.id})
      .then(res => {
        if(!follow){
          setResponse(`Abonnnement à l'artiste ${artistProfile.name} bien effectué`);
          artistProfile.follower_count++;
          setFollow(true)
        }else{
          setResponse(`Désabonnnement à l'artiste ${artistProfile.name} bien effectué`);
          artistProfile.follower_count--;
          setFollow(false)
        }
      }).catch(e => setError('Une erreur interne à notre serveur est survenue. Ressayer plus tard !'));
    }

    useEffect(() => {
        axiosInstance.get('/artist/' + id)
        .then(response => {
          setArtistProfile(response.data.artist);
          navigation.setOptions({ title: response.data.artist?.name + ' | Solimbo' });
          setDiscography(response.data.albums);
          setFriendsFollowers(response.data.friends_followers);
          if(response.data.reviewsByTime.length > 0 || response.data.reviewsByLike.length > 0 ){
            response.data.reviewsByTime.filtre = 'time'
            response.data.reviewsByLike.filtre = 'like'
            setReviews([response.data.reviewsByTime, response.data.reviewsByLike]);
          }
          setFollow(response.data.doesUserFollow);
        }).catch(e => setFailed(e));

        axiosInstance.get('/spotify/fetchArtistSongs',{params: {
          id: id, 
          filter: 'appears_on'
        },})
        .then(response => {
          setAppearsOn(response.data);
          setIsLoading(false);
        }).catch(e => setError(e.response.data));
    }, []);

    const [scrollY] = useState(new Animated.Value(0));

    const headerHeight = scrollY.interpolate({
      inputRange: [0, 300],
      outputRange: [500, 200],
      extrapolate: 'clamp',
    });

    if (error) {
      return <ErrorRequest err={error} page={null}/>;
    }
  
    return (
      isLoading ? <Loader/> :
      <ScrollView
        style={styles.container}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <Animated.View style={{ height: headerHeight }}>
          <Profil data={artistProfile} friends_followers={friendsFollowers} follow={follow} followArtist={onfollowArtist}/>
        </Animated.View>
          <View style={styles.sectionFilter}>
            <Text style={styles.sectionTitle}>Discographie</Text>
            { Platform.OS === 'web' && discography.length > 0 ? <Pressable onPress={handlePress}>
                <Text style={styles.buttonText}>Afficher plus</Text>
              </Pressable > :  null }
          </View>
          <Discography items={discography} />
          {isDiscograpyPopupVisible && (
            <DiscograpyPopup onClose={() => setDiscograpyPopupVisible(false)} _id= {id} />
          )}
          <View style={styles.sectionFilter}>
            <Text style={styles.sectionTitle}>Récents reviews</Text>
            { Platform.OS === 'web' && reviews.length > 0 ? <Pressable >
                <Text style={styles.buttonText}>Afficher plus</Text>
              </Pressable > :  null }
          </View>
          <ArtistReview items={reviews}/> 
          { Platform.OS === 'web'? 
            <><View style={styles.sectionFilter}>
              <Text style={styles.sectionTitle}>Apparaît sur</Text>
            </View>
            <ArtistAppearsOn  items={appearsOn}/></> :  null }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Licorice, 
    color: Colors.White
  },
  sectionTitle: {
    color: Colors.DarkSpringGreen,
    fontWeight: 'bold',
    fontSize: 27,
  },
  sectionFilter:{
    display: 'flex',
    flexDirection:'row',
    justifyContent: 'space-between',
    marginLeft: 30,
    marginBottom: 30,
    alignItems: 'flex-end'
  },
  buttonText: {
    color: Colors.White,
    fontWeight: 'bold',
    marginRight: 30,
    fontSize: 'medium'
  },
});
  
export default ArtistScreen;

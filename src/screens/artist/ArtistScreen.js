import React, {useEffect, useState} from 'react';
import axiosInstance from '../../api/axiosInstance';
import {StyleSheet, ScrollView, Text, View, Pressable, Platform, Animated } from 'react-native';
import Discography from '../../components/artist/Discograpy';
import Profil from '../../components/artist/Profil';
import Loader from '../../components/Loader';
import ErrorRequest from '../../components/ErrorRequest';
import ArtistReview from '../../components/artist/ArtistReview';
import { Colors } from '../../style/color';
import { useRoute, useNavigation } from '@react-navigation/native';
import ArtistAppearsOn from '../../components/artist/ArtistAppearsOn';
import DiscograpyPopup from '../../components/artist/DicograpyPopup';
import {Snackbar, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Avatar from '@mui/material/Avatar';

const ArtistScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params;
    const [discography, setDiscography] = useState([]);
    const [friendsFollowers, setFriendsFollowers] = useState(0);
    const [follow, setFollow] = useState(false);
    const [appearsOn, setAppearsOn] = useState([])
    const [reviews, setReviews] = useState([]);
    const [artistProfile, setArtistProfile] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fail, setFailed] = useState(null);
    const [response, setResponse] = useState(null)
    const [isDiscograpyPopupVisible, setDiscograpyPopupVisible] = useState(false);

    const handlePress = () => {
      setDiscograpyPopupVisible(true);
    };

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
      return;
      }
      setResponse(null);
    };

    const onfollowArtist = () => {
      axiosInstance.post('/users/follow', {artistId : artistProfile.id})
      .then(res => {
        if(!follow){
          artistProfile.follower_count++;
          setFollow(true)
        }else{
          artistProfile.follower_count--;
          setFollow(false)
        }
      }).catch(e => setResponse('Une erreur interne à notre serveur est survenue. Réessayer plus tard !'));
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

        axiosInstance.get('/spotify/fetchArtistSongs',{params: {
          id: id, 
          filter: 'appears_on'
        },})
        .then(response => {
          setAppearsOn(response.data);
          setIsLoading(false);
        }).catch(e => setFailed(e.response.data));
    }, []);

    const [scrollY] = useState(new Animated.Value(0));

    const headerHeight = scrollY.interpolate({
      inputRange: [0, 500],
      outputRange: [500, 200],
      extrapolate: 'clamp',
    });

    if (fail) {
      return <ErrorRequest err={fail} />;
    }
    const [showTitle, setShowTitle] = useState(false);

    const handleScroll = (event) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      setShowTitle(offsetY > 0);
    };
    return (
      <View style={styles.container}>
        {isLoading ? (<Loader />) : (
          <>
          <ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <Animated.View style={{ height: headerHeight }}>
              <Profil data={artistProfile} friends_followers={friendsFollowers} follow={follow} followArtist={onfollowArtist}/>
            </Animated.View>
            <Animated.ScrollView
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
            >
              <View style={styles.sectionFilter}>
                <Text style={styles.sectionTitle}>Discographie</Text>
                { Platform.OS === 'web' && discography.length > 0 ? <Pressable onPress={handlePress}>
                    <Text style={styles.buttonText}>Afficher plus</Text>
                  </Pressable > :  null }
              </View>
              <Discography items={discography} id={id}/>
              {isDiscograpyPopupVisible && (
                <DiscograpyPopup onClose={() => setDiscograpyPopupVisible(false)} _id= {id} />
              )}
              <View style={styles.sectionFilter}>
                <Text style={styles.sectionTitle}>Récents reviews</Text>
                { Platform.OS === 'web' && reviews.length > 0 ? <Pressable onPress={()=>{navigation.navigate('Review', {id})}}>
                    <Text style={styles.buttonText}>Afficher plus</Text>
                  </Pressable > :  null }
              </View>
              <ArtistReview items={reviews} id={id}/> 
              { Platform.OS === 'web'? 
                <><View style={styles.sectionFilter}>
                  <Text style={styles.sectionTitle}>Apparaît sur</Text>
                </View>
                <ArtistAppearsOn  items={appearsOn}/></> :  null }
                {response && (<Snackbar
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  open={()=>{response ? true : false}}
                  TransitionComponent='SlideTransition'
                  action={
                    <React.Fragment>
                        <IconButton
                            aria-label="close"
                            color={Colors.DarkSpringGreen}
                            sx={{ p: 0.5 }}
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </React.Fragment>
                } message={response}/>)}
          </Animated.ScrollView>
        </ScrollView>
        {showTitle && (
        <View style={styles.titleHeader}>
          <View style={{borderRadius: '100%', backgroundColor: Colors.SeaGreen, padding: 9, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>
            <Pressable onPress= {()=> {navigation.goBack()}}>
              <ArrowBackIosNewIcon sx={{color: Colors.White}}/>
          </Pressable>
          </View>
        </View>
      )}
        </>)}
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
  titleHeader: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(43, 43, 43, 0.5)',
    padding: 10,
    zIndex: 1, 
  },
});
  
export default ArtistScreen;

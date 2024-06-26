import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Platform, ImageBackground, Linking } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../style/color';
import axiosInstance from '../../api/axiosInstance';
import AvatarGroup from '../common/AvatarGroup';
import { Image } from 'react-native';
import { Rating } from 'react-native-ratings';
import { useNavigation } from '@react-navigation/native';
import PointTrait from '../common/PointTrait';

const Oeuvre = ({ data, artists, favoris, likeUser, setResponse, show }) => {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [like, setLike] = useState(false);
  const [countlike, setCountLike] = useState(0);
  const [fav, setFavoris] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setCountLike(data.likeCount);
    setFavoris(favoris);
    setLike(likeUser);
  }, [data, favoris, likeUser]);

  const handleImageMouseEnter = () => {
    setIsImageHovered(true);
  };

  const handleImageMouseLeave = () => {
    setIsImageHovered(false);
  };

  const handleFavoris = () => {
    axiosInstance.post('/users/oeuvreFav', { idOeuvre: data.id, type: data.type })
      .then(res => setFavoris(!fav))
      .catch(e => setResponse('Une erreur interne à notre serveur est survenue. Réessayer plus tard !'));
  };

  const onLike = () => {
    axiosInstance.post(`/oeuvre/${data.type}/${data.id}/like`)
      .then(res => setLike(!like))
      .catch(e => setResponse('Une erreur interne à notre serveur est survenue. Réessayer plus tard !'));
  };

  const linkTo = () => {
    Linking.openURL(data.spotify_url);
  };

  return (
    <ImageBackground
      source={{ uri: data.type === 'track' ? data.album.image : data.image }}
      style={[styles.backgroundImage, { marginBottom: data.type === 'track' ? 30 : 0 }]}
    >
      <View style={styles.overlay}>
        <View style={styles.profileContainer}>
          <View style={[styles.section, { gap: Platform.OS === 'web' ? 20 : 0 }]}>
            <Pressable
              activeOpacity={1}
              onMouseEnter={handleImageMouseEnter}
              onMouseLeave={handleImageMouseLeave}
              style={[isImageHovered && styles.imageContainerHovered]}
            >
              <Image
                source={{ uri: data.type === 'track' ? data.album.image : data.image }}
                style={styles.image}
              />
              <View style={styles.playButtonContainer}>
                <Pressable onPress={linkTo}>
                  <FontAwesome name="play" size={30} color={Colors.White} />
                </Pressable>
              </View>
            </Pressable>
            <View style={styles.section}>
              <View style={styles.infoContainer}>
                {data.type !== 'track' && (
                  <>
                    <Text style={styles.infoText}>{data.type}</Text>
                    <PointTrait point={true} />
                  </>
                )}
                <Text style={styles.infoText}>{data.type !== 'track' ? data.release_date.substring(0, 4) : data.album.release_date.substring(0, 4)}</Text>
                {data.total_tracks > 1 && (
                  <>
                    <PointTrait point={true} />
                    <Text style={styles.infoText}>{data.total_tracks + ' titres'}</Text>
                  </>
                )}
                <PointTrait point={true} />
                {artists.length === 1 ?
                  <Pressable onPress={() => navigation.navigate('artist', { id: artists[0].id })}>
                    <Image source={{ uri: artists[0].image }} style={styles.artistImage} />
                  </Pressable>
                  :
                  <Pressable onPress={show}>
                    <AvatarGroup avatars={artists} size={Platform.OS === 'web' ? 64 : 40} type='artist' />
                  </Pressable>
                }
              </View>
              {Platform.OS !== 'web' && (
                <View style={styles.container}>
                  <Text numberOfLines={2} style={styles.name}>{data.name}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.sectionFollower}>
            <Rating
              type="custom"
              ratingCount={5}
              imageSize={35}
              ratingColor={Colors.DarkSpringGreen}
              tintColor={Colors.Silver}
              ratingBackgroundColor={Colors.Onyx}
              startingValue={data.rating}
              readonly
            />
            <View style={styles.sectionIcon}>
              <FontAwesome name="pencil-square-o" size={30} color={Colors.DarkSpringGreen} />
              <Text style={styles.infoText}>{data.reviewCount ? data.reviewCount : 0}</Text>
            </View>
            <View style={styles.sectionIcon}>
              <Pressable onPress={onLike}>
                {like ? <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} solid /> : <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} regular />}
              </Pressable>
              <Text style={styles.infoText}>{countlike}</Text>
            </View>
            <View style={styles.sectionIcon}>
              <Pressable onPress={handleFavoris}>
                {fav ? <FontAwesome5 name="bookmark" size={30} color={Colors.DarkSpringGreen} solid /> : <FontAwesome5 name="bookmark" size={25} color={Colors.DarkSpringGreen} regular />}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    paddingTop: 45,
    gap: 10,
  },
  section: {
    display: 'flex',
    gap: 3,
    flexWrap: 'wrap',
  },
  sectionFollower: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.Silver,
    borderRadius: 9,
    padding: 10,
    gap: 15,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 4 : 0,
    maxWidth: Platform.OS !== 'web' ? 390 : null,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  like: {
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 3 : 0,
    transition: 'background-color 0.3s ease',
  },
  btnHovered: {
    backgroundColor: Colors.DarkSpringGreen,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: Platform.OS === 'web' ? 30 : 20,
    color: Colors.White,
    fontWeight: 'bold',
    marginBottom: 10,
    maxWidth: 390,
    flexWrap: 'wrap',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 7,
  },
  imageContainerHovered: {
    transform: [{ scale: 1.2 }],
  },
  image: {
    width: 164,
    height: 164,
    borderRadius: 5,
  },
  playButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(43, 43, 43, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  sectionIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  artistImage: {
    width: Platform.OS === 'web' ? 64 : 40,
    height: Platform.OS === 'web' ? 64 : 40,
    borderRadius: 82,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 3,
  },
  infoText: {
    color: Colors.White,
    fontSize: Platform.OS === 'web' ? 20 : 17,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default Oeuvre;

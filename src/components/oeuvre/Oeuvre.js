import React, { useState, useEffect } from 'react';
import { FontAwesome5,  FontAwesome } from '@expo/vector-icons'; 
import {StyleSheet,View, Text, Pressable, Platform, ImageBackground} from 'react-native';
import { Colors } from '../../style/color';
import PointTrait from '../common/PointTrait';
import axiosInstance from '../../api/axiosInstance';
import AvatarGroup from '../common/AvatarGroup';
import { Image } from 'react-native';
import { Rating } from 'react-native-ratings';
import { useNavigation } from '@react-navigation/native';

const Oeuvre = ({ data, artists, favoris, like, likeOeuvre }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const navigation = useNavigation( );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleImageMouseEnter = () => {
    setIsImageHovered(true);
  };

  const handleImageMouseLeave = () => {
    setIsImageHovered(false);
  };

  return (
    <ImageBackground
      source={{uri: data.type === 'track' ? data.album.image : data.image}}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View key={data.id} style={styles.profileContainer}>
          <View style={[styles.section, {flexDirection: 'row', alignItems: 'flex-end'}]}>
            <View>
              <Pressable
                  activeOpacity={1}
                  onMouseEnter={handleImageMouseEnter}
                  onMouseLeave={handleImageMouseLeave}
                  style={[
                  isImageHovered && styles.imageContainerHovered
                  ]}
              > 
                <Image
                  source={{ uri: data.type === 'track' ? data.album.image : data.image }}
                  style={{ width: 164, height: 164, borderRadius: 5}}
                />    
              </Pressable>
              <View style={styles.section}>
                <View style={[styles.section, {flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap'}]}>
                  <Text style={{color: Colors.White, fontSize: 20, textShadowColor: 'rgba(0, 0, 0, 0.75)',
                    textShadowOffset: {width: -1, height: 1},
                    textShadowRadius: 10,}}>{data.type === 'track' ? 'Titre' : data.type}</Text>
                  <PointTrait point={true}/>
                  <Text style={{color: Colors.White, fontSize: 16, textAlign: 'center',
                    textShadowColor: 'rgba(0, 0, 0, 0.75)',
                    textShadowOffset: {width: -1, height: 1},
                    textShadowRadius: 10,}}>{data.type !== 'track' ? data.release_date.substring(0, 4) : data.album.release_date.substring(0, 4) }</Text>
                  {data.total_tracks > 0 && <><PointTrait point={true}/>
                  <Text  style={{color: Colors.White, fontSize: 16, textAlign: 'center', textShadowColor: 'rgba(0, 0, 0, 0.75)',
                    textShadowOffset: {width: -1, height: 1},
                    textShadowRadius: 10,}}>{data.total_tracks + ' titres'}</Text></>}
                </View>
                <View style={styles.container}>
                  <Text style={styles.nameA}>{data.name}</Text>
                </View>
                {artists.length == 1  ? (
                  <View style={[styles.sectionIcon, {marginBottom: 10}]}> 
                    <Pressable onPress={() => navigation.navigate('Artist', { id : artists[0].id })}>  
                      <Image
                        source={{ uri: artists[0].image }}
                        style={{ width: 64, height: 64, borderRadius: 82}}
                      />    
                    </Pressable> 
                    <Text style={{color: Colors.White, fontSize: 20, textAlign: Platform.OS !== 'web'? 'center' : undefined, textShadowColor: 'rgba(0, 0, 0, 0.75)',
                    textShadowOffset: {width: -1, height: 1},
                    textShadowRadius: 10,}}>{artists[0].name}</Text>
                  </View> ) : 
                  <View style={{marginBottom: 10}}> 
                    <AvatarGroup avatars={artists} size={64} type={data.type}/>
                  </View>
                }
              </View>
            </View>
            <View style={styles.sectionFollower}>
              <Rating
                type="custom"
                ratingCount={5}
                imageSize={35}
                ratingColor={Colors.DarkSpringGreen}
                tintColor={Colors.BattleShipGray}
                ratingBackgroundColor={Colors.Onyx}
                startingValue={data.rating}
                readonly
              />
              <View style={styles.sectionIcon}>
                <FontAwesome  name="pencil-square-o" size={30} color={Colors.DarkSpringGreen} regular/>
                <Text style={{color: Colors.White, fontSize: 20, textAlign: Platform.OS !== 'web'? 'center' : undefined}}>{data.reviewCount ? data.reviewCount : 0}</Text>
              </View>
              <View style={styles.sectionIcon}>
                  <Pressable onPress={likeOeuvre}>{like ?  <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} solid  />: <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} regular/>}</Pressable>
                <Text style={{color: Colors.White, fontSize: 20, textAlign: Platform.OS !== 'web'? 'center' : undefined}}>{data.likeCount}</Text>
              </View>
              <Pressable>
                {favoris ?  <FontAwesome5 name="bookmark" size={25} color={Colors.DarkSpringGreen} solid  />: <FontAwesome5 name="bookmark" size={25} color={Colors.DarkSpringGreen} regular/>}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  profileContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    gap:10,
    color: Colors.White,
  },
  description:  {
    display: 'flex',
    gap: 40,
    alignContent: 'flex-start'
  },
  section:{
    display: 'flex',
    gap: 3,
    alignContent: 'flex-start',
    flexWrap: 'wrap'
  },
  sectionFollower: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.BattleShipGray,
    borderRadius: 9,
    padding: 10,
    gap: 10,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 4 : 0, 
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
    transition: 'background-color 0.3s ease'
  },
  btnHovered: {
    backgroundColor: Colors.DarkSpringGreen, 
  },
  container: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    alignItems: 'flex-start', 
  },
  nameA:{
    fontSize: Platform.OS === 'web' ? 30 : 25,
    color: Colors.SeaGreen,
    fontWeight: 'bold',
    marginBottom: 10,
    flexWrap: 'wrap',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    overflow: 'hidden', 
    marginBottom: 30,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 7,
  },
  imageContainerHovered: {
    transform: [{ scale: 1.2 }], 
  },
  sectionIcon:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  icon: {
    color: Colors.DarkSpringGreen,
    fontSize: Platform.OS  == "web" ? 35 : 30,
  },
});

export default Oeuvre
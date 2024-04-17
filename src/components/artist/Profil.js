import React, { useState, useEffect } from 'react';
import {StyleSheet,View, Text, Pressable, Platform, ImageBackground, Image} from 'react-native';
import { Colors } from '../../style/color';
import AvatarGroup from '../common/AvatarGroup';
import { Divider } from 'react-native-paper';

const Profil = ({ data, friends_followers, follow, followArtist }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

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
      source={{ uri:data.image}}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View key={data.id} style={styles.profileContainer}>
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
                  source={{ uri: data.image }}
                  style={{ width: 164, height: 164, borderRadius: 82}}
                />              
              </Pressable>
              <Pressable style={[styles.followButton, isHovered ? styles.btnHovered : null]}
                activeOpacity={1}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onPress={followArtist}>
                {!follow ? <Text style={styles.buttonText}>+ Suivre</Text> : <Text style={styles.buttonText}>Suivi(e)</Text>}
              </Pressable >
            </View>
            <View style={{ display: Platform.OS !== 'web'? 'flex': undefined, alignItems: Platform.OS !== 'web'? 'center' : null}}>
                <View style={styles.container}>
                  <Text style={styles.nameA}>{data.name}</Text>
                </View>
                <View style={styles.sectionFollower}>
                  <View>
                    <Text style={{color: Colors.White, fontSize: 20, textAlign:  'center', margin: 5}}>
                    {data.follower_count} 
                    </Text>
                    <Text style={{color: Colors.White, fontSize: 16, textAlign: 'center', margin: 5}}>Followers</Text> 
                  </View>
                  {friends_followers.count > 0 &&( <Divider  style={{ height: '100%', width: 1, backgroundColor:Colors.White}}/>) }
                  <View style={{display: 'flex', alignItems: "center"}}>
                    <AvatarGroup avatars={friends_followers.users} size={34} type='user'/>
                    {friends_followers.count > 0 ? <Text style={{color: Colors.White, fontSize: 16, textAlign: 'center', margin: 5}}>{`Dont ${friends_followers.count} amis`}</Text>  : null}
                  </View>
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
    justifyContent: Platform.OS === 'web'? 'space-around' : 'center',
    alignItems: 'center',
    padding: 20,
    gap:10,
    color: Colors.White,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    borderBottomLeftRadius: 75, 
    borderBottomRightRadius: 75, 
  },
  followButton: {
    backgroundColor: Colors.DarkSpringGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 4 : 0, 
    transition: 'background-color 0.3s ease'
  },
  btnHovered: {
    backgroundColor: Colors.SeaGreen, 
  },
  buttonText: {
    color: Colors.White,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15
  },
  sectionFollower: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.BattleShipGray,
    borderRadius: 9,
    padding: 10,
    gap: 8,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 4 : 0, 
  },
  container: {
    flexDirection: 'row', // Définit une disposition des éléments en ligne
    flexWrap: 'wrap', // Permet le retour à la ligne automatique
    alignItems: 'flex-start', // Aligne les éléments en haut
  },
  nameA:{
    fontSize: Platform.OS === 'web' ? 30 : 25,
    color: Colors.SeaGreen,
    fontWeight: 'bold',
    marginBottom: 10,
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
    borderBottomLeftRadius: 75, 
    borderBottomRightRadius: 75, 
    marginBottom: 30,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 3 : 0, 
  },
  imageContainerHovered: {
    transform: [{ scale: 1.2 }], 
  },
});

export default Profil
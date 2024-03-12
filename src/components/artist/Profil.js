import React, { useState, useEffect } from 'react';
import {StyleSheet,View, Text, Pressable, Platform, ImageBackground} from 'react-native';
import Avatar from '@mui/material/Avatar';
import { Colors } from '../../style/color';

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
      source={data.image}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View key={data.id} style={styles.profileContainer}>
            <View style={styles.description}>
              <Pressable
                activeOpacity={1}
                onMouseEnter={handleImageMouseEnter}
                onMouseLeave={handleImageMouseLeave}
                style={[
                isImageHovered && styles.imageContainerHovered
                ]}
              >     
                <Avatar src={data.image} sx={{ width: 164, height: 164, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}/>
              </Pressable>
              <Pressable style={[styles.followButton, isHovered ? styles.btnHovered : null]}
                activeOpacity={1}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onPress={followArtist}>
                {!follow ? <Text style={styles.buttonText}>+ Suivre</Text> : <Text style={styles.buttonText}>Suivi</Text>}
              </Pressable >
            </View>
            <View style={{ display: Platform.OS !== 'web'? 'flex': undefined, alignItems: Platform.OS !== 'web'? 'center' : undefined}}>
                <Text style={styles.nameA}>{data.name}</Text>
                <View style={styles.sectionFollower}>
                  <Text style={{color: Colors.White, textShadow: '2px 2px 4px #000000', fontSize: 'medium', textAlign: Platform.OS !== 'web'? 'center' : undefined}}>{data.follower_count} followers  {friends_followers.count > 0 ? ' dont' + friends_followers.count + ' amis' : null} </Text>
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
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' , 
    transition: 'background-color 0.3s ease'
  },
  btnHovered: {
    backgroundColor: Colors.SeaGreen, 
  },
  buttonText: {
    color: Colors.White,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionFollower: {
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: Colors.BattleShipGray,
    fontWeight: 'normal',
    fontSize: 'medium',
    borderRadius: 10,
    padding: 10,
    height: 'auto',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' 
  },
  nameA:{
    fontSize: Platform.OS === 'web'? 'xxx-large' : 'xx-large',
    color: Colors.SeaGreen,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadow: '2px 2px 4px #000000',
    textTransform: 'uppercase'
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
    elevation: 7,
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' 
  },
  imageContainerHovered: {
    transform: [{ scale: 1.2 }], 
  },
});

export default Profil
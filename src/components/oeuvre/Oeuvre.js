import React, { useState, useEffect } from 'react';
import {StyleSheet,View, Text, Pressable, Platform, ImageBackground} from 'react-native';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Colors } from '../../style/color';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import PointTrait from '../common/PointTrait';
import axiosInstance from '../../api/axiosInstance';

const Oeuvre = ({ data, like, likeOeuvre }) => {
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

  const setImage = (id) => {
    axiosInstance.get('spotify/fetchArtist' , {params: {query: id, }})
    .then(response => {
      return response.data.image;
    }).catch(e => console.log(e.response.data));
  }
  return (
    <ImageBackground
      source={data.image}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View key={data.id} style={styles.profileContainer}>
          <View style={[styles.section, {flexDirection: 'row', alignItems: 'flex-end'}]}>
            <Pressable
                activeOpacity={1}
                onMouseEnter={handleImageMouseEnter}
                onMouseLeave={handleImageMouseLeave}
                style={[
                isImageHovered && styles.imageContainerHovered
                ]}
              >    
              <Avatar src={data.image} sx={{ width: 164, height: 164, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }} variant='square'/>
            </Pressable>
            <View style={styles.section}>
              <View style={[styles.section, {flexDirection: 'row', alignItems: 'center'}]}>
                <Text style={{color: Colors.White, textShadow: '2px 2px 4px #000000', fontSize: 'medium', textAlign: Platform.OS !== 'web'? 'center' : undefined}}>{data.type}</Text>
                <PointTrait point={true}/>
                <Text>{data.release_date.substring(0, 4)}</Text>
              </View>
              <Text style={styles.nameA}>{data.name}</Text>
            </View>
          </View>
          <View style={styles.section}>
            {data.artists.length == 1  ? (
             <View style={styles.sectionIcon}> 
                <Pressable onPress={() => navigation.navigate('Artist', { id : data.artists[0].id })}>     
                  <Avatar alt={data.artists[0].name} src={setImage(data.artists[0].id)} sx={{ width: 64, height: 64, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}/>
                </Pressable> 
                <Text style={{color: Colors.White, textShadow: '2px 2px 4px #000000', fontSize: 'medium', textAlign: Platform.OS !== 'web'? 'center' : undefined}}>{data.artists[0].name}</Text>
              </View>
            ) :
            <Pressable>     
              <AvatarGroup total={data.artists.length}>
                {data.artists.map((artist) => (
                  <Avatar alt={artist.name} src={setImage(artist.id)} sx={{ width: 64, height: 64, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}/>
                ))}
              </AvatarGroup>
            </Pressable>
            }
                
                <View style={[styles.section, {flexDirection: 'row', alignItems: 'center'}]}>
                  <View style={styles.sectionIcon}>
                    <Rating value={2} precision={0.5}  style={{color: Colors.DarkSpringGreen}} emptyIcon={<StarIcon style={{ opacity: 0.55, color: Colors.Licorice }} fontSize="inherit"  />} size="large" max={5} readOnly />
                    <Text style={{color: Colors.White, textShadow: '2px 2px 4px #000000', fontSize: 'medium', textAlign: Platform.OS !== 'web'? 'center' : undefined}}>2</Text>
                  </View>
                  <PointTrait point={true}/>
                  <View style={styles.sectionIcon}>
                    <DriveFileRenameOutlineOutlinedIcon style={styles.icon}/>
                    <Text style={{color: Colors.White, textShadow: '2px 2px 4px #000000', fontSize: 'medium', textAlign: Platform.OS !== 'web'? 'center' : undefined}}>{data.reviewCount ? data.reviewCount : 0}</Text>
                  </View>
                  <PointTrait point={true}/>
                  <View style={styles.sectionIcon}>
                    <Pressable onPress={likeOeuvre}>
                        {like ? <FavoriteIcon style={styles.icon}/> : <FavoriteBorderIcon style={styles.icon}/> }
                    </Pressable >
                    <Text style={{color: Colors.White, textShadow: '2px 2px 4px #000000', fontSize: 'medium', textAlign: Platform.OS !== 'web'? 'center' : undefined}}>2</Text>
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
    gap: 10,
    alignContent: 'flex-start'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
  },
  like: {
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' , 
    transition: 'background-color 0.3s ease'
  },
  btnHovered: {
    backgroundColor: Colors.DarkSpringGreen, 
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
  sectionIcon:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  icon: {
    color: Colors.DarkSpringGreen,
    fontSize: Platform.OS  == "web" ? "xx-large" : "x-large",
  },
});

export default Oeuvre
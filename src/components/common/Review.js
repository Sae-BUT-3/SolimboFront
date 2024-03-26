import React, { useState } from 'react';
import {StyleSheet, Pressable, View, Text, Platform} from 'react-native';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import { Colors } from '../../style/color';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../../api/axiosInstance';

const toCapitalCase = (mot) => {
    if(mot == 'artist') mot =  mot + 'e'
    return mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;
}

const transformerDate = (dateString) => {
  const date = new Date(dateString);
  const maintenant = new Date();
  const differenceTemps = maintenant - date;
  
  // Comparer l'année, le mois, et le jour
  if (date.getFullYear() === maintenant.getFullYear() && 
      date.getMonth() === maintenant.getMonth() && 
      date.getDate() === maintenant.getDate()) {
      
      // Si la date est aujourd'hui
      const differenceHeures = maintenant.getHours() - date.getHours();
      if (differenceHeures === 0) {
          // Si la date est dans la même heure
          const differenceMinutes = maintenant.getMinutes() - date.getMinutes();
          return `Il y a ${differenceMinutes} minutes`;
      } else {
          // Si la date est dans la même journée mais à une heure différente
          return `Il y a ${differenceHeures} heures`;
      }
      
  } else if (differenceTemps < 24 * 60 * 60 * 1000) {
      // Si la date est hier ou aujourd'hui mais à une heure différente
      return "Hier";
      
  } else if (differenceTemps < 7 * 24 * 60 * 60 * 1000) {
      // Si la date est dans la semaine écoulée
      const differenceJours = Math.floor(differenceTemps / (24 * 60 * 60 * 1000));
      return `Il y a ${differenceJours} jours`;
      
  } else {
      // Si la date est ancienne, retourner le format "dd/mm/aaaa"
      const jour = ('0' + date.getDate()).slice(-2);
      const mois = ('0' + (date.getMonth() + 1)).slice(-2);
      const annee = date.getFullYear();
      return `${jour}/${mois}/${annee}`;
  }
};

const Review = ({ data}) => {
  const navigation = useNavigation();
  const handlePress = () =>{
    axiosInstance.post(`review/${data.id_review}/like`)
      .then(res => {
        if(!data.doesUserLike){
          data.doesUserLike = true;
          data.countlikes++;
        }else{
          data.doesUserLike = false;
          data.countlikes--;
        }
      }).catch(e => console.log(`review/${data.id_review}/like : ${e.response.data}`));
  }

  const handleCommentButtonClick = () => {
    navigation.navigate('Comment', {id: data.id_review})
  };

  return (
    <><View key={data.id_review} style={styles.reviewContainer}>
        <View style={styles.reviewerInfo}>
          <View style={{display: 'flex', flexDirection: 'row', gap: 5,}}>
            <Avatar alt={data.oeuvre.name} src={data.oeuvre.image} sx={{ width: Platform.OS === 'web'? 90 : 64, height: Platform.OS === 'web'? 90 : 64, borderRadius: 2, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }} variant='square'/>
            <View style={{display: 'flex', gap: 5, paddingLeft: 10}}>
              <Text style={{color: Colors.White, fontSize: 'larger', fontWeight: 'bolder'}}>{toCapitalCase(data.oeuvre.name)}</Text>
              {data.type != 'artist' ?
                <Text style={{color: Colors.White, fontSize: 'large', fontWeight: 'normal' }}>{toCapitalCase(data.oeuvre.artiste)}</Text> : null
              }
              <Text style={{color: Colors.White, fontSize: 'large', fontWeight: 'normal' }}>{toCapitalCase(data.oeuvre.type)}</Text>
            </View>
          </View>
          <View style={{display: 'flex', gap: 5,}}>
            <Rating value={data.note} precision={0.5}  style={{color: Colors.DarkSpringGreen}} emptyIcon={<StarIcon style={{ opacity: 0.55, color: Colors.Licorice }} fontSize="inherit"  />} size="large" max={5} readOnly />
            <Pressable><Text style={{color: Colors.DarkSpringGreen, fontSize: 'large', fontWeight: 'normal', textAlign: 'right' }}>{'@' + data.utilisateur.pseudo}</Text></Pressable>
          </View>
        </View>
        <View style={{margin: 20}}><Text style={{color: Colors.White, padding:10, fontSize: 'large', fontWeight: 'normal',  textIndent: 20 }}>{toCapitalCase(data.description)}</Text></View>
        <View style={styles.reviewerInfo}>
          <View style={{display: 'flex', flexDirection: 'row', gap: 10, fontSize: 'large', alignItems: 'flex-end'}}>
            <Pressable onPress={handlePress}>{data.doesUserLike ?  <FavoriteIcon style={styles.icon} />: <FavoriteBorderIcon style={styles.icon} />}</Pressable>{data.countlike}
            <Pressable onPress={() => handleCommentButtonClick()}><MapsUgcOutlinedIcon style={styles.icon} /></Pressable>{data.countComment}
          </View>
          <Text style={{color: Colors.White, fontSize: 'large', fontWeight: 'normal' }}>{transformerDate(data.createdAt)}</Text>
        </View>
    </View>
    </>
)}
const styles = StyleSheet.create({
  reviewContainer: {
    backgroundColor: Colors.Jet,
    display: 'flex',
    flexDirection: Platform.OS  == "web" ? 'columns' : 'row',
    marginBottom: 10,
    marginLeft: Platform.OS  == "web" ? 20 : 10,
    marginRight: Platform.OS  == "web" ? 20 : 10,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'space-between',
    maxWidth: Platform.OS === 'web' ? 950 : 300,
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' 
  },
  reviewerInfo: {
    display: 'flex',
    flexDirection: Platform.OS  == "web" ? 'row' : 'columns',
    justifyContent: 'space-between',
    color: Colors.White
  },
  icon: {
    color: Colors.DarkSpringGreen,
    fontSize: Platform.OS  == "web" ? "xx-large" : "large",
  }
});
export default Review
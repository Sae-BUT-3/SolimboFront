import React, { useState } from 'react';
import {StyleSheet, Pressable, View, Text, Platform} from 'react-native';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import { Colors } from '../../style/color';
import ListComment from './ListComment';
import CommentPopup from './CommentPopUp';

const toCapitalCase = (mot) => {
    if(mot == 'artist') mot =  mot + 'e'
    return mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;
}

const transformerDate = (dateString) => {
  const date = new Date(dateString);
  const maintenant = new Date();

  // Comparer l'année et le mois
  if (date.getFullYear() === maintenant.getFullYear() && date.getMonth() === maintenant.getMonth()) {
      // Si la date est dans le même mois que la date actuelle
      const differenceJours = maintenant.getDate() - date.getDate();
      if (differenceJours === 0) {
          // Si la date est aujourd'hui
          return "Aujourd'hui";
      } else if (differenceJours === 1) {
          // Si la date est hier
          return "Hier";
      } else {
          // Sinon, afficher le nombre de jours écoulés
          return `Il y a ${differenceJours} jours`;
      }
  } else {
      // Si la date est dans un mois différent, afficher le mois et l'année
      const options = { month: 'long', year: 'numeric' };
      return date.toLocaleDateString('fr-FR', options);
  }
};

const Review = ({ data}) => {
  const [isCommentPopupVisible, setCommentPopupVisible] = useState(false);

  const handleCommentButtonClick = () => {
    setCommentPopupVisible(true);
  };
  return (
    <><View key={data?.id_review} style={styles.reviewContainer}>
        <View style={styles.reviewerInfo}>
          <View style={{display: 'flex', flexDirection: 'row', gap: 5,}}>
            <Avatar src={data?.oeuvre?.image} sx={{ width: Platform.OS === 'web'? 90 : 64, height: Platform.OS === 'web'? 90 : 64, borderRadius: 2, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }} variant='square'/>
            <View style={{display: 'flex', gap: 5, paddingLeft: 10}}>
              <Text style={{color: Colors.White, fontSize: 'larger', fontWeight: 'bolder'}}>{toCapitalCase(data?.oeuvre.name)}</Text>
              {data.type != 'artist' ?
                <Text style={{color: Colors.White, fontSize: 'large', fontWeight: 'normal' }}>{toCapitalCase(data?.oeuvre.artiste)}</Text> : null
              }
              <Text style={{color: Colors.White, fontSize: 'large', fontWeight: 'normal' }}>{toCapitalCase(data?.oeuvre?.type)}</Text>
            </View>
          </View>
          <View style={{display: 'flex', gap: 5,}}>
            <Rating value={data?.note} precision={0.5}  style={{color: Colors.DarkSpringGreen}} emptyIcon={<StarIcon style={{ opacity: 0.5, color: Colors.Licorice }} fontSize={Platform.OS  == "web" ? "xxx-large": "x-large"}  />} fontSize={Platform.OS  == "web" ? "xxx-large": "x-large"} readOnly />
            <Pressable><Text style={{color: Colors.DarkSpringGreen, fontSize: 'large', fontWeight: 'normal', textAlign: 'right' }}>{'@' + data.utilisateur.pseudo}</Text></Pressable>
          </View>
        </View>
        <View style={{margin: 20}}><Text style={{color: Colors.White, padding:10, fontSize: 'large', fontWeight: 'normal',  textIndent: 20 }}>{toCapitalCase(data.description)}</Text></View>
        <View style={styles.reviewerInfo}>
          <View style={{display: 'flex', flexDirection: 'row', gap: 10, fontSize: 'large', alignItems: 'flex-end'}}>
            <Pressable>{data?.doesUserLike ?  <FavoriteIcon style={styles.icon} />: <FavoriteBorderIcon style={styles.icon} />}</Pressable>{data.countlikes}
            <Pressable onPress={() => handleCommentButtonClick()}><MapsUgcOutlinedIcon style={styles.icon} /></Pressable>{data.countComment}
          </View>
          <Text style={{color: Colors.White, fontSize: 'large', fontWeight: 'normal' }}>{transformerDate(data.created_at)}</Text>
        </View>
    </View>
    {isCommentPopupVisible && (
      <CommentPopup onClose={() => setCommentPopupVisible(false)}/>
    )}</>
)}
const styles = StyleSheet.create({
  reviewContainer: {
    backgroundColor: Colors.Jet,
    display: 'flex',
    flexDirection: Platform.OS  == "web" ? 'columns' : 'row',
    marginBottom: 20,
    marginLeft: Platform.OS  == "web" ? 30 : 20,
    marginRight: Platform.OS  == "web" ? 30 : 20,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'space-between',
    maxWidth: Platform.OS === 'web' ? "auto" : 300,
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
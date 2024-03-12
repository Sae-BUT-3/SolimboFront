import React, {useState} from 'react';
import {StyleSheet, Pressable, View, Text, Platform} from 'react-native';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ReplyStep from './ReplyStep';
import { Colors } from '../../style/color';
import PointTrait from './PointTrait';

const toCapitalCase = (mot) => {
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
const Comment = ({ data, setAuthor, setOpen}) => {
  const [showReplies, setShowReplies] = useState(false);

  const displayReply = () => {
    setShowReplies(!showReplies);
  }

  return (
     <><View key={data?.id} style={styles.commentContainer}>
          <View style={styles.commentInfo}>
            <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center'}}>
              <Pressable><Avatar src={data?.userProfile} sx={{ width: Platform.OS === 'web'? 75 : 64, height: Platform.OS === 'web'? 75 : 64}}/></Pressable>
              <View style={{display: 'flex', gap: 5, alignItems: 'center', flexDirection: 'row'}}>
                <Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'bold'}}>{data.username}</Text>
                <PointTrait point={true}/>
                <Pressable><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'normal'}}>{'@' + data.username}</Text></Pressable>
              </View>
            </View>
            <Text style={{color: Colors.White, fontSize: 'medium', fontWeight: 'normal' }}>Il y a 1 h</Text>
          </View>
          <View style={{margin: 20}}><Text style={{color: Colors.White, padding:10, fontSize: 'large', fontWeight: 'normal',  textIndent: 20 }}>{toCapitalCase(data.text)}</Text></View>
          <View style={styles.commentInfo}>
            {data.replies.length > 0 ? 
              <View style={{display: 'flex', flexDirection:'row', gap: 5}}>
                <Pressable onPress={displayReply}><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'normal'}}>{' Voir les réponses '+ data.replies.length}</Text></Pressable>
              </View> : <View style={{display: 'flex', flexDirection:'row', gap: 5}}>
                <Pressable><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'normal'}}> Répondre</Text></Pressable>
              </View>
            }
            <View style={{display: 'flex', flexDirection: 'row', gap: 10, fontSize: 'large', alignItems: 'flex-end'}}>
              <Pressable>{data?.doesUserLike ? <FavoriteIcon style={styles.icon} />: <FavoriteBorderIcon style={styles.icon} />}</Pressable>{data.likes}
              <MapsUgcOutlinedIcon style={styles.icon} />{data?.replies.length}
            </View>
          </View>
    </View> 
    {showReplies && (<><Divider sx={{backgroundColor: Colors.Onyx }} component="li" variant="inset"/><ReplyStep steps={data.replies} setAuthor={setAuthor} setOpen={setOpen}/></>)}</>
)}
const styles = StyleSheet.create({
  commentContainer: {
    display: 'flex',
    flexDirection: Platform.OS  == "web" ? 'columns' : 'row',
    marginBottom: 20,
    padding: 20,
    justifyContent: 'space-between',
    maxWidth: Platform.OS === 'web' ? "auto" : 300,
  },
  commentInfo: {
    display: 'flex',
    flexDirection:  Platform.OS  == "web" ? 'row' : 'columns',
    justifyContent: 'space-between',
    color: Colors.White,
    gap: 5
  },
  icon: {
    color: Colors.DarkSpringGreen,
    fontSize: Platform.OS  == "web" ? "xx-large" : "x-large",
  },
  margeLigne: {
    height: 2, // Hauteur de la marge/ligne
    backgroundColor: Colors.Onyx,
    width: '100%', // Largeur de la marge
    alignSelf: 'center', // Centre la marge horizontalement
    marginBottom: 10, // Marge en bas pour créer l'effet de ligne
    marginTop: 30,
    opacity: 0.5,
    transform: [{ translateX: '1%', translateY: '10%' }], // Décalage de 10% vers la gauche
  },
});
export default Comment
import React, {useState} from 'react';
import {StyleSheet, Pressable, View, Text, Platform} from 'react-native';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { Colors } from '../../style/color';
import PointTrait from './PointTrait';
import CommentResponse from './CommentResponse';
import axiosInstance from '../../api/axiosInstance';

const toCapitalCase = (mot) => {
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

const Comment = ({ data, reply}) => {
  const [replies, setReplies] = useState(null);

  const displayReply = () => {
    axiosInstance.get(`/review/${id}`)
    .then(response => {
      setReplies(response.data.comments);
    }).catch(e => console.log(e.response.data));
  }
  const onPress = ()=>{
    reply(data);
  }
  return (
     <View key={data?.id_com} style={styles.commentContainer}>
          <View style={styles.commentInfo}>
            <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center'}}>
              <Pressable><Avatar src={data.utilisateur.photo} sx={{ width: Platform.OS === 'web'? 75 : 64, height: Platform.OS === 'web'? 75 : 64}}/></Pressable>
              <View style={{display: 'flex', gap: 5, alignItems: 'center', flexDirection: 'row'}}>
                <Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'bold'}}>{data.utilisateur.pseudo}</Text>
                <PointTrait point={true}/>
                <Pressable><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'normal'}}>{'@' + data.utilisateur.alias}</Text></Pressable>
              </View>
            </View>
            <Text style={{color: Colors.White, fontSize: 'medium', fontWeight: 'normal' }}>{transformerDate(data?.createdAt)}</Text>
          </View>
          <View style={{margin: 20}}><Text style={{color: Colors.White, padding:10, fontSize: 'large', fontWeight: 'normal',  textIndent: 20 }}>{toCapitalCase(data.description)}</Text></View>
          <View style={styles.commentInfo}>
            {replies.countComment > 0 ? 
              <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center'}}>
                <Pressable onPress={displayReply}><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'normal'}}>{ replies ? ' Voir les réponses ' : "Masquer les réponses"}</Text></Pressable>
                <Divider orientation="vertical" variant="middle" flexItem sx={{borderColor: Colors.Silver}} />
                <Pressable onPress={onPress}><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'normal'}}> Répondre</Text></Pressable>
              </View> : <View style={{display: 'flex', flexDirection:'row', gap: 5}}>
                <Pressable onPress={onPress}><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'normal'}}> Répondre</Text></Pressable>
              </View>
            }
            <View style={{display: 'flex', flexDirection: 'row', gap: 10, fontSize: 'large', alignItems: 'flex-end'}}>
              <Pressable>{data.doesUserLike ? <FavoriteIcon style={styles.icon} />: <FavoriteBorderIcon style={styles.icon} />}</Pressable>{data.countLike}
              <MapsUgcOutlinedIcon style={styles.icon} />{data.countComment}
            </View>
          </View>
          {replies && (<><Divider orientation="horizontal" sx={{borderColor: Colors.Silver}} />
            <CommentResponse items={replies} reply={reply}/></>)}
    </View> 
)}
const styles = StyleSheet.create({
  commentContainer: {
    display: 'flex',
    flexDirection: Platform.OS  == "web" ? 'columns' : 'row',
    padding: 20,
    justifyContent: 'space-between',
    maxWidth: Platform.OS === 'web' ? 950 : 300,
    backgroundColor: Colors.Jet,
    borderRadius: 10,
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
  },
  commentInfo: {
    display: 'flex',
    flexDirection:  Platform.OS  == "web" ? 'row' : 'columns',
    justifyContent: 'space-between',
    color: Colors.White,
    gap: 5,
  },
  icon: {
    color: Colors.DarkSpringGreen,
    fontSize: Platform.OS  == "web" ? "xx-large" : "x-large",
  },
});
export default Comment
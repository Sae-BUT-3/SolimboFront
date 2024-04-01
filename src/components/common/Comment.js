import React, {useEffect, useState} from 'react';
import {StyleSheet, Pressable, View, Text, Platform} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Importation de FontAwesome depuis react-native-vector-icons
import { Colors } from '../../style/color';
import { Divider } from 'react-native-paper';
import PointTrait from './PointTrait';
import CommentResponse from './CommentResponse';
import axiosInstance from '../../api/axiosInstance';
import Date from './DateT';

const toCapitalCase = (mot) => {
  return mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;
}

const Comment = ({ data}) => {
  const [replies, setReplies] = useState(null);
  const [like, setLike] = useState(false)

  useEffect( ()=>{
    setLike(data.doesUserLike)
  },[data]);

  const handlePress = () =>{
    axiosInstance.post(`comment/${data.id_com}/like`)
      .then(res => {
        if(!like){
          setLike(true)
          data.doesUserLike = true;
          data.countlikes++;
        }else{
          setLike(false)
          data.doesUserLike = false;
          data.countlikes--;
        }
      }).catch(e => console.log(`comment/${data.id_com}/like : ${e.response.data}`));
  }

  const displayReply = () => {
    axiosInstance.get(`/review/${id}`)
    .then(response => {
      setReplies(response.data.comments);
    }).catch(e => console.log(e.response.data));
  }

  const onPress = () => {
    
  }

  return (
    <View key={data?.id_com} style={styles.commentContainer}>
      <View style={styles.commentInfo}>
        <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center'}}>
          <Pressable><Avatar src={data.utilisateur.photo} sx={{ width: Platform.OS === 'web'? 75 : 64, height: Platform.OS === 'web'? 75 : 64}}/></Pressable>
          <View style={{display: 'flex', gap: 5, alignItems: 'center', flexDirection: 'row'}}>
            <Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 30 : 12, fontWeight: 'bold'}}>{data.utilisateur.pseudo}</Text>
            <PointTrait point={true}/>
            <Pressable><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 30 : 12, fontWeight: 'normal'}}>{'@' + data.utilisateur.alias}</Text></Pressable>
          </View>
        </View>
        <Date dateString={data?.createdAt}/>
      </View>
      <View style={{margin: 20}}>
        <Text style={{color: Colors.White, padding: 10, fontSize: 30, fontWeight: 'normal',  textIndent: 20 }}>{toCapitalCase(data.description)}</Text>
      </View>
      <View style={styles.commentInfo}>
        {replies.countComment > 0 ? 
          <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center'}}>
            <Pressable onPress={displayReply}><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 30 : 12, fontWeight: 'normal'}}>{ replies ? ' Voir les réponses ' : "Masquer les réponses"}</Text></Pressable>
            <Divider orientation="vertical" variant="middle" flexItem sx={{borderColor: Colors.Silver}} />
            <Pressable onPress={onPress}><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 30 : 12, fontWeight: 'normal'}}> Répondre</Text></Pressable>
          </View> : <View style={{display: 'flex', flexDirection:'row', gap: 5}}>
            <Pressable onPress={onPress}><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 30 : 12, fontWeight: 'normal'}}> Répondre</Text></Pressable>
          </View>
        }
        <View style={{display: 'flex', flexDirection: 'row', gap: 10, fontSize: 30, alignItems: 'flex-end'}}>
          <Pressable>{like ? <FontAwesome name="heart" size={Platform.OS  == "web" ? 30 : 20} color={Colors.DarkSpringGreen} solid/> : <FontAwesome name="heart" size={Platform.OS  == "web" ? 30 : 20} color={Colors.DarkSpringGreen} regular/>}</Pressable>
          {data.countLike}
          <FontAwesome name="comments" size={Platform.OS  == "web" ? 30 : 20} color={Colors.DarkSpringGreen} />
          {data.countComment}
        </View>
      </View>
      {replies && (
        <>
          <Divider style={styles.divider} />          
          <CommentResponse items={replies}/>
        </>
      )}
    </View> 
  )
}

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
  divider: {
    backgroundColor: Colors.Silver,
    marginVertical: 10, // Espacement vertical
  },
});

export default Comment;

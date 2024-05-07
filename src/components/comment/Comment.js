import React, {useEffect, useState} from 'react';
import {StyleSheet, Pressable, View, Text, Platform, Alert} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome depuis react-native-vector-icons
import { Colors } from '../../style/color';
import { Avatar, Divider } from 'react-native-paper';
import CommentResponse from './CommentResponse';
import axiosInstance from '../../api/axiosInstance';
import Date from '../common/DateT';
import ReadMore from 'react-native-read-more-text';
import { useNavigation} from '@react-navigation/native';
import Tokenizer from '../../utils/Tokenizer';
import ActionsPanel from '../common/ActionsPanel';

const toCapitalCase = (mot) => {
  return mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;
}

const Comment = ({ data, hide}) => {
  const [replies, setReplies] = useState(null);
  const [like, setLike] = useState(false)
  const [countlike, setCountLike] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentUser, setUser] =  useState({});
  const [isActive, setActive] = useState(false);
  const navigation = useNavigation();

  const renderTruncatedFooter = (handlePress) => (
    <Text onPress={handlePress} style={{ color: Colors.SeaGreen, fontSize: Platform.OS == 'web' ? 20 : 17, fontWeight: 'normal' }}>
      Lire plus
    </Text>
  );

  const renderRevealedFooter = (handlePress) => (
    <Text onPress={handlePress} style={{ color: Colors.SeaGreen, fontSize: Platform.OS == 'web' ? 20 : 17, fontWeight: 'normal' }}>
      Lire moins
    </Text>
  );
  const getData = async ()=>{
    setUser(await Tokenizer.getCurrentUser());
  }  
  useEffect( ()=>{
    getData()
    setLike(data.doesUserLike)
    setCountLike(data.countLike)
  },[data]);

  const handlePress = (id) =>{
    axiosInstance.post(`comment/${id}/like`)
      .then(res => {
        if(!like){
          setLike(true)
          setCountLike(countlike+1)
        }else{
          setLike(false)
          setCountLike(countlike-1)
        }
      }).catch(e => console.log(`comment/${id}/like : ${e.response.data}`));
  }

  const displayReply = () => {
    setActive(false);
    if(replies === null) {
      axiosInstance.get(`/comment/${data.id_com}`, {params: {page: 1, pageSize: data.countComment, orderByLike: false}})
      .then(response => {
        setReplies(response.data.comments);
      }).catch(e =>  console.log(`comment/${id} : ${e.response.data}`));
    }else{
      setReplies(null)
    }
  }

  const deleteComment = () =>{
    axiosInstance.delete(`comment/${data.id_com}`)
      .then(res => {
        
      }).catch(e => console.log(`delete comment : ${e.response.data}`));
  }
  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cet commentaire ?',
      [
        {
          text: 'Annuler',
          onPress: () => console.log('Annulation de la suppression'),
          style: 'cancel',
        },
        { text: 'Supprimer', onPress: () => {setActive(false); deleteComment();} },
      ],
      { cancelable: false }
    );
  };

  const actions = [
  {
    name: 'comment-medical',
    handle: ()=>{
      setActive(false); 
      navigation.navigate('Response', {type: 'comment', id: data.id_com})
    },
    color: Colors.SeaGreen,
    text: 'Répondre',
    textColor: Colors.White,
    solid: true,
    size: 30
  },
  (data.countComment > 0 &&{
    name: 'comment-dots',
    handle: displayReply,
    color: Colors.SeaGreen,
    text: replies ? "Masquer les réponses" : 'Afficher les réponses',
    textColor: Colors.White,
    solid: true,
    size: 30
  }),
 (currentUser.id_utilisateur === data.utilisateur.id_utilisateur && {
    name: 'trash-alt',
    handle: handleDelete,
    color: 'red',
    text: 'Supprimer',
    textColor: 'red',
    solid: true,
    size: 24
  })]
  return (
    <View style={styles.commentContainer}> 
    <Pressable onLongPress={() => setActive(!isActive)}>
      <View style={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Pressable>
          <Avatar.Image source={{ uri: data.utilisateur.photo}} size={Platform.OS === 'web'? 75 : 64}/>
        </Pressable>
        <Pressable>
          <Text style={{color: Colors.DarkSpringGreen, fontSize:  19, fontWeight: 'normal'}}>{'@' + data.utilisateur.alias}</Text>
        </Pressable>
      </View>
      <View style={{margin: Platform.OS == 'web' ? 20: 10}}>
        <ReadMore
          numberOfLines={5}
          renderTruncatedFooter={renderTruncatedFooter}
          renderRevealedFooter={renderRevealedFooter}
          onReady={() => setIsExpanded(false)}
          onExpand={() => setIsExpanded(true)}
        >
          <Text style={{color: Colors.White, padding:10, fontSize: 19, fontWeight: 'normal' }}>{toCapitalCase(data.description)}</Text>
        </ReadMore>
      </View>
      <View style={styles.commentInfo}>
        <View style={{display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 10}}> 
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}><View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Pressable onPress={() => handlePress(data.id_com)}>
              {like ? <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} solid/> : <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} regular/>}</Pressable>
            <Text style={{color: Colors.White, padding:10, fontSize:  19, fontWeight: 'normal' }}>{countlike}</Text>
          </View> 
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesome5 name="comments" size={30} color={Colors.DarkSpringGreen} regular/>
            <Text style={{color: Colors.White, padding:10, fontSize:  19, fontWeight: 'normal' }}>{data?.countComment}</Text>
          </View>
          </View>
          <Date dateString={data?.createdAt}/>
        </View>
        {!hide && (data.countComment > 0 ? 
            <>
              <Divider  style={styles.divider}/>
              <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center', justifyContent: 'space-between',marginTop: 10}}>
                <Pressable onPress={displayReply}>
                  <Text style={{color: Colors.DarkSpringGreen, fontSize: 19, fontWeight: 'normal'}}>{ replies ? "Masquer" : 'Voir les réponses '}</Text>
                </Pressable>
                <Pressable onPress={()=>{navigation.navigate('Response',{type: 'comment', id: data.id_com})}}>
                  <Text style={{color: Colors.DarkSpringGreen, fontSize: 19, fontWeight: 'normal'}}> Répondre</Text>
                </Pressable>
              </View>
            </> : 
            <>
              <Divider  style={styles.divider}/>
              <View style={{marginTop: 10, alignItems: 'flex-end'}}>
                <Pressable onPress={()=>{navigation.navigate('Response',{type: 'comment', id: data.id_com})}}><Text style={{color: Colors.DarkSpringGreen, fontSize: 19, fontWeight: 'normal'}}> Répondre</Text></Pressable>
              </View>
            </>)
          }
      </View>
      </Pressable>
      {replies && (
        <>
          <Divider style={[styles.divider,{marginBottom: 15}]}/>          
          <CommentResponse items={replies}/>
        </>
      )}
      {isActive && <ActionsPanel actions={actions}/>}
    </View> 
  )
}

const styles = StyleSheet.create({
  commentContainer: {
    display: 'flex',
    padding: Platform.OS === 'web' ? 20 : 15,
    width: Platform.OS != 'web' ? 386 : 950,
    backgroundColor: Colors.Jet,
    borderRadius: 15,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 3 : 0, 
  },
  commentInfo: {
    display: 'flex',
  },
  divider: {
    backgroundColor: Colors.BattleShipGray,
    marginTop: 10,
  },
});

export default Comment;

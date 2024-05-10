import React, { useEffect, useState }from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from '../../style/color';
import { Avatar, Divider, List } from "react-native-paper";
import DateT from "../common/DateT";
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome depuis react-native-vector-icons
import ReadMore from 'react-native-read-more-text';
import axiosInstance from '../../api/axiosInstance';
import { useNavigation } from "@react-navigation/native";
import ActionsPanel from "../common/ActionsPanel";
import Tokenizer from "../../utils/Tokenizer";

const toCapitalCase = (mot) => {
    return mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;
}

const Response = ({data})=>{
    const [like, setLike] = useState(false)
    const [countlike, setCountLike] = useState(0)
    const [isExpanded, setIsExpanded] = useState(false);
    const navigation = useNavigation();
    const [replies, setReplies] = useState(null);
    const [currentUser, setUser] =  useState({});
    const [isActive, setActive] = useState(false);

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
        textColor: '#d62828',
        solid: true,
        size: 24
      })]
    const handlePress = () =>{
      axiosInstance.post(`comment/${data.id_com}/like`)
        .then(res => {
          if(!like){
            setLike(true)
            setCountLike(countlike++)
          }else{
            setLike(false)
            setCountLike(countlike--)
          }
        }).catch(e => console.log(`comment/${data.id_com}/like : ${e.response.data}`));
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

    return (
        <Pressable onLongPress={()=>setActive(!isActive)}>
        <List.Item
            title={
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 5, alignItems: 'center' }}>
                    <Pressable onPress={()=> navigation.navigate('user', {id: data.utilisateur.id_utilisateur })}>
                        <Avatar.Image source={{ uri: data?.utilisateur.photo }} size={Platform.OS === 'web' ? 75 : 54} />
                    </Pressable>
                    <Pressable onPress={()=> navigation.navigate('user', {id: data.utilisateur.id_utilisateur })}>
                        <Text style={{ color: Colors.DarkSpringGreen, fontSize: Platform.OS === "web" ? 18 : 16, fontWeight: 'normal' }}>{'@' + data.utilisateur.alias}</Text>
                    </Pressable>
                </View>
            }
            description={
                <View>
                    <ReadMore
                        numberOfLines={5}
                        renderTruncatedFooter={renderTruncatedFooter}
                        renderRevealedFooter={renderRevealedFooter}
                        onReady={() => setIsExpanded(false)}
                        onExpand={() => setIsExpanded(true)}
                    >
                        <Text style={{color: Colors.White, padding:10, fontSize: 19, fontWeight: 'normal' }}>{toCapitalCase(data.description)}</Text>
                    </ReadMore>                                
                    <View style={styles.commentInfo}>
                        <View style={{display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}> 
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <Pressable onPress={handlePress}>{like ? <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} solid/> : <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} regular/>}</Pressable>
                                <Text style={{color: Colors.White, padding:10, fontSize:  19, fontWeight: 'normal' }}>{countlike}</Text>
                            </View> 
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <FontAwesome5 name="comments" size={30} color={Colors.DarkSpringGreen} regular/>
                                <Text style={{color: Colors.White, padding:10, fontSize:  19, fontWeight: 'normal' }}>{data?.countComment}</Text>
                            </View>
                        </View>   
                        <DateT dateString={data?.createdAt}/>
                    </View>
                    {data.countComment > 0 ? 
                        <>
                        <Divider  style={[styles.divider, {backgroundColor: Colors.Onyx}]}/>
                        <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'baseline', justifyContent: 'space-between', marginTop: 9}}>
                            <Pressable onPress={displayReply}>
                            <Text style={{color: Colors.DarkSpringGreen, fontSize: 19, fontWeight: 'normal'}}>{ replies ? "Masquer" : ' Voir les réponses '}</Text>
                            </Pressable>
                            <Pressable onPress={()=>{navigation.navigate('Response',{type: 'comment', id: data.id_com})}}>
                            <Text style={{color: Colors.DarkSpringGreen, fontSize:  19, fontWeight: 'normal'}}> Répondre</Text>
                            </Pressable>
                        </View>
                        </> : 
                        <>
                        <Divider  style={styles.divider}/>
                        <View style={{marginTop: 9, alignItems: 'flex-start'}}>
                            <Pressable onPress={()=>{navigation.navigate('Response',{type: 'comment', id: data.id_com})}}><Text style={{color: Colors.DarkSpringGreen, fontSize: 19, fontWeight: 'normal'}}> Répondre</Text></Pressable>
                        </View>
                        </>
                    }
                </View>
            }
        />
        {replies && (<><Divider style={styles.divider} /><CommentResponse items={replies}/></>)}
        {isActive && <ActionsPanel actions={actions}/>}
        </Pressable>
    )
}

const CommentResponse = ({items}) => {  
    return (
        <List.Section style={styles.list}>
            {items.map((data, index) => (
                <React.Fragment>
                    <Response key={index} data={data}/>
                    {index < items.length - 1 ? <Divider style={styles.divider}   /> : null}
                </React.Fragment>
            ))}
        </List.Section>
    );
}

const styles = StyleSheet.create({
    list: {
        maxWidth: Platform.OS === 'web' ? 950 : 360,
        display: 'flex',
        flexDirection: 'column'
    },
    divider: {
        backgroundColor: Colors.BattleShipGray,
    },
    commentInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    icon: {
        fontSize: Platform.OS === "web" ? 24 : 20,
    }
});

export default CommentResponse;
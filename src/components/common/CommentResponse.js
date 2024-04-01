import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Importation de FontAwesome depuis react-native-vector-icons
import { Divider, Avatar, List } from 'react-native-paper'; // Importation des composants de react-native-paper
import { Colors } from '../../style/color';
import PointTrait from './PointTrait';
import axiosInstance from '../../api/axiosInstance';
import Date from './DateT';

const CommentResponse = ({items}) => {
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

    return (
        <List.Section style={styles.list}>
            {items.map((data, index) => (
                <React.Fragment key={data?.id_com}>
                    <List.Item
                        title={
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Avatar.Image source={{ uri: data?.utilisateur.photo }} size={Platform.OS === 'web' ? 75 : 64} />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ color: Colors.DarkSpringGreen, fontSize: Platform.OS === "web" ? 18 : 16, fontWeight: 'bold' }}>{data.utilisateur.pseudo}</Text>
                                        <PointTrait />
                                        <Pressable onPress={() => reply({ data: data, type: 'comment' })}>
                                            <Text style={{ color: Colors.DarkSpringGreen, fontSize: Platform.OS === "web" ? 18 : 16, fontWeight: 'normal' }}>{'@' + data.utilisateur.alias}</Text>
                                        </Pressable>
                                    </View>
                                </View>
                                <Date dateString={data?.createdAt} />
                            </View>
                        }
                        description={
                            <View style={{ marginVertical: 20 }}>
                                <Text style={{ color: Colors.White, padding: 10, fontSize: 18, fontWeight: 'normal', textIndent: 20 }}>{data.text}</Text>
                                <View style={styles.commentInfo}>
                                    {data.countComment > 0 ?
                                        <Pressable onPress={displayReply}>
                                            <Text style={{ color: Colors.DarkSpringGreen, fontSize: Platform.OS === "web" ? 18 : 16, fontWeight: 'normal' }}>{replies ? ' Voir les réponses ' : "Masquer les réponses"}</Text>
                                        </Pressable>
                                        :
                                        <Pressable onPress={() => reply({ data: data, type: 'comment' })}>
                                            <Text style={{ color: Colors.DarkSpringGreen, fontSize: Platform.OS === "web" ? 18 : 16, fontWeight: 'normal' }}> Répondre</Text>
                                        </Pressable>
                                    }
                                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                    <Pressable>{like ? <FontAwesome name="heart" size={Platform.OS  == "web" ? 30 : 20} color={Colors.DarkSpringGreen} solid/> : <FontAwesome name="heart" size={Platform.OS  == "web" ? 30 : 20} color={Colors.DarkSpringGreen} regular/>}</Pressable>
                                    {data.countLike}
                                    <FontAwesome name="comments" size={Platform.OS  == "web" ? 30 : 20} color={Colors.DarkSpringGreen} />
                                    {data.countComment}
                                    </View>
                                </View>
                            </View>
                        }
                    />
                    {index < items.length - 1 ? <Divider style={styles.divider} leftInset={true}  /> : null}
                    {replies && (<><Divider style={styles.divider} /><CommentResponse items={replies} /></>)}
                </React.Fragment>
            ))}
        </List.Section>
    );
}

const styles = StyleSheet.create({
    list: {
        maxWidth: Platform.OS === 'web' ? null : 360,
    },
    commentInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    icon: {
        fontSize: Platform.OS === "web" ? 24 : 20,
    },
    divider: {
        backgroundColor: Colors.Silver,
        marginVertical: 10, // Espacement vertical
    },
});

export default CommentResponse;
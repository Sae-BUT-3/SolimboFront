import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome depuis react-native-vector-icons
import { Divider, Avatar, List } from 'react-native-paper'; // Importation des composants de react-native-paper
import { Colors } from '../../style/color';
import ReadMore from 'react-native-read-more-text';
import axiosInstance from '../../api/axiosInstance';
import Date from './DateT';

const CommentResponse = ({items, onToggleSnackBar, response }) => {
    const [replies, setReplies] = useState(null);
    const [like, setLike] = useState(false)
    const [countlike, setCountLike] = useState(0)
    const [isExpanded, setIsExpanded] = useState(false);

    const renderTruncatedFooter = (handlePress) => (
        <Text onPress={handlePress} style={{ color: Colors.SeaGreen, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal' }}>
        Voir plus
        </Text>
    );

    const renderRevealedFooter = (handlePress) => (
        <Text onPress={handlePress} style={{ color: Colors.SeaGreen, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal' }}>
        Voir moins
        </Text>
    );

    useEffect(()=>{
      setLike(data.doesUserLike)
      setCountLike(data.countLike)
    },[data]);
  
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

    const displayReply = (id) => {
        axiosInstance.get(`/review/${id}`)
        .then(response => {
          setReplies(response.comments);
        }).catch(e => console.log(e.response.data));
    }
    return (
        <List.Section style={styles.list}>
            {items.map((data, index) => (
                <React.Fragment key={data?.id_com}>
                    <List.Item
                        title={
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Avatar.Image source={{ uri: data?.utilisateur.photo }} size={Platform.OS === 'web' ? 75 : 64} />
                                <Pressable>
                                    <Text style={{ color: Colors.DarkSpringGreen, fontSize: Platform.OS === "web" ? 18 : 16, fontWeight: 'normal' }}>{'@' + data.utilisateur.alias}</Text>
                                </Pressable>
                            </View>
                        }
                        description={
                            <View style={{ marginVertical: 20 }}>
                                <ReadMore
                                    numberOfLines={5}
                                    renderTruncatedFooter={renderTruncatedFooter}
                                    renderRevealedFooter={renderRevealedFooter}
                                    onReady={() => setIsExpanded(false)}
                                    onExpand={() => setIsExpanded(true)}
                                >
                                    <Text style={{color: Colors.White, padding:10, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal' }}>{toCapitalCase(data.description)}</Text>
                                </ReadMore>                                
                                <View style={styles.commentInfo}>
                                    <View style={{display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}> 
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}><View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                        <Pressable onPress={handlePress}>{like ? <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} solid/> : <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} regular/>}</Pressable>
                                        <Text style={{color: Colors.White, padding:10, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal' }}>{countlike}</Text>
                                    </View> 
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                        <FontAwesome5 name="comments" size={30} color={Colors.DarkSpringGreen} regular/>
                                        <Text style={{color: Colors.White, padding:10, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal' }}>{data?.countComment}</Text>
                                    </View>
                                    </View>
                                    <Date dateString={data?.createdAt}/>
                                    </View>
                                    {data.countComment > 0 ? 
                                        <>
                                        <Divider  style={styles.divider}/>
                                        <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center', marginTop: 9}}>
                                            <Pressable onPress={()=>{displayReply(data.id_com)}}>
                                            <Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 30 : 19, fontWeight: 'normal'}}>{ replies ? ' Voir les réponses ' : "Masquer les réponses"}</Text>
                                            </Pressable>
                                            <Divider style={{ height: '100%', width: 1, backgroundColor: Colors.Silver }} bold/>
                                            <Pressable onPress={()=>{response(data)}}>
                                            <Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 30 : 19, fontWeight: 'normal'}}> Répondre</Text>
                                            </Pressable>
                                        </View>
                                        </> : 
                                        <>
                                        <Divider  style={styles.divider}/>
                                        <View style={{marginTop: 9, alignItems: 'flex-end'}}>
                                            <Pressable onPress={()=>{response(data)}}><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 30 : 19, fontWeight: 'normal'}}> Répondre</Text></Pressable>
                                        </View>
                                        </>
                                    }
                                </View>
                            </View>
                        }
                    />
                    {index < items.length - 1 ? <Divider style={styles.divider} leftInset={true}  /> : null}
                    {replies && (<><Divider style={styles.divider} /><CommentResponse items={replies} onToggleSnackBar={onToggleSnackBar} /></>)}
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
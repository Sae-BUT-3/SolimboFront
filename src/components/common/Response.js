import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar, Divider, List } from "react-native-paper";
import DateT from "./DateT";
import { Colors } from "../../style/color";
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome depuis react-native-vector-icons
import ReadMore from 'react-native-read-more-text';
import axiosInstance from '../../api/axiosInstance';
import { useNavigation } from "@react-navigation/native";
import CommentResponse from "./CommentResponse";

const toCapitalCase = (mot) => {
    return mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;
}

const Response = ({data})=>{
    const [like, setLike] = useState(false)
    const [countlike, setCountLike] = useState(0)
    const [isExpanded, setIsExpanded] = useState(false);
    const navigation = useNavigation();
    const [replies, setReplies] = useState(null);

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

    const displayReply = () => {
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
        <>
        <List.Item
            title={
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 5, alignItems: 'center' }}>
                    <Avatar.Image source={{ uri: data?.utilisateur.photo }} size={Platform.OS === 'web' ? 75 : 64} />
                    <Pressable>
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
                        <Text style={{color: Colors.White, padding:10, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal' }}>{toCapitalCase(data.description)}</Text>
                    </ReadMore>                                
                    <View style={styles.commentInfo}>
                        <View style={{display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}> 
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <Pressable onPress={handlePress}>{like ? <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} solid/> : <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} regular/>}</Pressable>
                                <Text style={{color: Colors.White, padding:10, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal' }}>{countlike}</Text>
                            </View> 
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <FontAwesome5 name="comments" size={30} color={Colors.DarkSpringGreen} regular/>
                                <Text style={{color: Colors.White, padding:10, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal' }}>{data?.countComment}</Text>
                            </View>
                        </View>   
                        <DateT dateString={data?.createdAt}/>
                    </View>
                    {data.countComment > 0 ? 
                        <>
                        <Divider  style={styles.divider}/>
                        <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center', justifyContent: 'space-between', marginTop: 9}}>
                            <Pressable onPress={displayReply}>
                            <Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 25 : 19, fontWeight: 'normal'}}>{ replies ? "Masquer" : ' Voir les réponses '}</Text>
                            </Pressable>
                            <Pressable onPress={()=>{navigation.navigate('Response',{type: 'comment', id: data.id_com})}}>
                            <Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 25 : 19, fontWeight: 'normal'}}> Répondre</Text>
                            </Pressable>
                        </View>
                        </> : 
                        <>
                        <Divider  style={styles.divider}/>
                        <View style={{marginTop: 9, alignItems: 'flex-end'}}>
                            <Pressable onPress={()=>{navigation.navigate('Response',{type: 'comment', id: data.id_com})}}><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 30 : 19, fontWeight: 'normal'}}> Répondre</Text></Pressable>
                        </View>
                        </>
                    }
                </View>
            }
        />
        {replies && (<><Divider style={styles.divider} /><CommentResponse items={replies}/></>)}
        </>
    )
}

const styles = StyleSheet.create({
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
        backgroundColor: Colors.BattleShipGray,
    },
});

export default Response;
import React, {useState} from 'react';
import {StyleSheet, Pressable, View, Text, Platform} from 'react-native';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Avatar from '@mui/material/Avatar';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import {List, ListItem, Divider, ListItemText, ListItemAvatar} from '@mui/material';
import PointTrait from './PointTrait';
import { Colors } from '../../style/color';
import axiosInstance from '../../api/axiosInstance';

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

const CommentResponse = ({items, reply}) => {
    const [replies, setReplies] = useState(null);
    const displayReply = () => {
        axiosInstance.get(`/review/${id}`)
        .then(response => {
          setReplies(response.data.comments);
        }).catch(e => console.log(e.response.data));
    }
    return (
        <List sx={{maxWidth: Platform.OS === 'web' ? null : 360,}}>
            {items.map((data, index) => (
                <React.Fragment key={data?.id_com}>
                    <ListItem key={data?.id_com} alignItems="flex-start" sx={{maxWidth: Platform.OS === 'web' ? 950 : 300,}}>
                        <ListItemAvatar>
                            <Pressable><Avatar src={data?.utilisateur.photo} sx={{ width: Platform.OS === 'web'? 75 : 64, height: Platform.OS === 'web'? 75 : 64}} /></Pressable>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <View style={{display: 'flex', justifyContent: 'space-between', flexDirection:'row', marginLeft: 5}}>
                                    <View style={{display: 'flex', gap: 5, alignItems: 'center', flexDirection:'row'}}>
                                        <Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'bold'}}>{data.utilisateur.pseudo}</Text>
                                        <PointTrait point={true}/>
                                        <Pressable><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'normal'}}>{'@' + data.utilisateur.alias}</Text></Pressable>
                                    </View>
                                    <Text style={{color: Colors.White, fontSize: 'medium', fontWeight: 'normal' }}>{transformerDate(data?.createdAt)}</Text>
                                </View>
                            }
                            secondary={
                                <React.Fragment>
                                    <View style={{margin: 20}}>
                                        <Text style={{color: Colors.White, padding:10, fontSize: 'large', fontWeight: 'normal',  textIndent: 20 }}>{data.text}</Text>
                                    </View>
                                    <View style={[styles.commentInfo, showReplies ? paddingBottom: 20]}>
                                        {data.countComment > 0 ? 
                                            <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center'}}>
                                                <Pressable onPress={displayReply}><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'normal'}}>{ replies ? ' Voir les réponses ' : "Masquer les réponses"}</Text></Pressable>
                                                <Divider orientation="vertical" variant="middle" flexItem sx={{borderColor: Colors.Silver}} />
                                                <Pressable onPress={()=>{reply({data: data, type: 'comment'})}}><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'normal'}}> Répondre</Text></Pressable>
                                            </View> : 
                                            <View style={{display: 'flex', flexDirection:'row', gap: 5}}>
                                                <Pressable onPress={()=>{reply({data: data, type: 'comment'})}}><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'normal'}}> Répondre</Text></Pressable>
                                            </View>
                                        }
                                        <View style={{display: 'flex', flexDirection: 'row', gap: 10, fontSize: 'large', alignItems: 'flex-end'}}>
                                            <Pressable>{data.doesUserLike ? <FavoriteIcon style={styles.icon} />: <FavoriteBorderIcon style={styles.icon} />}</Pressable>{data.countLike}
                                            <MapsUgcOutlinedIcon style={styles.icon} />{data.countComment}
                                        </View>
                                    </View>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    { index < items.length - 1 ? <Divider orientation='horizontal' variant="inset" component="li" sx={{borderColor: Colors.Silver}} /> : null}
                    {replies && (<><Divider sx={{borderColor: Colors.Silver}}/><CommentResponse items={replies} reply={reply}/></>)}
                </React.Fragment>
            ))}
        </List>  
    );
}


const styles = StyleSheet.create({
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

export default  CommentResponse; 
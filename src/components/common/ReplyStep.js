import React, {useState} from 'react';
import {StyleSheet, Pressable, View, Text, Platform} from 'react-native';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { Colors } from '../../style/color';

const toCapitalCase = (mot) => {
    return mot.charAt(0).toUpperCase() + mot.slice(1);
}
const ReplyStep = ({steps, setAuthor, setOpen}) =>{
    const [showReplies, setShowReplies] = useState(false);

    const displayReply = () => {
      setShowReplies(!showReplies);
    }

    
    return(
        <View>
        {steps.map((data, index) => (
          <View key={data.id} style={styles.commentContainer}>
            <View style={styles.commentInfo}>
              <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center'}}>
                  <Avatar src={data?.userProfile} sx={{ width: Platform.OS === 'web'? 75 : 64, height: Platform.OS === 'web'? 75 : 64}}/>
                  <View style={{display: 'flex', gap: 10, alignItems: 'center'}}>
                    <Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'bold'}}>{data.username}</Text>
                    <Pressable><Text style={{color: Colors.DarkSpringGreen, fontSize: Platform.OS  === "web" ? 'large' : 'medium', fontWeight: 'normal'}}>{'@' + data.username}</Text></Pressable>
                  </View>
              </View>
              <Text style={{color: Colors.White, fontSize: 'medium', fontWeight: 'normal' }}>Il y a 1 h</Text>
            </View>
            <View style={{display: 'flex', gap:10}}> 
            {index === steps.length - 1 ? null : <Divider sx={{backgroundColor: Colors.Onyx }} orientation="vertical" />}
              <View>
                <Text style={{color: Colors.White, padding:10, fontSize: 'large', fontWeight: 'normal',  textIndent: 20 }}>{toCapitalCase(data.text)}</Text></View>
                <View style={styles.commentInfo}>
                {data?.replies.length > 0 ? 
                    <View style={{display: 'flex', flexDirection:'row', gap: 5}}>
                      <Pressable onPress={displayReply}><Text style={{color: Colors.DarkSpringGreen, fontSize: 'medium', fontWeight: 'normal', paddingLeft:10}}>Voir les réponses</Text></Pressable>
                    </View> : <View style={{display: 'flex', flexDirection:'row', gap: 5}}>
                    <Pressable  onPress={() => {
                      setAuthor(data);
                      setOpen(true)}}>
                        <Text style={{color: Colors.DarkSpringGreen, fontSize: 'medium', fontWeight: 'normal', paddingLeft:10}}>Répondre</Text></Pressable>
                    </View>
                }
                <View style={{display: 'flex', flexDirection: 'row', gap: 5, fontSize: 'large'}}>
                  <Pressable>{data?.doesUserLike ? <FavoriteIcon style={styles.icon} />: <FavoriteBorderIcon style={styles.icon} />}</Pressable>{data.likes}
                  <MapsUgcOutlinedIcon style={styles.icon} />{data?.replies.length}
                </View>
              </View>  
            </View>
            {showReplies && (<><Divider sx={{ backgroundColor: Colors.Licorice}} component="li"/><ReplyStep steps={data.replies} setAuthor={setAuthor} setOpen={setOpen}/></>)}
          </View>
        ))}
      </View>
    )
}

const styles = StyleSheet.create({
    commentContainer: {
      display: 'flex',
      flexDirection: Platform.OS  == "web" ? 'columns' : 'row',
      padding: 20,
      justifyContent: 'space-between',
      maxWidth: Platform.OS === 'web' ? "auto" : 300,
    },
    commentInfo: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      color: Colors.White,
      gap: 5
    },
    icon: {
      color: Colors.DarkSpringGreen,
      fontSize: Platform.OS  == "web" ? "xx-large" : "x-large",
    },
  });

export default ReplyStep
import React, { useEffect, useState } from 'react';
import {StyleSheet, Pressable, View, Text, Platform} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import { Avatar } from 'react-native-elements';
import {Rating} from 'react-native-ratings';
import { Colors } from '../../style/color';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../../api/axiosInstance';
import Date from './DateT';

const toCapitalCase = (mot) => {
    if(mot == 'artist') mot =  mot + 'e'
    return mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;
}

const Review = ({ data}) => {
  const navigation = useNavigation();
  const [like, setLike] = useState(false)
  
  useEffect( ()=>{
    setLike(data.doesUserLike)
  },[data]);

  const handlePress = () =>{
    axiosInstance.post(`review/${data.id_review}/like`)
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
      }).catch(e => console.log(`review/${data.id_review}/like : ${e.response.data}`));
  }

  const handleCommentButtonClick = () => {
    navigation.navigate('Comment', {id: data.id_review})
  };

  const goTo = (_id, type) => {
    if(_id && type){
      switch(type){
          case 'single':
          case 'album':
          case 'compliation':
            navigation.navigate('Oeuvre', {type: 'album', id : data.id });
            break;
      }
    }
  }

  return (
    <><View key={data.id_review} style={styles.reviewContainer}>
        <View style={styles.reviewerInfo}>
          <View style={{display: 'flex', flexDirection: 'row', gap: 5,}}>
            <Pressable onPress={() => goTo(data.id, data.type)}>
              <Avatar source={{ uri: data.oeuvre.image }} size={Platform.OS === 'web'? 90 : 64} containerStyle={{  borderRadius: 10,boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }} />
            </Pressable>
            <View style={{display: 'flex', gap: 5, paddingLeft: 10}}>
              <Text style={{color: Colors.White, fontSize: 20, fontWeight: 'bolder'}}>{toCapitalCase(data.oeuvre.name)}</Text>
              {data.type != 'artist' ?
                <Text style={{color: Colors.White, fontSize: 20, fontWeight: 'normal' }}>{toCapitalCase(data.oeuvre.artiste)}</Text> : null
              }
              <Text style={{color: Colors.White, fontSize: 20, fontWeight: 'normal' }}>{toCapitalCase(data.oeuvre.type)}</Text>
            </View>
          </View>
          <View style={{display: 'flex', gap: 5,}}>
            <Rating
              type="custom"
              ratingCount={5}
              imageSize={Platform.OS === 'web'? 30 : 25}
              tintColor={Colors.Jet}
              ratingColor={Colors.DarkSpringGreen}
              ratingBackgroundColor={Colors.Licorice}
              startingValue={data.note}
              readonly
            />
            <Pressable><Text style={{color: Colors.DarkSpringGreen, fontSize: 20, fontWeight: 'normal', textAlign: 'right' }}>{'@' + data.utilisateur.pseudo}</Text></Pressable>
          </View>
        </View>
        <View style={{margin: 20}}><Text style={{color: Colors.White, padding:10, fontSize: 20, fontWeight: 'normal',  textIndent: 20 }}>{toCapitalCase(data.description)}</Text></View>
        <View style={styles.reviewerInfo}>
          <View style={{display: 'flex', flexDirection: 'row', gap: 10, fontSize: 30, alignItems: 'flex-end'}}>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 10}}>
              <Pressable onPress={handlePress}>
                {like ?  <FontAwesome5 name="heart" size={Platform.OS  == "web" ? 30 : 20} color={Colors.DarkSpringGreen} solid  />: <FontAwesome5 name="heart" size={Platform.OS  == "web" ? 30 : 20} color={Colors.DarkSpringGreen} regular/>}
              </Pressable>
              <Text style={{color: Colors.White, fontSize: 20}}>{data.countlike}</Text>
            </View>
            <View  style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 10}}>
              <Pressable onPress={() => handleCommentButtonClick()}>
                <FontAwesome5  name="comment-dots" size={Platform.OS  == "web" ? 30 : 20} color={Colors.DarkSpringGreen} regular/>
              </Pressable>
              <Text style={{color: Colors.White, fontSize: 20}}>{data.countComment}</Text>
            </View>
          </View>
          <Date dateString={data.createdAt}/>
        </View>
    </View>
    </>
)}
const styles = StyleSheet.create({
  reviewContainer: {
    backgroundColor: Colors.Jet,
    display: 'flex',
    flexDirection: Platform.OS  == "web" ? 'columns' : 'row',
    marginBottom: 20,
    marginLeft: Platform.OS  == "web" ? 20 : 10,
    marginRight: Platform.OS  == "web" ? 20 : 10,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'space-between',
    maxWidth: Platform.OS === 'web' ? 950 : 300,
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' 
  },
  reviewerInfo: {
    display: 'flex',
    flexDirection: Platform.OS  == "web" ? 'row' : 'columns',
    justifyContent: 'space-between',
    color: Colors.White
  },
});
export default Review

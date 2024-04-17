import React, { useEffect, useState } from 'react';
import {StyleSheet, Pressable, View, Text, Platform} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import { Avatar } from 'react-native-elements';
import {Rating} from 'react-native-ratings';
import { Colors } from '../../style/color';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../../api/axiosInstance';
import Date from './DateT';
import PointTrait from './PointTrait';
import ReadMore from 'react-native-read-more-text';

const toCapitalCase = (mot) => {
    if(mot == 'artist') mot =  mot + 'e'
    return mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;
}

const Review = ({ data}) => {
  const navigation = useNavigation();
  const [like, setLike] = useState(false)
  const [countlikes, setCountLikes] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false);

  const renderTruncatedFooter = (handlePress) => (
    <Text onPress={handlePress} style={{ color: Colors.SeaGreen, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal' }}>
      Lire plus
    </Text>
  );

  const renderRevealedFooter = (handlePress) => (
    <Text onPress={handlePress} style={{ color: Colors.SeaGreen, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal' }}>
      Lire moins
    </Text>
  );

  useEffect( ()=>{
    setLike(data.doesUserLike)
    setCountLikes(data.countlike)
  },[data]);

  const handlePress = () =>{
    axiosInstance.post(`review/${data.id_review}/like`)
      .then(res => {
        if(!like){
          setLike(true)
          setCountLikes(countlikes + 1);
        }else{
          setLike(false)
          setCountLikes(countlikes - 1);
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
          <View style={{display: 'flex', flexDirection: 'row', gap: 5}}>
            <Pressable onPress={() => goTo(data.oeuvre.id, data.oeuvre.type)}>
              <Avatar source={{ uri: data.oeuvre.image }} size={Platform.OS === 'web'? 90 : 74} containerStyle={{  borderRadius: 10,shadowColor: Colors.Onyx,
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: Platform.OS === 'android' ? 3 : 0, }} />
            </Pressable>
            <View style={{display: 'flex', paddingLeft: 10}}>
              <Text style={{color: Colors.White, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'bold'}}>{toCapitalCase(data.oeuvre.name)}</Text>
              <Text style={{color: Colors.White, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal' }}>{toCapitalCase(data.oeuvre.type)}</Text>
            </View>
          </View>
          <View style={{display: 'flex', gap: 9, flexDirection: Platform.OS == 'web' ? 'column' : 'row', alignItems: Platform.OS != 'web' ? 'center' : null}}>
            <Rating
              type="custom"
              ratingCount={5}
              imageSize={30}
              tintColor={Colors.Jet}
              ratingColor={Colors.DarkSpringGreen}
              ratingBackgroundColor={Colors.Licorice}
              startingValue={data.note}
              readonly
            />
            {Platform.OS != 'web' && <PointTrait point={true}/>}
            <Pressable><Text style={{color: Colors.DarkSpringGreen, fontSize: 20 , fontWeight: 'normal', textAlign: 'right' }}>{'@' + data.utilisateur.alias}</Text></Pressable>
          </View>
        </View>
        <View style={{margin: Platform.OS == 'web' ? 20: 5}}>
          <ReadMore
              numberOfLines={5}
              renderTruncatedFooter={renderTruncatedFooter}
              renderRevealedFooter={renderRevealedFooter}
              onReady={() => setIsExpanded(false)}
              onExpand={() => setIsExpanded(true)}
            >
            <Text style={{color: Colors.White, padding:10, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal' }}>{toCapitalCase(data.description)}</Text>
          </ReadMore>
        </View>
        <View style={[styles.reviewerInfo, {flexDirection: 'row', marginTop: 10}]}>
          <View style={{display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'flex-end'}}>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 10}}>
              <Pressable onPress={handlePress}>
                {like ?  <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} solid  />: <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} regular/>}
              </Pressable>
              <Text style={{color: Colors.White, fontSize: 20}}>{countlikes}</Text>
            </View>
            <View  style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 10}}>
              <Pressable onPress={() => handleCommentButtonClick()}>
                <FontAwesome5  name="comment-dots" size={30} color={Colors.DarkSpringGreen} regular/>
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
    marginBottom: Platform.OS == 'web' ? 30 : 20,
    marginLeft: Platform.OS  == "web" ? 20 : 0,
    marginRight: Platform.OS  == "web" ? 20 : 0,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'space-between',
    maxWidth: Platform.OS === 'web' ? 950 : null,
    width: Platform.OS != 'web' ? 386 : null,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 3 : 0, 
  },
  reviewerInfo: {
    display: 'flex',
    flexDirection: Platform.OS  == "web" ? 'row' : 'columns',
    justifyContent: 'space-between',
    color: Colors.White
  },
});
export default Review

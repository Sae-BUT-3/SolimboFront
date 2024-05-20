import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, Pressable, Platform, Linking} from 'react-native';
import { Colors } from '../../style/color';
import { FontAwesome5, FontAwesome} from '@expo/vector-icons'; 
import {useNavigation} from '@react-navigation/native'
import { Rating } from 'react-native-ratings';
import { Divider } from 'react-native-paper';
import axiosInstance from '../../api/axiosInstance';

const Track = ({data}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [like, setLike] = useState(false)
    const [countlikes, setCountLikes] = useState(0)
    const navigation = useNavigation();

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handlePress = () =>{
        axiosInstance.post(`oeuvre/${data.type}/${data.id}/like`)
          .then(res => {
            if(!like){
              setLike(true)
              setCountLikes(countlikes + 1);
            }else{
              setLike(false)
              setCountLikes(countlikes - 1);
            }
          }).catch(e => console.log(`oeuvre/${data.type}/like : ${e.response.data}`));
    }

    const linkto = () => {
        Linking.openURL(data.spotify_url);
    };

    const openReview =  ()=>{
        navigation.navigate('review', {type: data.type, id: data.id})   
    }
    
    useEffect( ()=>{  
        setLike(data.doesUserLike)
        setCountLikes(data.likeCount)
      },[data]);
    return (
        <Pressable
            activeOpacity={1}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={[
            styles.container,
            isHovered ? styles.itemHovered : null
            ]}
        >
            <View style={styles.item}>
                <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                    <Text style={{color: Colors.White, fontSize: 17}}>{data.name}</Text>
                    <Rating
                        type="custom"
                        ratingCount={5}
                        imageSize={35}
                        ratingColor={Colors.DarkSpringGreen}
                        tintColor={Colors.Jet}
                        ratingBackgroundColor={Colors.Onyx}
                        startingValue={data.rating}
                        fractions={1}
                        readonly
                    />  
                </View>                  
                <Divider style={[styles.divider,{marginBottom: 10}]}/>
                <View style={styles.sectionIcon}>
                    <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center'}}>
                        <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center'}}>
                            <Pressable onPress={handlePress}>{like ?  <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} solid  />: <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} regular/>}</Pressable>
                            <Text style={{color: Colors.White, fontSize: 20, textAlign: Platform.OS !== 'web'? 'center' : undefined}}>{countlikes}</Text>
                        </View>
                        <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center'}}>
                            <Pressable onPress={openReview}><FontAwesome name="pencil-square-o" size={30} color={Colors.DarkSpringGreen} regular/></Pressable>
                            <Text style={{color: Colors.White, fontSize: 20, textAlign: Platform.OS !== 'web'? 'center' : undefined}}>{data.reviewCount}</Text>
                        </View>
                    </View>
                    <Pressable onPress={linkto}><FontAwesome5 name="play-circle" size={40} color={Colors.DarkSpringGreen} solid/></Pressable>
                </View>
            </View>
        </Pressable>
    )
}
const styles = StyleSheet.create({
    container: { 
        backgroundColor: Colors.Jet,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 15,
        width: Platform.OS != 'web' ? 386 : 950,
        shadowColor: Colors.Onyx,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: Platform.OS === 'android' ? 3 : 0, 
        transition: 'background-color 0.3s ease',
    },
    item: {
        display:'flex',
        gap: 10,
        justifyContent: 'space-around'
    },
    itemHovered: {
        backgroundColor: Colors.Onyx, // Fond avec effet de fondu
    },
    divider: {
        backgroundColor: Colors.BattleShipGray,
        marginTop: 10,
    },
    sectionIcon : {
        display:  "flex",
        flexDirection:"row",
        justifyContent: 'space-between'
    }
});
export default Track
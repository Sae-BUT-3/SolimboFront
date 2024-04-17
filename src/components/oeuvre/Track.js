import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, Pressable, Platform} from 'react-native';
import { Colors } from '../../style/color';
import { FontAwesome5} from '@expo/vector-icons'; 
import {Link, useNavigation} from '@react-navigation/native'
import { Rating } from 'react-native-ratings';
import { Divider } from 'react-native-paper';

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
        axiosInstance.post(`oeuvre/${data.type}/like`)
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
    
    useEffect( ()=>{  
        setLike(data.doesUserLike)
        setCountLikes(data.countlike)
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
            onPress= {()=>{
                navigation.navigate('Oeuvre', {id: data.id, type: 'track' });
            }}
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
                        readonly
                    />  
                </View>                  
                <Divider style={[styles.divider,{marginBottom: 10}]}/>
                <View style={styles.sectionIcon}>
                    <View style={{display: 'flex', flexDirection:'row', gap: 10, alignItems: 'center'}}>
                        <Pressable onPress={handlePress}>{like ?  <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} solid  />: <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} regular/>}</Pressable>
                        <Text style={{color: Colors.White, fontSize: 20, textAlign: Platform.OS !== 'web'? 'center' : undefined}}>{countlikes}</Text>
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
        marginLeft: Platform.OS == 'web' ? 30 : 20,
        borderRadius: 15,
        maxWidth: Platform.OS === 'web' ? 950 : null,
        width: Platform.OS != 'web' ? 386 : null,
        shadowColor: Colors.Onyx,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: Platform.OS === 'android' ? 3 : 0, 
        transition: 'background-color 0.3s ease',
        marginBottom: 15
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
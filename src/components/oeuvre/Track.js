import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Platform, Linking } from 'react-native';
import { Colors } from '../../style/color';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import { Divider } from 'react-native-paper';
import axiosInstance from '../../api/axiosInstance';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Track = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [like, setLike] = useState(false);
  const [countLikes, setCountLikes] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    setLike(data.doesUserLike);
    setCountLikes(data.likeCount);
  }, [data]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleLikePress = () => {
    axiosInstance.post(`oeuvre/${data.type}/${data.id}/like`)
      .then(res => {
        setLike(!like);
        setCountLikes(like ? countLikes - 1 : countLikes + 1);
      })
      .catch(e => console.log(`oeuvre/${data.type}/like : ${e.response.data}`));
  };

  const openReview = () => {
    navigation.navigate('review', { type: data.type, id: data.id });
  };

  const openSpotify = () => {
    Linking.openURL(data.spotify_url);
  };

  return (
    <Pressable
      activeOpacity={1}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={[
        styles.container,
        isHovered && styles.itemHovered
      ]}
    >
      <View style={styles.item}>
        <View style={styles.header}>
          <Text style={styles.title}>{data.name}</Text>
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
        <Divider style={styles.divider} />
        <View style={styles.actions}>
          <View style={styles.actionGroup}>
            <Pressable onPress={handleLikePress}>
              <FontAwesome5
                name={like ? "heart" : "heart-o"}
                size={30}
                color={Colors.DarkSpringGreen}
                solid={like}
              />
            </Pressable>
            <Text style={styles.actionText}>{countLikes}</Text>
          </View>
          <View style={styles.actionGroup}>
            <Pressable onPress={openReview}>
              <FontAwesome name="pencil-square-o" size={30} color={Colors.DarkSpringGreen} />
            </Pressable>
            <Text style={styles.actionText}>{data.reviewCount}</Text>
          </View>
          <Pressable onPress={openSpotify}>
            <FontAwesome5 name="play-circle" size={40} color={Colors.DarkSpringGreen} solid />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.Jet,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 3 : 0,
    width: Platform.OS === 'web'? wp('80%') : wp('90%'),
    marginBottom: 20,
  },
  item: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: Colors.White,
    fontSize: 17,
  },
  divider: {
    backgroundColor: Colors.BattleShipGray,
    marginTop: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: Colors.White,
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 5,
  },
  itemHovered: {
    backgroundColor: Colors.Onyx,
  },
});

export default Track;

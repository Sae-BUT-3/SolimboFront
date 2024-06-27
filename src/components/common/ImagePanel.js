import React, { useState } from "react";
import { FlatList, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../style/color';
import { Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from '../../api/axiosInstance';
import GestureRecognizer from "react-native-swipe-gestures";
import screenStyle from "../../style/screenStyle";
import { useTranslation } from 'react-i18next';
const ImagePanel = ({ avatars, type, show, onRefresh }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const closeModal = () => {
    setIsModalVisible(false);
    show(false);
  };

  const handleFollow = (item) => {
    const endpoint = type === 'artist' || item?.type === 'artist' ? '/users/follow' : '/amis/unfollow';
    const id = type === 'artist' || item?.type === 'artist' ? { artistId: item.id } : { amiIdUtilisateur: item.id_utilisateur };

    axiosInstance.post(endpoint, id)
      .then(() => onRefresh())
      .catch(() => console.log('An internal server error occurred. Please try again later.'));
  };

  return (
    <GestureRecognizer onSwipeDown={closeModal}>
      <Modal
        isVisible={isModalVisible}
        style={styles.modal}
        swipeDirection={['down']}
        onSwipeComplete={closeModal}
        onBackdropPress={closeModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.panelContainer}>
          <View style={{ paddingTop: 37 }}>
            <Pressable onPress={closeModal}>
              <FontAwesome name="close" size={30} color={Colors.Silver} />
            </Pressable>
          </View>
          <View style={styles.panelContent}>
            <FlatList
              data={avatars}
              renderItem={({ item }) => (
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarInfo}>
                    <Pressable onPress={() => {
                      closeModal();
                      navigation.navigate(type === 'artist' ? 'artist' : 'user', { id: item.id || item.id_utilisateur });
                    }}>
                      <Avatar.Image size={56} source={{ uri: type === 'user' || item?.type === 'user' ? item?.photo : item?.image }} />
                    </Pressable>
                    <Text numberOfLines={1} style={styles.panelText}>
                      {type === 'user' || item?.type === 'user' ? item?.pseudo : item?.name}
                    </Text>
                  </View>
                  <Pressable style={screenStyle.followButton} onPress={() => handleFollow(item)}>
                    <Text style={styles.buttonText}>
                      {(type === 'user' || item?.type === 'user') || item.doesUserFollow ? t('friend.followed') : t('friend.follow')}
                    </Text>
                  </Pressable>
                </View>
              )}
              showsVerticalScrollIndicator={true}
            />
          </View>
        </View>
      </Modal>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  panelContainer: {
    flex: 1,
    backgroundColor: Colors.Jet,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 300,
  },
  panelContent: {
    backgroundColor: Colors.Onyx,
    borderRadius: 15,
    justifyContent: 'space-around',
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    flexWrap: 'wrap',
  },
  avatarInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 15,
  },
  panelText: {
    color: Colors.White,
    fontSize: 20,
    marginBottom: 20,
    maxWidth: 185,
  },
  buttonText: {
    color: Colors.White,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default ImagePanel;
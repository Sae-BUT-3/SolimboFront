import React, { useEffect, useState } from 'react';
import {FlatList, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import { Avatar, Searchbar } from 'react-native-paper';
import { Colors } from '../../style/color';
import axiosInstance from '../../api/axiosInstance';
import { Modal } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons'; // Importation de FontAwesome5
import Filter from '../search/Filter';
import GestureRecognizer from 'react-native-swipe-gestures';
import Tokenizer from '../../utils/Tokenizer';

const Follower = ({ id, type, isVisible }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  const { t } = useTranslation();
  const getData = async () => {
    setCurrentUser(await Tokenizer.getCurrentUser());
  };

  const closeModal = () => {
      setIsModalVisible(false);
      isVisible(false);
  };

    const handleFollowToggle = (follow, userId) => {
        const endpoint = follow ? '/amis/unfollow' : '/amis/follow';
        axiosInstance.post(endpoint, { amiIdUtilisateur: userId })
            .then(updateData)
            .catch(e => console.log(e.response.data));
    };

    const updateData = () => {
        if (type === 'follower') {
            axiosInstance.get(`/artist/${id}/followers`)
                .then(response => {
                    setData(response.data.allFollowers);
                })
                .catch(e => console.log(e.response.data));
        }
    };

    useEffect(() => {
        getData();
        updateData();
    }, []);

    return (
        <GestureRecognizer onSwipeDown={closeModal}>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Pressable onPress={closeModal}>
                            <FontAwesome name="close" size={30} color={Colors.Silver} />
                        </Pressable>
                    </View>
                    <View style={styles.panelContent}>
                        <Searchbar
                            placeholder="Rechercher..."
                            onChangeText={setSearchQuery}
                            value={searchQuery}
                            iconColor={Colors.White}
                            rippleColor={Colors.White}
                            placeholderTextColor={Colors.White}
                            selectionColor={Colors.DarkSpringGreen}
                            style={styles.searchbar}
                            inputStyle={{ color: Colors.White }}
                        />
                        <FlatList
                            data={data.filter(item => 
                                item.pseudo.toLowerCase().includes(searchQuery.toLowerCase())
                            )}
                            keyExtractor={(item) => item.id_utilisateur.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.listItem}>
                                    <View style={styles.userInfo}>
                                        <Avatar.Image size={56} source={{ uri: item.photo }} />
                                        <Text style={styles.panelText}>{item.pseudo}</Text>
                                    </View>
                                    {currentUser.id_utilisateur !== item.id_utilisateur && (
                                        <Pressable
                                            style={screenStyle.followButton}
                                            onPress={() => handleFollowToggle(item.areFriends, item.id_utilisateur)}
                                        >
                                            <Text style={styles.buttonText}>
                                                {item.areFriends ? 'Suivi(e)' : '+ Suivre'}
                                            </Text>
                                        </Pressable>
                                    )}
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
    container: {
        flex: 1,
        backgroundColor: Colors.Jet,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: 200,
        paddingLeft: 20,
        paddingRight: 20,
    },
    header: {
        paddingTop: 37,
    },
    panelContent: {
        backgroundColor: Colors.Onyx,
        borderRadius: 15,
        justifyContent: 'space-around',
        marginTop: 10,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    panelText: {
        color: Colors.White,
        fontSize: 17,
        marginBottom: 20,
    },
    buttonText: {
        color: Colors.White,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
    listItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    searchbar: {
        backgroundColor: Colors.Jet,
        marginBottom: 15,
    },
});

export default Follower;

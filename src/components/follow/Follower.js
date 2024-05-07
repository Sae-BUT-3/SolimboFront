import React, { useEffect, useState } from 'react';
import {FlatList, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import { Avatar, Searchbar } from 'react-native-paper';
import { Colors } from '../../style/color';
import axiosInstance from '../../api/axiosInstance';
import { Modal } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons'; // Importation de FontAwesome5
import Filter from '../search/Filter';

const Follower = ({id, type, isVisible}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const  [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [onlyFriend, setOnlyFriends] = useState(false);

    const openModal = () => {
      setIsModalVisible(true);
    };
  
    const closeModal = () => {
      setIsModalVisible(false);
      isVisible(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const handlePress = (follow, id) => {
        if(!follow){
            axiosInstance.post('/amis/follow', {amiIdUtilisateur: id})
            .then(response => {
                updateData()
            }).catch(e => console.log(e.response.data));
        }else{
            axiosInstance.post('/amis/unfollow', {amiIdUtilisateur: id})
            .then(response => {
                updateData()
            }).catch(e => console.log(e.response.data));
        }
    }

    const updateData = ()=>{
        if(type == 'follower'){ 
            axiosInstance.get(`/artist/${id}/followers`)
            .then(response => {
                setData(response.data.allFollowers);
            }).catch(e => console.log(e.response.data));
        }
    }

    useEffect(() => {
       if(type == 'follower'){ 
            axiosInstance.get(`/artist/${id}/followers`)
            .then(response => {
                setData(response.data.allFollowers);
            }).catch(e => console.log(e.response.data));
        }
    }, []);

    return (
        <Modal
            isVisible={isModalVisible}
            style={styles.modal}
            swipeDirection={['down']}
            onSwipeComplete={closeModal}
            onBackdropPress={closeModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.container}>
                <View style={{ paddingTop: 37 }}>
                    <Pressable onPress={closeModal}>
                        <FontAwesome name="close" size={30} color={Colors.White} />
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
                        dividerColor={Colors.White}
                        elevation={3}
                        inputStyle={{color: Colors.White}}
                        style={{backgroundColor: Colors.Jet, marginBottom: 15}}
                    />
                    <FlatList
                        data={data.filter(item => 
                            item.pseudo.toLowerCase().includes(searchQuery.toLowerCase()))
                        }
                        renderItem={({item}) => 
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 15}}>
                                    <Avatar.Image size={56} source={{ uri: item.photo }} />
                                    <Text style={styles.panelText}>{item.pseudo}</Text>
                                </View>
                                <Pressable style={styles.followButton}
                                    activeOpacity={1}
                                    onPress={() => handlePress(item.areFriends, item.id_utilisateur)}
                                >
                                    {item.areFriends ? <Text style={styles.buttonText}>Suivi(e)</Text> : <Text style={styles.buttonText}>+ Suivre</Text>  }
                                </Pressable >
                            </View>
                        }
                    />
                </View>   
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0
    },
    container: {
        flex: 1,
        backgroundColor: Colors.Jet,
        paddingLeft: 20,
        paddingRight: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    panelContent: {
        backgroundColor: Colors.Onyx,
        borderRadius: 15,
        justifyContent: 'space-around',
        marginTop: 10,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10
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
        fontSize: 15
      },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
    followButton: {
        backgroundColor: Colors.SeaGreen,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: Colors.Onyx,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: Platform.OS === 'android' ? 4 : 0, 
        transition: 'background-color 0.3s ease'
    },
    btnHovered: {
        backgroundColor: Colors.SeaGreen, 
    },
});

export default Follower;

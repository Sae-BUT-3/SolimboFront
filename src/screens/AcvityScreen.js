import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ImageBackground, Platform, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import axiosInstance from "../api/axiosInstance";
import { Colors } from '../style/color';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Loader from '../components/common/Loader';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import screenStyle from '../style/screenStyle';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const ActivityScreen = () => {
    const [tab, setTab] = useState('2');
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const navigation = useNavigation();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        update();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const update = () => {
        setIsLoading(true);
        axiosInstance.get('/amis/request')
            .then((res) => {
                setRequests(res.data.requestsReceived);
            })
            .catch(error => {
                console.error('Error fetching friend requests:', error);
                Toast.show({
                    type: 'error',
                    text1: '❌  Une erreur est survenue lors du chargement des demandes.',
                    text1Style: { color: Colors.White },
                    position: 'bottom'
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const accept = (id) => {
        axiosInstance.post('/amis/accept', { amiIdUtilisateur: id })
            .then((res) => {
                update();
                Toast.show({
                    type: 'success',
                    text1: '✅  Demande d\'ami acceptée.',
                    text1Style: { color: Colors.White },
                    position: 'bottom'
                });
            })
            .catch(error => {
                console.error('Error accepting friend request:', error);
                Toast.show({
                    type: 'error',
                    text1: '❌  Une erreur est survenue lors de l\'acceptation de la demande.',
                    text1Style: { color: Colors.White },
                    position: 'bottom'
                });
            });
    };

    const reject = (id) => {
        axiosInstance.post('/amis/unfollow', { amiIdUtilisateur: id })
            .then((res) => {
                update();
                Toast.show({
                    type: 'success',
                    text1: '✅  Demande d\'ami refusée.',
                    text1Style: { color: Colors.White },
                    position: 'bottom'
                });
            })
            .catch(error => {
                console.error('Error rejecting friend request:', error);
                Toast.show({
                    type: 'error',
                    text1: '❌  Une erreur est survenue lors du refus de la demande.',
                    text1Style: { color: Colors.White },
                    position: 'bottom'
                });
            });
    };

    useEffect(() => {
        update();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.tab}>
                <Pressable
                    style={[styles.tabButton, { backgroundColor: tab === '1' ? Colors.Onyx : Colors.Jet }]}
                    onPress={() => setTab('1')}>
                    <Text style={styles.buttonText}>Activité</Text>
                </Pressable>
                <Pressable
                    style={[styles.tabButton, { backgroundColor: tab === '2' ? Colors.Onyx : Colors.Jet }]}
                    onPress={() => setTab('2')}>
                    <Text style={styles.buttonText}>Demande d'ami</Text>
                </Pressable>
            </View>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    {tab === '2' ? (
                        <FlatList
                            data={requests}
                            renderItem={({ item }) => (
                                <View style={styles.requestContainer}>
                                    <Pressable onPress={() => navigation.navigate('user', { id: item.id_utilisateur })}>
                                        <Avatar.Image size={56} source={{ uri: item.photo }} />
                                    </Pressable>
                                    <Text numberOfLines={1} style={[styles.text, { color: Colors.White }]}>
                                        {item.pseudo}
                                    </Text>
                                    <View style={styles.buttonsContainer}>
                                        <Pressable
                                            style={styles.button}
                                            onPress={() => accept(item.id_utilisateur)}>
                                            <FontAwesome name='check' color={Colors.White} size={20} />
                                        </Pressable>
                                        <Pressable
                                            style={[styles.button, { backgroundColor: Colors.Red }]}
                                            onPress={() => reject(item.id_utilisateur)}>
                                            <FontAwesome name='close' color={Colors.White} size={20} />
                                        </Pressable>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={
                                <View style={screenStyle.emptyListContainer}>
                                    <ImageBackground
                                        source={require('../assets/images/main_logo_v1_500x500.png')}
                                        style={screenStyle.emptyImage}
                                    />
                                    <Text style={screenStyle.text}>Aucune demande d'ami en attente</Text>
                                </View>
                            }
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={[Colors.SeaGreen]}
                                    tintColor={Colors.SeaGreen}
                                />
                            }
                        />
                    ) : (
                        <View style={styles.activityContainer}>
                            <ImageBackground
                                source={require('../assets/images/main_logo_v1_500x500.png')}
                                style={screenStyle.emptyImage}
                            />
                            <Text style={screenStyle.text}>Aucune activité récente</Text>
                        </View>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Licorice,
        paddingTop: 50,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    tab: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: Colors.Jet,
        borderRadius: 30,
        width: widthPercentageToDP('80%'),
    },
    tabButton: {
        borderRadius: 30,
        width: widthPercentageToDP('35%'),
        paddingVertical: 15,
        backgroundColor: Colors.Onyx
    },
    buttonText: {
        color: Colors.White,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    requestContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: Colors.Jet,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: Colors.SeaGreen,
        borderRadius: 30,
        padding: 10,
        marginHorizontal: 5,
    },
    activityContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        gap: 20
    },
});

export default ActivityScreen;

import React, { useEffect, useState, useCallback } from 'react';
import { Modal, View, ScrollView, Pressable, Text, Image, KeyboardAvoidingView, Platform  } from 'react-native';
import modalStyle from '../style/modalStyle';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../style/color';
import Searchbar from './search/Searchbar';
import axiosInstance from '../api/axiosInstance';
import SearchResult from './search/SearchResult';
import StarRating from 'react-native-star-rating-widget';
import MultilineInput from './form/MultilineInput';
import ErrorRequest from './common/ErrorRequest';
import Loader from './common/Loader';
import pressableBasicStyle from '../style/pressableBasicStyle';
import Tokenizer from '../utils/Tokenizer';
import PointTrait from './common/PointTrait';
import { Avatar, Divider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

const ModalPostReview = ({ visible, onClose }) => {
    const [filter, setFilter] = useState([]);
    const [items, setItems] = useState(null);
    const [messageText, setMessageText] = useState("Recherchez une œuvre ou un artiste pour rédiger une critique");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // L'œuvre concernée par la critique
    const [musicItem, setMusicItem] = useState(null);
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState("");
    const [currentUser, setUser] = useState({});

    const getData = async () => {
        setUser(await Tokenizer.getCurrentUser());
    }

    useEffect(() => {
        getData();
        // Fetch search filters when the component mounts
        axiosInstance.get('/spotify/Searchfilters').then(response => {
            setFilter(response.data.filter(item => item.id !== 'user'));
        });
    }, [])

    const handleSearch = useCallback((query) => {
        if (!query.text.length) {
            setItems([])
            setMessageText('Recherchez une œuvre ou un artiste pour rédiger une critique')
            return
        }
        const params = {
            query: query.text,
            spotify_filter: query.filters.join(","),
            limit: 20
        }
        axiosInstance.get("/spotify/search", {
            params
        }).then(response => {
            setItems(response.data)
            if (response.data.length > 0) {
                setMessageText(null)
                return
            }
            setMessageText('Pas de résultat pour cette recherche')
        })
        .catch(error => {
            setError(error.response.data);
        })
    }, []);

    return (
       
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
                style={modalStyle.modalContainer}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <View style={modalStyle.modal}>
                        <View style={modalStyle.modalHeader}>
                            <FontAwesome name="close" size={30} color={Colors.Silver} onPress={onClose} />
                            <Text style={modalStyle.modalTitle}>Rédaction d'une critique</Text>
                            <FontAwesome name="pencil-square-o" size={25} color={Colors.Silver} onPress={onClose} />
                        </View>
                        <Divider style={{ backgroundColor: Colors.BattleShipGray }} />
                        {isLoading ? <Loader /> : <KeyboardAwareScrollView
                            contentContainerStyle={{ flexGrow: 1 }}
                            extraHeight={150}
                            enableResetScrollToCoords={false}
                            enableOnAndroid={true}
                            enableAutomaticScroll={true}
                            keyboardOpeningTime={0}
                            style={{ flex: 1 }}
                        >
                            <View style={{ marginTop: 15 }}>
                                {musicItem === null ? (
                                    <>
                                        <Searchbar filters={filter} keyPressHandler={handleSearch} includeCancelButton={false} />
                                        <View style={{ backgroundColor: Colors.Jet, borderRadius: 15, paddingLeft: 5, paddingTop: 5, height: "100%" }}>
                                            <ScrollView>
                                                {
                                                    items?.map((item, index) => (
                                                        <SearchResult
                                                            key={index}
                                                            imageURL={item.imageURL}
                                                            title={item.title}
                                                            subtitle={item.subtitle}
                                                            rounded={item.type === 'artist'}
                                                            onPress={() => setMusicItem(item)}
                                                        />
                                                    ))
                                                }
                                                {messageText && <Text style={modalStyle.messageText}>{messageText}</Text>}
                                            </ScrollView>
                                        </View>
                                    </>
                                ) : (
                                    <View style={modalStyle.reviewContainer}>
                                        <View style={{ gap: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                            <Image
                                                source={{ uri: musicItem.imageURL || require('../assets/images/profil.png') }}
                                                style={{ width: 150, height: 150, borderRadius: 5 }}
                                            />
                                            <View style={{ gap: 5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                                <Text numberOfLines={1} style={{ color: Colors.White, fontSize: 20, fontWeight: 'normal', maxWidth: 210, paddingLeft: 5, textAlign: 'center' }}>{musicItem.title}</Text>
                                                {musicItem.subtitle && (
                                                    <>
                                                        <PointTrait point={true} />
                                                        <Text numberOfLines={1} style={{ color: Colors.Silver, fontSize: 19, fontWeight: 'normal', maxWidth: 150, textAlign: 'center' }}>{musicItem.subtitle}</Text>
                                                    </>
                                                )}
                                            </View>
                                        </View>

                                        <View style={modalStyle.textContainer}>
                                            <View style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'flex-start', alignItems: 'center', marginBottom: 5 }}>
                                                <Avatar.Image source={{ uri: currentUser.photo || require('../assets/images/profil.png') }} size={45} accessibilityLabel={currentUser.pseudo} />
                                                <Text style={{ color: Colors.SeaGreen, fontSize: 19, fontWeight: 'normal' }}>{'@' + currentUser.alias}</Text>
                                            </View>
                                            <StarRating
                                                rating={rating}
                                                onChange={setRating}
                                                starSize={40}
                                                color={Colors.DarkSpringGreen}
                                                emptyColor={Colors.Onyx}
                                                enableSwiping={true}
                                            />
                                            <MultilineInput
                                                placeholder="Rédiger votre critique..."
                                                value={description}
                                                onChangeText={setDescription}
                                                maxLength={1500}
                                            />
                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                <Pressable
                                                    style={[pressableBasicStyle.button, { backgroundColor: '#d62828', width: 150 }]}
                                                    onPress={() => { 
                                                        setMusicItem(null); 
                                                        setRating(0); 
                                                    }}
                                                >
                                                    <FontAwesome size={20} name='close' color={Colors.White} style={{ paddingRight: 10 }} regular />
                                                    <Text style={pressableBasicStyle.button_text}>Annuler</Text>
                                                </Pressable>
                                                <Pressable
                                                    style={[pressableBasicStyle.button, { width: 150 }]}
                                                    onPress={() => {
                                                        setIsLoading(true);
                                                        axiosInstance.put('/review', { idOeuvre: musicItem.id, note: rating, description: description, type: musicItem.type })
                                                        .then(response => {
                                                            setMusicItem(null);
                                                            setRating(0);
                                                            setIsLoading(false);
                                                            Toast.show({
                                                                type: 'sucess',
                                                                text2: '✅ Votre critique a bien été postée.'
                                                            });
                                                        })
                                                        .catch(error => {
                                                            console.log(error)
                                                            setIsLoading(false);
                                                            setError(error.response.data);
                                                            onClose();
                                                            Toast.show({
                                                                type: 'error',
                                                                text2: '❌ Votre critique n\'a pas pu être postée.'
                                                            });
                                                        })
                                                    }}
                                                >
                                                    <FontAwesome size={20} name='send-o' color={Colors.White} style={{ paddingRight: 10 }} />
                                                    <Text style={pressableBasicStyle.button_text}>Poster</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </KeyboardAwareScrollView>}
                    </View>
                </KeyboardAvoidingView>
            </Modal>
    );
};

export default ModalPostReview;

import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Pressable, Text, Image, KeyboardAvoidingView, Platform  } from 'react-native';
import modalStyle from '../style/modalStyle';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../style/color';
import Searchbar from '../components/search/Searchbar';
import axiosInstance from '../api/axiosInstance';
import SearchResult from '../components/search/SearchResult';
import StarRating from 'react-native-star-rating-widget';
import MultilineInput from '../components/form/MultilineInput';
import Loader from '../components/common/Loader';
import pressableBasicStyle from '../style/pressableBasicStyle';
import Tokenizer from '../utils/Tokenizer';
import PointTrait from '../components/common/PointTrait';
import { Avatar, Divider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import screenStyle from '../style/screenStyle';
import searchStyle from '../style/searchStyle';
import { FlatList } from 'react-native';

const AddButtonScreen = () => {
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
    console.log(filter)
    useEffect(() => {
        getData();
        // Fetch search filters when the component mounts
        axiosInstance.get('/spotify/Searchfilters').then(response => {
            setFilter(response.data.filter(item => item.id !== 'user' && item.id !== 'artist'));
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
            spotify_filter:  query.filters.join(","),
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
        Platform.OS == 'web' ?
        isLoading ? <Loader /> : 
            <View style={screenStyle.container}>
                {musicItem === null ? (
                    <FlatList
                        data={items}
                        renderItem={({ item, index }) => (
                            <SearchResult
                                key={index.toString()}  // Utilisation de index.toString() pour la clé du composant
                                imageURL={item.imageURL}
                                title={item.title}
                                subtitle={item.subtitle}
                                rounded={false}
                                onPress={() => setMusicItem(item)}
                            />
                        )}
                        contentContainerStyle={
                            { flex: 1, justifyContent: 'flex-start', gap: 5, padding: 15, alignItems: 'center'}
                        }
                        ListHeaderComponentStyle={{marginLeft: 30, alignItems: 'center'}}
                        style={{marginTop: 15}}
                        keyExtractor={(item, index) => index.toString()}  // Clé unique pour chaque élément
                        ListEmptyComponent={messageText && <Text style={modalStyle.messageText}>{messageText}</Text>}
                        ListHeaderComponent={<Searchbar filters={filter} keyPressHandler={handleSearch} includeCancelButton={true} />}
                    />
                    ) : (
                    <View style={[modalStyle.reviewContainer, {marginTop: 10}]}>
                        <View style={{ gap: 10, justifyContent: 'center', alignItems: 'center'}}>
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
                                    style={[pressableBasicStyle.button, { width: 150 }]}
                                    onPress={() => {
                                        setIsLoading(true);
                                        axiosInstance.put('/review', { idOeuvre: musicItem.id, note: rating, description: description, type: musicItem.type })
                                        .then(response => {
                                            setMusicItem(null);
                                            setRating(0);
                                            setDescription("");
                                            setIsLoading(false);
                                            Toast.show({
                                                type: 'success',
                                                text1: '✅  Votre critique a bien été postée.',
                                                text1Style: {color: Colors.White}
                                            });
                                        })
                                        .catch(error => {
                                            console.log(error)
                                            setIsLoading(false);
                                            setError(error.response.data);
                                            Toast.show({
                                                type: 'error',
                                                text1: '❌  Votre critique n\'a pas pu être postée.',
                                                text1Style: {color: Colors.White}
                                            });
                                        })
                                    }}
                                >
                                    <FontAwesome size={20} name='send-o' color={Colors.White} style={{ paddingRight: 10 }} />
                                    <Text style={pressableBasicStyle.button_text}>Poster</Text>
                                </Pressable>
                                <Pressable
                                    style={[pressableBasicStyle.button, { backgroundColor: Colors.Red, width: 150 }]}
                                    onPress={() => { 
                                        setMusicItem(null); 
                                        setRating(0); 
                                        setDescription("");
                                    }}
                                >
                                    <FontAwesome size={20} name='close' color={Colors.White} style={{ paddingRight: 10 }} regular />
                                    <Text style={pressableBasicStyle.button_text}>Annuler</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>)}
            </View> : null
)}

export default AddButtonScreen;
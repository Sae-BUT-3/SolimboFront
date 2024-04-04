import React, {useEffect, useState, useCallback} from 'react';
import { Modal, View, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import modalStyle from '../style/modalStyle';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../style/color';
import Searchbar from './search/Searchbar';
import axiosInstance from '../api/axiosInstance';
import SearchResult from './search/SearchResult';
import searchStyle from '../style/searchStyle';
import StarRating from 'react-native-star-rating-widget';
import PressableBasic from './pressables/PressableBasic';
import MultilineInput from './form/MultilineInput';

const ModalPostReview = ({ visible, onClose }) => {
    const [filter, setFilter] = useState([]);
    const [items, setItems] = useState([]);
    const [messsageText, setMesssageText] = useState("Recherchez vos artistes, musiques ou amis");

    // L'oeuvre concernée par la critique
    //const [musicItem, setMusicItem] = useState([]);
    const [musicItem, setMusicItem] = useState({"id": "6gBFPUFcJLzWGx4lenP6h2", "imageURL": "https://i.scdn.co/image/ab67616d0000b273f54b99bf27cda88f4a7403ce", "subtitle": "Travis Scott", "title": "goosebumps", "type": "track"});
    
    const [rating, setRating] = useState(0);

    const [description, setDescription] = useState("");
    
    const [reviewObject, setReviewObject] = useState({
        "idOeuvre": "",
        "description": "",
        "note": 0,
        "type": ""
    });

    useEffect(() => {
        // Fetch search filters when the component mounts
        axiosInstance.get('/spotify/Searchfilters').then(response => {
            setFilter(response.data);
        });
    }, [])

    function handleSerch(query){
        if(!query.text.length) {
            setItems([])
            return
        }
        const params = {
            query: query.text,
            spotify_filter: query.filters.join(","),
            limit: 20
        }
        axiosInstance.get("/spotify/search",{
            params
        }).then(response => {
            setItems(response.data)
            if(response.data.length > 0){
                setMesssageText(null)
                return
            }
            setMesssageText('Pas de résulat pour cette recherche')
        })
    }

    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
        style={modalStyle.modalContainer}
        >
            <View style={modalStyle.modal}>
                <View style={modalStyle.modalHeader}>
                    <FontAwesome5 name="times" size={24} color={Colors.Silver} onPress={onClose} />
                    {/* <Text style={modalStyle.modalTitle}>Post a review</Text> */}
                </View>
                <View>
                {musicItem.length === 0 ? (
                    <>
                        <Searchbar filters={filter} keyPressHandler={query => handleSerch(query)} includeCancelButton={false}/>
                        <ScrollView style={searchStyle.container}>
                            {
                                items.map((item, index) => (
                                    <View
                                    key={index}
                                    style={searchStyle.resultItemContainer}>
                                        <SearchResult
                                            key={index}
                                            imageURL={item.imageURL}
                                            title={item.title}
                                            subtitle={item.subtitle}
                                            rounded={item.type === 'user' || item.type === 'artist'}
                                            onPress={() => setMusicItem(item)}
                                        />
                                    </View>
                                ))
                            }
                        </ScrollView>
                    </> 
                ) : (
                    
                    <View style={modalStyle.reviewContainer}>
                        
                        <ScrollView style={modalStyle.musicItemContainer} scrollEnabled={false}>
                                <SearchResult
                                imageURL={musicItem.imageURL}
                                title={musicItem.title}
                                subtitle={musicItem.subtitle}
                                rounded={false}
                                // onPress={() => setMusicItem(item)}
                                />
                        </ScrollView> 
                        
                        <StarRating
                            rating={rating}
                            onChange={setRating}
                            starSize={55}
                            color={Colors.DarkSpringGreen}
                            emptyColor={Colors.BattleShipGray}
                            enableSwiping={true}
                        />

                        <MultilineInput
                            placeholder="Indiquez votre avis ici"
                            multiline={true}
                            numberOfLines={4}
                            value={description}
                            onChangeText={setDescription}
                        />

                        <PressableBasic
                            text="Poster ma review"
                            onPress={() => {
                                setReviewObject({ idOeuvre: musicItem.id, note: rating, description: description, type: musicItem.type })
                                axiosInstance.put('/solimbo/review', reviewObject)
                                .then(response => {
                                    console.log(response)
                                })
                                .catch(error => {
                                    console.log(error)
                                    Alert.alert("Erreur", "Une erreur est survenue lors de l'envoi de votre critique +\n", error.response.data.message)
                                })
                            }}
                        />

                    </View>
                )}
                </View>
            </View>
        </Modal>
    );
};

export default ModalPostReview;
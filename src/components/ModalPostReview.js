import React, {useEffect, useState} from 'react';
import { Modal, View } from 'react-native';
import modalStyle from '../style/modalStyle';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../style/color';
import Searchbar from './search/Searchbar';
import axiosInstance from '../api/axiosInstance';
import SearchResult from './search/SearchResult';

const ModalPostReview = ({ visible, onClose }) => {
    const [filter, setFilter] = useState([]);
    const [items, setItems] = useState([]);

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
                    <Searchbar filters={filter} keyPressHandler={query => handleSerch(query)}/>
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
                                />
                            </View>
                        ))
                    }
                </View>
            </View>
        </Modal>
    );
};

export default ModalPostReview;
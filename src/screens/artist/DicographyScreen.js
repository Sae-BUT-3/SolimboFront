import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, ScrollView, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import axiosInstance from '../../api/axiosInstance';
import { Colors } from '../../style/color';
import ItemPopup from '../../components/artist/ItemPopup';
import Loader from '../../components/Loader';
import ErrorRequest from '../../components/ErrorRequest';
import { useNavigation, useRoute } from '@react-navigation/native';
import Filter from '../../components/search/Filter';

const DiscograpyScreen = () => {
    const navigation = useNavigation( ); 
    const scrollY = useRef(new Animated.Value(0)).current;
    const [albums, setAlbums] = useState([]);
    const [album, setDisplayAlbum] = useState(true);
    const [singles, setSingles] = useState([]);
    const [single, setDisplaySingles] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const route = useRoute();
    const id  = route.params?.id || null;

    useEffect(() => {
        axiosInstance.get('/spotify/fetchArtistSongs',{params: {
            id: id, 
            filter: 'single',
            limit: 50
        },})
        .then(response => {
            setSingles(response.data);
        }).catch(e => setError(e.response.data));

        axiosInstance.get('/spotify/fetchArtistSongs',{params: {
            id: id, 
            filter: 'album',
            limit: 50
        },})
        .then(response => {
            setAlbums(response.data);
            setIsLoading(false);
        }).catch(e => setError(e.response.data));
    },[]);

    const filtrer = (item) =>{
        if(item === "Singles"){
            setDisplaySingles(!single);
            setDisplayAlbum(false);
        } 
        else if (item ==="Albums"){
            setDisplayAlbum(!album);
            setDisplaySingles(false);
        }else{
            setDisplayAlbum(!album);
            setDisplaySingles(!single);
        }
    }

    if (error) {
        return <ErrorRequest err={error} />;
    }
    return (
        <View style={styles.container}>
        {isLoading ? (
            <Loader />
        ) : (
            <>
                <Animated.View style={styles.header}>
                    <Pressable onPress={() => { navigation.goBack() }}>
                        <FontAwesome5 name="arrow-left" size={30} color={Colors.SeaGreen}/>
                    </Pressable>
                    <Text style={styles.title}>Discographie</Text>
                    <Text/>
                </Animated.View>
                <ScrollView>
                    <View style={{display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 30, flexWrap: 'wrap'}}>
                        <FontAwesome5 name="filter" size={20} color={Colors.SeaGreen} regular/>
                        {["Albums", "Singles"].map((item, index) => (
                            <Filter
                                key={index}
                                onPressHandler={()=>{filtrer(item)}}
                                text={item}
                            />
                        ))}
                                
                    </View>
                    <View style={styles.item}>
                    {album &&( albums.sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);
                            return dateA - dateB;
                        }).map((item) => (
                            <ItemPopup key={item.id} data={item} />
                        )))
                    }
                    {single && (singles.sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);
                            return dateA - dateB;
                        }).map((item) => (
                            <ItemPopup key={item.id} data={item} />
                        )))
                  }
                  </View>
                </ScrollView>
            </>
        )}
    </View>
)}


const styles = StyleSheet.create({
 container: {
   backgroundColor: Colors.Licorice,
   borderRadius: 20,
   padding: 30,
   position: 'relative',
 },
 header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 20 : 10,
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    marginBottom: Platform.OS === 'web' ? 30 : 20,
},
 title: {
   fontSize: Platform.OS === 'web' ? 35 : 30,
   fontWeight: 'bold',
   color: Colors.SeaGreen
 },
 item: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-between',
    alignContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 30
 },
 sectionTitle: {
    color: Colors.SeaGreen,
    fontWeight: 'bold',
    fontSize: 27,
  },
});


export default DiscograpyScreen;

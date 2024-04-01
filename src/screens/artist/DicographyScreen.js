import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import axiosInstance from '../../api/axiosInstance';
import { Colors } from '../../style/color';
import ItemPopup from '../../components/artist/ItemPopup';
import Loader from '../../components/Loader';
import ErrorRequest from '../../components/ErrorRequest';
import { useRoute } from '@react-navigation/native';

const DiscograpyScreen = () => {
    const [albums, setAlbums] = useState([]);
    const [singles, setSingles] = useState([]);
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
    if (error) {
        return <ErrorRequest err={error} />;
    }
    return (
        <View style={styles.container}>
        {isLoading ? (
            <Loader />
        ) : (
            <>
                <Animated.View style={[styles.header, headerOpacity]}>
                    <Pressable onPress={() => { navigation.goBack() }}>
                        <FontAwesome5 name="arrow-left" size={30} color={Colors.SeaGreen}/>
                    </Pressable>
                    <Text style={styles.title}>Discographie détaillée</Text>
                    <Text></Text>
                </Animated.View>
                <Animated.ScrollView
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                    scrollEventThrottle={16}
                >
                    <View style={{ marginLeft: 30, marginBottom: 30 }}>
                        <Text style={styles.sectionTitle}>Albums</Text>
                    </View>
                    <View style={styles.item}>
                        {albums.sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);
                            return dateA - dateB;
                        }).map((item) => (
                            <ItemPopup key={item.id} data={item} />
                        ))}
                    </View>
                    <View style={{ marginLeft: 30, marginBottom: 30 }}>
                        <Text style={styles.sectionTitle}>Singles</Text>
                    </View>
                    <View style={styles.item}>
                        {singles.sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);
                            return dateA - dateB;
                        }).map((item) => (
                            <ItemPopup key={item.id} data={item} />
                        ))}
                    </View>
                </Animated.ScrollView>
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
    padding: 20,
    backgroundColor: Colors.Jet,
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    marginBottom: 30
},
 title: {
   fontSize: 35,
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
 closeButton: {
    color: Colors.DarkSpringGreen,
    position: 'relative',
    top: 0,
    right: 0,
    fontSize: 30
 },
 sectionTitle: {
    color: Colors.DarkSpringGreen,
    fontWeight: 'bold',
    fontSize: 27,
  },
});


export default DiscograpyScreen;

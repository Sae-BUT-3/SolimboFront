import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axiosInstance from '../../api/axiosInstance';
import { Colors } from '../../style/color';
import ItemPopup from '../../components/artist/ItemPopup';
import Loader from '../../components/common/Loader';
import ErrorRequest from '../../components/common/ErrorRequest';
import { useNavigation, useRoute } from '@react-navigation/native';
import screenStyle from '../../style/screenStyle';

const DiscograpyScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const id = route.params?.id || null;

    const [albums, setAlbums] = useState([]);
    const [singles, setSingles] = useState([]);
    const [filter, setFilter] = useState('album');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const albumResponse = await axiosInstance.get('/spotify/fetchArtistSongs', {
                    params: { id: id, filter: 'album' }
                });
                setAlbums(albumResponse.data);

                const singleResponse = await axiosInstance.get('/spotify/fetchArtistSongs', {
                    params: { id: id, filter: 'single' }
                });
                setSingles(singleResponse.data);

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const sortByDate = (items) => {
        return items.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
    };

    if (error) {
        return <ErrorRequest err={error} />;
    }

    return (
        <View style={screenStyle.container}>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <View style={[screenStyle.header, {marginBottom: 0}]}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <FontAwesome5 name="chevron-left" size={25} color={Colors.White} style={{ paddingTop: 15 }} />
                        </Pressable>
                        <Text style={screenStyle.title}>Discographie</Text>
                        <Text />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 15, flexWrap: 'wrap', backgroundColor: 'rgba(43, 43, 43, 0.3)', padding: 20 }}>
                        <Pressable style={[screenStyle.filterButton, filter === 'album' && { backgroundColor: Colors.DarkSpringGreen }]} onPress={() => setFilter('album')} activeOpacity={1}>
                            <Text style={[screenStyle.filterText, filter === 'album' && { color: Colors.White }]}>Albums</Text>
                        </Pressable>
                        <Pressable style={[screenStyle.filterButton, filter === 'single' && { backgroundColor: Colors.DarkSpringGreen }]} onPress={() => setFilter('single')} activeOpacity={1}>
                            <Text style={[screenStyle.filterText, filter === 'single' && { color: Colors.White }]}>Singles</Text>
                        </Pressable>
                    </View>
                    <ScrollView style={{ marginBottom: 30 }}>
                        <View style={styles.item}>
                            {filter === 'album' && sortByDate(albums).map((item) => (
                                <ItemPopup key={item.id} data={item} />
                            ))}
                            {filter === 'single' && sortByDate(singles).map((item) => (
                                <ItemPopup key={item.id} data={item} />
                            ))}
                        </View>
                    </ScrollView>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: Colors.Licorice,
    },
});

export default DiscograpyScreen;

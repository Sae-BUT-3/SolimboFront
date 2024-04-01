import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Platform } from 'react-native'; // Remplacement des composants de MUI par ceux de React Native
import { Provider as PaperProvider } from 'react-native-paper';
import { Colors } from '../../style/color';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import { DataTable } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import Review from '../../components/common/Review';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import ErrorRequest from '../../components/ErrorRequest';

const numberOfItemsPerPageList = [5, 10, 15 , 20, 25];

const ReviewScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const id = route.params?.id || null;
    const [reviews, setReviews] = useState([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);

    const changeReviews = (orderByLike) => {
        axiosInstance.get(`/reviews/oeuvre/${id}`, { params: { page: page + 1, pageSize: itemsPerPage, orderByLike: orderByLike } })
        .then(response => {
            setReviews(response.data.data);
            setCount(response.data.count);
            setIsLoading(false);
        }).catch(e => setError(e.response.data));
    }

    const handleChangePage = (newPage) => {
        setIsLoading(true);
        setPage(newPage);
        changeReviews()
    };

    useEffect(() => {
        axiosInstance.get(`/reviews/oeuvre/${id}`, { params: { page: page + 1, pageSize: itemsPerPage, orderByLike: false } })
        .then(response => {
            setReviews(response.data.data);
            setCount(response.data.count);
            setIsLoading(false);
        }).catch(e => setError(e.response.data));
    }, [])

    const scrollY = useRef(new Animated.Value(0)).current;
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    if (error) {
        return <ErrorRequest err={error} />;
    }

    return (
        <PaperProvider>
        <View style={styles.container}>
            {isLoading ? (<Loader />) : (
                <>
                    <Animated.View style={[styles.header, headerOpacity]}>
                        <Pressable onPress={() => { navigation.goBack() }}>
                            <FontAwesome5 name="arrow-left" size={30} color={Colors.SeaGreen}/>
                        </Pressable>
                        <Text style={styles.title}>Reviews</Text>
                        <Text></Text>
                    </Animated.View>

                    <Animated.ScrollView
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                        scrollEventThrottle={16}
                    >
                    {reviews.length > 0 ?
                        <DataTable>
                           {reviews.map((item, index) => (
                                <DataTable.Row key={index}  style={{margin: 'auto', borderBottom: 'none'}}>
                                    <DataTable.Cell>
                                        <Review data={item} />
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                            <DataTable.Pagination
                                page={page}
                                numberOfPages={Math.ceil(count / itemsPerPage)}
                                onPageChange={(page) => handleChangePage(page)}
                                label={`${page * itemsPerPage + 1}-${Math.min((page + 1) * itemsPerPage, count)} à ${count}`}
                                numberOfItemsPerPageList={numberOfItemsPerPageList}
                                numberOfItemsPerPage={itemsPerPage}
                                onItemsPerPageChange={onItemsPerPageChange}
                                selectPageDropdownLabel={'Review par page'}
                                showFastPaginationControls
                                paginationControlRippleColor={Colors.White}
                                dropdownItemRippleColor={Colors.White}
                                selectPageDropdownRippleColor={Colors.Jet}
                                style={{backgroundColor: Colors.Jet, color: Colors.White}}
                            />
                        </DataTable>
                        : <Text style={{ color: Colors.White, fontSize: 20, textAlign: 'center' }}>Aucune critique, soyez le premier à rédiger une critique !</Text>
                        }
                    </Animated.ScrollView>
                </>
            )}
        </View></PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Onyx,
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
        color: Colors.SeaGreen,
        fontWeight: 'bold'
    },
    reviewContainer: {
        backgroundColor: Colors.Onyx,
        maxWidth: Platform.OS == 'web' ? null : 300,
    },
    sectionFilter: {
        display: 'flex',
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        alignItems: 'flex-end',
    },
    filterButton: {
        marginRight: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.Jet,
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        transition: 'background-color 0.3s ease'
    },
    btnHovered: {
        backgroundColor: Colors.Onyx,
    },
    filterText: {
        fontWeight: 'bold',
        color: Colors.White,
    },
    textContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 20,
        borderColor: Colors.Jet,
        borderWidth: 1,
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        transition: 'background-color 0.3s ease'
    },
    paginationText: {
        color: Colors.White,
        paddingHorizontal: 10,
        fontSize: 16,
    },
})

export default ReviewScreen;

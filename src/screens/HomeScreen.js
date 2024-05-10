import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import commonStyles from '../style/commonStyle';
import { Colors } from '../style/color';
import { FontAwesome5 } from '@expo/vector-icons';
import { Avatar, DataTable, Divider, Provider } from 'react-native-paper';
import { RefreshControl } from 'react-native';
import Tokenizer from '../utils/Tokenizer';
import { useNavigation } from '@react-navigation/native';
import Review from '../components/review/Review';
import Loader from '../components/common/Loader';
import axiosInstance from '../api/axiosInstance';

const baseImageURL = "https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg"

const numberOfItemsPerPageList = [50];

function HomeScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [currentUser, setUser] =  useState({});
    const [reviews, setReviews] = useState(null);
    const [count, setCount] = useState(0);
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);

    const getData = async ()=>{
        setUser(await Tokenizer.getCurrentUser());
    }

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      getData();
      updateReviews(page);
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }, []);

    const updateReviews = (newPage, orderByLike=false) => {
        axiosInstance.get('/review/timeline', { params: { page: newPage, pageSize: 50, orderByLike: orderByLike } })
        .then(response => {
            setReviews(response.data.data);
            setCount(response.data.count);
            setIsLoading(false);
        }).catch(e => {
            setIsLoading(false);
            setError(e.response.data.message);
        });
    }

    const handleChangePage = (newPage) => {
        setIsLoading(true);
        setPage(newPage);
        updateReviews(newPage);
    };

    useEffect(() => {
        getData()
        axiosInstance.get('/review/timeline', { params: { page: page + 1, pageSize: 50, orderByLike: false } })
        .then(response => {
            setReviews(response.data.data);
            setCount(response.data.count);
            setIsLoading(false);
        }).catch(e => {
            setError(e.response.data.message);
            setIsLoading(false);
        });
    }, []);

   

    return ( 
        <Provider>
            <View style={styles.container}>
                <Animated.View style={[styles.header]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                            source={require('../assets/images/main_logo_no_bg.png')}
                            style={{ width: 45, height: 45, borderRadius: 5}}
                        />
                        <Text style={styles.name}>SOLIMBO</Text>
                    </View>
                    <Pressable onPress={() => { navigation.navigate('user', {id: currentUser.id_utilisateur}) }}>
                        <Avatar.Image source={ { uri: currentUser.photo || baseImageURL }} size={Platform.OS === 'web' ? 65 : 45} accessibilityLabel={currentUser.pseudo} />
                    </Pressable>
                </Animated.View>
                <Divider style={{backgroundColor: Colors.Onyx}} />
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.DarkSpringGreen]}  tintColor={Colors.DarkSpringGreen} size='large' title='Actualisation...' titleColor={Colors.White}/>
                    }  
                    style={{paddingTop: 15}}                     
                >
                    { isLoading ? <Loader /> :
                      reviews && reviews.length > 0 ? 
                        <DataTable style={{marginLeft: 0, marginRight: 0, marginBottom: 30}}>
                            {reviews.map((item, index) => (
                                <DataTable.Row key={index} style={{borderBottomWidth: 0,  marginLeft: Platform.OS === 'web' ? 50 : null, marginRight: Platform.OS === 'web' ? 50 : null ,width: Platform.OS !== 'web' ? 390 : null}}>
                                    <DataTable.Cell style={{margin: 'auto'}}>
                                        <Review data={item}/>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                            {count > 50 && <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(count / 50)}
                            onPageChange={page => {handleChangePage(page)}}
                            label={`${page * 50 + 1}-${Math.min((page + 1) * 50, count)} à ${count}`}
                            numberOfItemsPerPageList={numberOfItemsPerPageList}
                            showFastPaginationControls
                            paginationControlRippleColor={Colors.White}
                            dropdownItemRippleColor={Colors.White}
                            selectPageDropdownRippleColor={Colors.Jet}
                            style={{backgroundColor: Colors.Jet}}
                            />}
                        </DataTable> :
                        <View style={{alignContent: 'space-around', gap: 55, alignItems: 'center'}}>
                            <Text/>
                            <Image
                                source={require('../assets/images/main_logo_v1_500x500.png')}
                                style={{ width: 165, height: 165, opacity: 0.1}}
                            />
                            <Text style={styles.text}>
                                Abonner vous à des artistes ou utilisateurs pour suivre les derniers critiques rédigées !
                            </Text>
                        </View>
                                       
                }
                </ScrollView>
            </View>
        </Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Licorice,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 15,
        paddingTop: Platform.OS === 'web' ? 25 : 55,
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: 'rgba(43, 43, 43, 0.5)', 

    },
    name:{
        fontSize: Platform.OS === 'web' ? 30 : 20,
        color: Colors.Celadon,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
    },
    text:{
        fontSize: Platform.OS === 'web' ? 20 : 16,
        color: Colors.Celadon,
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
    },
});

export default HomeScreen;
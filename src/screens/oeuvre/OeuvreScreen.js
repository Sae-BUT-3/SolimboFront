import React, {useEffect, useState} from 'react';
import axiosInstance from '../../api/axiosInstance';
import {StyleSheet, ScrollView, Text, View, Pressable, Platform, Animated } from 'react-native';
import Loader from '../../components/Loader';
import ErrorRequest from '../../components/ErrorRequest';
import { Colors } from '../../style/color';
import { useRoute, useNavigation } from '@react-navigation/native';
import {Snackbar, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OeuvreReview from '../../components/oeuvre/OeuvreReview';
import Oeuvre from '../../components/oeuvre/Oeuvre';

const OeuvreScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id, type } = route.params;
    const [like, setLike] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [oeuvre, setOeuvre] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fail, setFailed] = useState(null);
    const [response, setResponse] = useState(null)

    const handlePress = () => {
      setDiscograpyPopupVisible(true);
    };

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
      return;
      }
      setResponse(null);
    };

    const onLikeOeuvre = () => {
      axiosInstance.post(`/oeuvre/${type}/${id}/like`)
      .then(res => {
        if(!like){
          setLike(true)
        }else{
          setLike(false)
        }
      }).catch(e => setResponse('Une erreur interne à notre serveur est survenue. Réessayer plus tard !'));
    }

    useEffect(() => {
        axiosInstance.get(`spotify/${type}` , {params: {id: id, }})
        .then(response => {
          setOeuvre(response.data);
          setIsLoading(false);
          navigation.setOptions({ title: response.data.name + ' | Solimbo' });
        }).catch(e => setFailed(e.response.data));
    }, []);

    const [scrollY] = useState(new Animated.Value(0));

    const headerHeight = scrollY.interpolate({
      inputRange: [0, 500],
      outputRange: [500, 200],
      extrapolate: 'clamp',
    });

    if (fail) {
      return <ErrorRequest err={fail} />;
    }
  
    return (
        <View style={styles.container}>
        {isLoading ? (<Loader />) : (
          <ScrollView>
            <Animated.View style={{ height: headerHeight }}>
            <Oeuvre data={oeuvre} like={like} likeOeuvre={onLikeOeuvre}/>
            </Animated.View>
            <Animated.ScrollView
                scrollEventThrottle={16}
                onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
                )}
            >
                <View style={styles.sectionFilter}>
                    <Text style={styles.sectionTitle}>Récents reviews</Text>
                    { Platform.OS === 'web' && reviews.length > 0 ? <Pressable onPress={()=>{navigation.navigate('Review', {id})}}>
                        <Text style={styles.buttonText}>Afficher plus</Text>
                    </Pressable > :  null }
                </View>
                <OeuvreReview items={reviews} id={id}/> 
                {response && (<Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={()=>{response ? true : false}}
                    TransitionComponent='SlideTransition'
                    action={
                        <React.Fragment>
                            <IconButton
                                aria-label="close"
                                color={Colors.DarkSpringGreen}
                                sx={{ p: 0.5 }}
                                onClick={handleClose}
                            >
                                <CloseIcon />
                            </IconButton>
                        </React.Fragment>
                    } message={response}/>)}
                </Animated.ScrollView>
            </ScrollView>)}
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Licorice, 
    color: Colors.White
  },
  sectionTitle: {
    color: Colors.DarkSpringGreen,
    fontWeight: 'bold',
    fontSize: 27,
  },
  sectionFilter:{
    display: 'flex',
    flexDirection:'row',
    justifyContent: 'space-between',
    marginLeft: 30,
    marginBottom: 30,
    alignItems: 'flex-end'
  },
  buttonText: {
    color: Colors.White,
    fontWeight: 'bold',
    marginRight: 30,
    fontSize: 'medium'
  },
});
  
export default OeuvreScreen;

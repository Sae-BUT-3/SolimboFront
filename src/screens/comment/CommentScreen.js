import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Platform} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../style/color';
import { SnackbarContent, Table, TableBody, TableCell, TableContainer,TablePagination, TableRow, TextField, IconButton, Avatar, InputAdornment, Divider} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SendIcon from '@mui/icons-material/Send';
import Comment from '../../components/common/Comment';
import Tokenizer from '../../utils/Tokenizer';
import axiosInstance from '../../api/axiosInstance';
import Review from '../../components/common/Review';
import ErrorRequest from '../../components/ErrorRequest';
import Loader from '../../components/Loader';

const CommentScreen = () => {
    const route = useRoute();
    const id  = route.params?.id || null;
    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [comment, addComment] = useState('');
    const [userComment, setUserComment] = useState({data: null, type: 'review'});
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)

    const handleSendPress = () =>{
        if (userComment.type === "review"){
            axiosInstance.put(`/review/${id}/comment`, {params: {description: comment}})
            .then(response => {
            console.log(response.data)
            }).catch(e => setError(e.response.data));
        } else {
            
        }
        updateComments(rowsPerPage, page)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setUserComment({data: null, type: 'review'});
    };

    const handleExited = () => {
        setUserComment({data: null, type: 'review'});
    };

    const updateComments = (limit, offset) => {
    
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        updateComments(rowsPerPage, page)
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
        updateComments(rowsPerPage, page)
    };
    const navigation = useNavigation();
    const scrollY = useRef(new Animated.Value(0)).current;

    const handleGoBack = () => {
        navigation.goBack();
    };

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100, 200],
        outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)', 'rgba(64, 64, 64, 1)'],
        extrapolate: 'clamp',
        
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                setCurrentUser(await Tokenizer.getCurrentUser());
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        axiosInstance.get(`/review/${id}`)
        .then(response => {
          setReview(response.data);
          setComments(response.data.comments);
          setIsLoading(false);
        }).catch(e => setError(e.response.data));
        fetchData();
    }, []);

    if (error) {
        return <ErrorRequest err={error}/>;
    }

    return(
        <View style={styles.container}> 
            {isLoading ? (<Loader/>) : (
            <>
                <Animated.View>
                    <View style={[styles.header, { opacity: headerOpacity }]}>
                        <Pressable onPress= {handleGoBack}>
                        <ArrowBackIosNewIcon sx={{color: Colors.White }}/>
                        </Pressable>
                        <Text style={styles.title}>Commentaires</Text>
                        <Text></Text>
                    </View>
                </Animated.View>
                <Animated.ScrollView 
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                    scrollEventThrottle={16}
                >   
                    <Review data={review}/>
                    <Divider component="div" sx={{borderColor: Colors.Silver}}/>
                    {comments.length > 0 ? 
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    {comments.map((item, index) => {
                                        return (
                                            <TableRow key={index} >
                                            <TableCell component="div" sx={styles.comment}>
                                                <Comment key={index} data={item} reply={setUserComment}/>
                                            </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer> : 
                        <Text style={{color: Colors.White}}>Aucun commentaire, soyez le premier à rédiger un commentaire !</Text>
                    }
                    {comments.length > 0 &&
                    <TablePagination
                        component="div"
                        count={comments.length}
                        page={page}
                        rowsPerPageOptions={[5, 10, 25, 30]}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage='Commentaire par page :'
                        sx={{bgcolor: Colors.Jet, color: Colors.White}}
                    />}
                </Animated.ScrollView> 
                {(userComment.data && comments.length > 0)  && (<SnackbarContent
                    sx={{bgcolor: Colors.Jet, width: "100%"}}
                    open={()=>{userComment.data ? true : false}}
                    onClose={handleClose}
                    TransitionComponent='SlideTransition'
                    TransitionProps={{ onExited: handleExited }}
                    message={userComment.data ? 'Réponse au commentaire de ' +  userComment.data.username : undefined}
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
                    }
                />)}
                <View style={styles.sender}>
                    <Avatar src={currentUser ? currentUser.photo : "../.../assets/profil.png"} sx={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', width: 64, height:64}}/>
                    <TextField fullWidth
                        onChange={(event) => {
                            addComment(event.target.value);
                        }} 
                        id="input-with-icon-textfield"
                        sx={{color: Colors.White, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} 
                        variant="filled"
                        placeholder={`Ajouter un commentaire à la review de ${review.utilisateur.pseudo} ...`}
                        multiline
                        type='text'
                        value={comment}
                        maxRows={9}
                    /> 
                    <SendIcon sx={{color: Colors.DarkSpringGreen, fontSize: 'xx-large'}}/>

                </View>
            </>)}    
        </View>
       
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header:{
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
    },
    title:{
        fontSize: 'xx-large',
        color: Colors.White,
        fontWeight:'bold'
    },
    comment: {
        maxWidth: Platform.OS == 'web' ? 950 : 300,
        backgroundColor: Colors.Onyx,
        borderBottom: 'none',
        margin: 'auto'
     },
    sender:{
        display: 'flex',
        flexDirection: 'row',
        gap: 2, 
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        backgroundColor: Colors.Silver,
        padding: 10
    }
})

export default CommentScreen
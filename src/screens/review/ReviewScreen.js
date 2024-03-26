import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Platform} from 'react-native';
import { Colors } from '../../style/color';
import { Table, TableBody, TableCell, TableContainer,TablePagination, TableRow, MenuItem, FormControl, Select} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRoute, useNavigation } from '@react-navigation/native';
import Review from '../../components/common/Review';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import ErrorRequest from '../../components/ErrorRequest';
import SelectFilter from '../../components/review/SelectFilter';
import Svg, {Path} from "react-native-svg";

const ButtonFiltre = ({isClicked, setOpen}) =>{
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    return(
        <View style={styles.textContainer}>
        <Pressable style={[styles.filterButton, isHovered ?  styles.btnHovered : null, isClicked && { backgroundColor: Colors.DarkSpringGreen }]} 
            activeOpacity={1}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onPress={handleClickOpen}>
            <Text style={[styles.filterText, isClicked]}>Affiner les résultats des reviews</Text>
                        
        </Pressable>
        {isClicked ?
            <View
                style={{paddingLeft: 5}}
            >
                <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    width={15}
                    height={15}
                    viewBox="2 2 20 20"
                    strokeWidth={2}
                    stroke={Colors.Silver}
                    className="w-6 h-6"
                >
                    <Path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </Svg>
            </View> : null}
    </View>
    )
}

const ReviewScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const id  = route.params?.id || null;
    const [reviews, setReviews] =  useState([]);
    const [count, setCount] = useState(0);
    const [sort, setSort] = useState('time');
    const [filtre, setFiltre] = useState('');
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const changeReviews = (orderByLike) => {
        axiosInstance.get(`/reviews/oeuvre/${id}`, {params: {page: page + 1, pageSize: rowsPerPage, orderByLike: orderByLike}})
        .then(response => {
          setReviews(response.data.data);
          setCount(response.data.count);
          setIsLoading(false);
        }).catch(e => setError(e.response.data));
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setIsLoading(true);
        changeReviews()
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
        setIsLoading(true);
        changeReviews(sort == 'like' ? true : false)
    };

    useEffect(()=>{
        axiosInstance.get(`/reviews/oeuvre/${id}`, {params: {page: page + 1, pageSize: rowsPerPage, orderByLike: false}})
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
        return <ErrorRequest err={error}/>;
    }
    
    return (
         <View style={styles.container}> 
            {isLoading ? (<Loader/>) : (
            <>
                <Animated.View style={[styles.header, headerOpacity]}>
                    <Pressable onPress= {()=> {navigation.goBack()}}>
                        <ArrowBackIosNewIcon sx={{color: Colors.White }}/>
                    </Pressable>
                    <Text style={styles.title}>Reviews</Text>
                    <Text></Text>
                </Animated.View>
                
                <Animated.ScrollView
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                    scrollEventThrottle={16}
                >
                    <View style={styles.sectionFilter} >
                       <ButtonFiltre isClicked={open} setOpen={setOpen} />
                       <SelectFilter props={{open: open, setOpen: setOpen, filtre: filtre, setFiltre: setFiltre, sort: sort, setSort: setSort, changeReviews: changeReviews}}/>  
                    </View>
                    {reviews.length > 0 ? 
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    {reviews.filter((item) => {
                                        if (filtre === "" || filtre === "sort") return true; // Retourne true si le filtre est vide pour inclure tous les éléments
                                        return item.type.includes(filtre);
                                    }).map((item, index) => (
                                        <TableRow key={index} sx={styles.reviewContainer}>
                                        <TableCell component="div" sx={{borderBottom: 'none'}}>
                                            <Review data={item} />
                                        </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer> :
                        <Text style={{color: Colors.White}}>Aucune critique, soyez le premier à rédiger une critique !</Text>
                    }
                    {count > 0 &&
                    <TablePagination
                        component="div"
                        count={count}
                        page={page}
                        rowsPerPageOptions={[5, 10, 25, 30]}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage='Critique par page :'
                        sx={{bgcolor: Colors.Jet, color: Colors.White}}
                    />}
                </Animated.ScrollView>
            </>)}
        </View>        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Onyx,
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
    reviewContainer: {
        backgroundColor: Colors.Onyx,
        maxWidth: Platform.OS == 'web' ? null : 300,
     },
    sectionFilter:{
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
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' ,
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
        paddingRight:  10,
        borderRadius:20,
        borderColor: Colors.Jet,
        borderWidth: 1,
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' ,
        transition: 'background-color 0.3s ease'
    },
})

export default ReviewScreen
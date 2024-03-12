import React, {useState} from 'react';
import {Text, Pressable, Platform, View, StyleSheet} from 'react-native';
import Review from '../common/Review';
import Pagination from '@mui/material/Pagination';
import { Colors } from '../../style/color';

const ArtistReview = ({ items}) => {
  const [page, setPage] = useState(0);
  const handleChange = (event, value) => {
    setPage(value);
  };
  items.filter(item=> item.filtre.includes('time'))
  return (
    items.length > 0 ? 
      <View style={styles.container}> 
        <Review key={items[0][page].id} data={items[0][page]} />
        <Pagination sx={{color: Colors.White}} count={items.length} page={page + 1} onChange={handleChange} shape="rounded" />
      </View> :
      <View style={{display:'flex', alignItems: 'center', margin: 30}}>
        <Text style={{color: Colors.White, fontSize:'large', fontWeight:'normal'}}>Aucune review disponible pour le moment.</Text>
      </View>
)}

const styles = StyleSheet.create({
  container:{
    display:'flex',
    alignItems: 'center'
  }
})
export default ArtistReview
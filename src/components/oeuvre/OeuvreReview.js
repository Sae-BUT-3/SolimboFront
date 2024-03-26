import React, {useState} from 'react';
import {Text, Pressable, Platform, View, StyleSheet} from 'react-native';
import Review from '../common/Review';
import { Colors } from '../../style/color';

const OeuvreReview = ({ items, id}) => {
  return (
    items.length > 0 ? 
      <><View style={styles.container}> 
      {items.slice(0,5).map((item) => (
        <Review key={item.id_review} data={item} />
      ))}
      </View>
      {Platform.OS !== 'web' && (<Pressable style={styles.btn} onPress={()=>{navigation.navigate('Review', {id})}}><Text style={styles.filterText}>Voir les reviews</Text></Pressable>)}</>:
      <View style={{display:'flex', margin: 30}}>
        <Text style={{color: Colors.White, fontSize:'large', fontWeight:'normal'}}>Aucune critique disponible pour le moment.</Text>
      </View>
)}

const styles = StyleSheet.create({
  container:{
    display:'flex',
    alignItems: 'flex-start',
    marginBottom: 30,
    marginLeft: 30
  }
})
export default OeuvreReview
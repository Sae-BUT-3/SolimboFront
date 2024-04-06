import React from 'react';
import {Text, Pressable, Platform, View, StyleSheet} from 'react-native';
import Review from '../common/Review';
import { Colors } from '../../style/color';
import { useNavigation } from '@react-navigation/native';

const OeuvreReview = ({ items, id}) => {
  const navigation = useNavigation();
  return (
    items.length > 0 ? 
      <View style={styles.container}> 
      {items.slice(0,5).map((item) => (
        <Review key={item.id_review} data={item} />
      ))}
      
      {Platform.OS !== 'web' && ( 
        <View style={styles.sectionFilter}>
          <Pressable style={styles.btn} onPress={()=>{navigation.navigate('Review', {id})}}>
            <Text style={styles.filterText}>Voir tous les critiques</Text>
          </Pressable>
        </View>)}</View>:
      <View style={{display:'flex', margin: 30}}>
        <Text style={{color: Colors.White, fontSize:20, fontWeight:'normal'}}>Aucune critique disponible pour le moment.</Text>
      </View>
)}

const styles = StyleSheet.create({
  container:{
    display:'flex',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  sectionFilter: {
    display: 'flex',
    flexDirection:'row',
    justifyContent: 'center',
    marginLeft: 20,
  },
  filterText: {
    fontWeight: 'bold',
    color: Colors.White,
    fontSize: 17
  },
  btn: {
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 9,
    borderColor: Colors.SeaGreen,
    borderWidth: 1,
    backgroundColor:  'transparent',
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 3 : 0, 
  },
})

export default OeuvreReview
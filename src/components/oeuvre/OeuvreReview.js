import React from 'react';
import {Text, Pressable, Platform, View, StyleSheet} from 'react-native';
import Review from '../review/Review';
import { Colors } from '../../style/color';
import { useNavigation } from '@react-navigation/native';

const OeuvreReview = ({ items, id}) => {
  const navigation = useNavigation();
  return (
    items && items.length > 0 ? 
      <View style={styles.container}> 
        {items.slice(0,5).map((item) => (
          <Review key={item.id_review} data={item} />
        ))}
      </View>:
      <View style={{display:'flex', marginLeft: 30, marginBottom: 30, alignItems: 'flex-start'}}>
        <Text style={{color: Colors.White, fontSize:20, fontWeight:'normal'}}>Aucune critique disponible pour le moment.</Text>
      </View>
)}

const styles = StyleSheet.create({
  container:{
    display:'flex',
    alignItems: 'flex-start',
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 10,
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
    fontSize: Platform.OS  === 'web' ? 17 : 14
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
import React, {useState,useEffect} from 'react';
import { StyleSheet, View, Text, Pressable, Platform} from 'react-native';
import { Colors } from '../../style/color';
import Item from '../common/Item';

const ArtistAppearsOn = ({ items}) => {
  const [filter, setFilter] = useState('');
  return (
    <>
    { items.length > 0 ? <View style={styles.sectionFilter}>
       <Pressable style={[styles.filterButton, filter === 'compilation' && { backgroundColor: Colors.DarkSpringGreen }]} onPress={() => setFilter('compilation')}>
          <Text style={[styles.filterText, filter === 'compilation']}>Compilations</Text>
        </Pressable>
        <Pressable style={[styles.filterButton, filter === 'album' && { backgroundColor: Colors.DarkSpringGreen }]} onPress={() => setFilter('album')}>
          <Text style={[styles.filterText, filter === 'album']}>Albums</Text>
        </Pressable> 
      </View> : null}
    <View style={{marginBottom: 30}}> 
      <View style={{display: 'flex', flexWrap: 'wrap',flexDirection: 'row', alignItems: 'flex-start'}}>
        { items.length > 0 ? items.filter(item => item.type.toLowerCase().includes(filter.toLowerCase())).slice(0, 6).sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;}).map(item => (
          <Item  key={item.id} data={item}/>)) :
          <View style={{display:'flex', alignItems: 'center', margin: 30}}>
          <Text style={{color: Colors.White, fontSize:'large', fontWeight:'normal'}}>Aucune apparution.</Text>
          </View>}
      </View>
    </View> 
    </>
  )
}
const styles = StyleSheet.create({
  sectionFilter: {
    display: 'flex',
    flexDirection:'row',
    justifyContent: 'flex-start',
    marginLeft: 30,
    marginBottom: 30
  },
  buttonText: {
    color: Colors.White,
    fontWeight: 'normal',
    textAlign: 'right',
  },
  filterButton: {
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.Jet,
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' ,
  },
  filterText: {
    fontWeight: 'bold',
    color: Colors.White,
  }
});
export default ArtistAppearsOn
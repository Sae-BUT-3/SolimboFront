import React, {useState} from 'react';
import { StyleSheet, View, Text, Pressable, Platform} from 'react-native';
import { Colors } from '../../style/color';
import Item from './Item';
import { useNavigation } from '@react-navigation/native';


const Discography = ({ items, id}) => {
  const [filter, setFilter] = useState('popularity');
  const [isHovered, setIsHovered] = useState(false);
  const navigation = useNavigation()
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      {items.length > 0 ? <View style={styles.sectionFilter}>
          <Pressable style={[styles.filterButton, isHovered ?  styles.btnHovered : null, filter === 'popularity' && { backgroundColor: Colors.DarkSpringGreen }]} onPress={() => setFilter('popularity')} activeOpacity={1}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <Text style={[styles.filterText, filter === 'popularity']}>Populaires</Text>
          </Pressable>
          <Pressable style={[styles.filterButton, isHovered ? styles.btnHovered : null, filter === 'album' && { backgroundColor: Colors.DarkSpringGreen }]} onPress={() => setFilter('album')} activeOpacity={1}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <Text style={[styles.filterText, filter === 'album']}>Albums</Text>
          </Pressable>
          <Pressable style={[styles.filterButton, isHovered ? styles.btnHovered : null, filter === 'single' && { backgroundColor: Colors.DarkSpringGreen }]} onPress={() => setFilter('single')} activeOpacity={1}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <Text style={[styles.filterText, filter === 'single']}>Singles</Text>
          </Pressable>
      </View> : null}
        <View style={{marginBottom: 30, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center', flexWrap: 'wrap'}}>
          {items.length > 0 ? items.filter(item => filter === 'popularity' || item.type.toLowerCase().includes(filter.toLowerCase())).sort((a, b) => {
              if(filter !== 'popularity'){
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
              }
              return a.popularity - b.popularity;
            }).slice(0, Platform.OS == 'web' ? 5 : 3).map(item => (
            <Item  key={item.id} data={item}/>)) : 
            <View style={{display:'flex', margin: 30}}>
              <Text style={{color: Colors.White, fontSize:20, fontWeight:'normal'}}>Discographie vide pour le moment.</Text>
            </View>}
            {Platform.OS !== 'web' && (
            <View style={[styles.sectionFilter, {alignItems: 'center'}]}>
              <Pressable style={styles.btn} onPress={()=>{navigation.navigate('discographie', {id})}}>
                <Text style={styles.filterText}>Voir toute la discographie</Text>
              </Pressable>
            </View>)}
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
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 3 : 0, 
    transition: 'background-color 0.3s ease'
  },
  btnHovered: {
    backgroundColor: Colors.Onyx,
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
    borderColor: Colors.Silver,
    borderWidth: 1,
    backgroundColor:  Colors.Jet,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 3 : 0, 
  },
});
export default Discography
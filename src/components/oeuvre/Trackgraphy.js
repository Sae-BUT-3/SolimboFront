import React, {useState} from 'react';
import { StyleSheet, View, Text, Pressable, Platform} from 'react-native';
import { Colors } from '../../style/color';
import Item from '../common/Item';
import { useNavigation } from '@react-navigation/native';
import Track from './Track';


const Trackgraphy = ({ items, id}) => {
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
      <View style={{marginBottom: 30}}> 
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap'}}>
          {items && items.length > 0 ? items.slice(0, Platform.OS == 'web' ? 5 : 3).map(item => (
            <Track  key={item.id} data={item}/>)) : null}
            {Platform.OS !== 'web' && (
            <View style={[styles.sectionFilter, {alignItems: 'center'}]}>
              <Pressable style={styles.btn} onPress={()=>{navigation.navigate('Trackgraphie', {id})}}>
                <Text style={styles.filterText}>Voir toutes les titres</Text>
              </Pressable>
            </View>)}
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
    marginBottom: 30,
    marginTop: 10
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
    fontSize: 15
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
});
export default Trackgraphy
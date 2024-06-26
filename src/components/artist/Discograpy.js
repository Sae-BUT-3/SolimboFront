import React, {useState} from 'react';
import { StyleSheet, View, Text, Pressable, Platform, FlatList} from 'react-native';
import { Colors } from '../../style/color';
import Item from './Item';
import { useNavigation } from '@react-navigation/native';
import screenStyle from '../../style/screenStyle';
import { useTranslation } from 'react-i18next';

const Discography = ({ items, id}) => {
  const [filter, setFilter] = useState('popularity');
  const [isHovered, setIsHovered] = useState(false);
  const navigation = useNavigation()
  const { t } = useTranslation();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      {items.length > 0 ? <View style={styles.sectionFilter}>
          <Pressable style={[screenStyle.filterButton, isHovered ?  screenStyle.btnHovered : null, filter === 'popularity' && { backgroundColor: Colors.DarkSpringGreen }]} onPress={() => setFilter('popularity')} activeOpacity={1}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <Text style={[screenStyle.filterText, filter === 'popularity']}>{t('common.popular')}</Text>
          </Pressable>
          <Pressable style={[screenStyle.filterButton, isHovered ? screenStyle.btnHovered : null, filter === 'album' && { backgroundColor: Colors.DarkSpringGreen }]} onPress={() => setFilter('album')} activeOpacity={1}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <Text style={[screenStyle.filterText, filter === 'album']}>{t('album.plurialtitle')}</Text>
          </Pressable>
          <Pressable style={[screenStyle.filterButton, isHovered ? screenStyle.btnHovered : null, filter === 'single' && { backgroundColor: Colors.DarkSpringGreen }]} onPress={() => setFilter('single')} activeOpacity={1}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <Text style={[screenStyle.filterText, filter === 'single']}>{t('single.plurialtitle')}</Text>
          </Pressable>
      </View> : null}
      <FlatList
        data={ items.filter(item => filter === 'popularity' || item.type.toLowerCase().includes(filter.toLowerCase())).sort((a, b) => {
          if(filter !== 'popularity'){
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
          }
          return a.popularity - b.popularity;
        }).slice(0, Platform.OS == 'web' ? 5 : 3)}
        renderItem={({ item, index }) =>
          <Item data={item} />
        }
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: 5
        }}
        ListEmptyComponent={<EmptyList />}
        ListFooterComponent={<Footer id={id} navigation={navigation}/>}
        horizontal={Platform.OS === 'web'}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />      
    </>
  );
};

const EmptyList = () => (
  <View style={styles.emptyListContainer}>
    <Text style={styles.noItemsText}>Vide pour le moment.</Text>
  </View>
);
const Footer = ({id, navigation}) => (
  Platform.OS !== 'web' && (
    <View style={[styles.sectionFilter, {alignItems: 'center'}]}>
      <Pressable style={screenStyle.btn} onPress={()=>{navigation.navigate('discographie', {id})}}>
        <Text style={screenStyle.filterText}>Voir toute la discographie</Text>
      </Pressable>
    </View>)
);
const styles = StyleSheet.create({
  sectionFilter: {
    display: 'flex',
    flexDirection:'row',
    justifyContent: 'flex-start',
    marginLeft: 30,
    marginBottom: 30
  },
  emptyListContainer: {
    marginLeft: 30,
    alignItems: "center",
    justifyContent: 'center'
  },
  noItemsText: {
    fontSize: 20,
    color: Colors.White,
    textAlign: 'center'
  },
  emptyImage: {
    width: 165,
    height: 165,
    opacity: 0.3,
  },
});
export default Discography
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Button, Platform, Text } from 'react-native';
import { Colors } from '../../style/color';
import Track from './Track';
import { PaperProvider } from 'react-native-paper';
import Loader from '../common/Loader';
import { FontAwesome } from '@expo/vector-icons';

const Trackgraphy = ({ items }) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const itemsPerPage = 3;

  useEffect(() => {
    loadMoreData(0);
  }, []);

  const loadMoreData = (newPage) => {
    if (newPage === 0) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    
    // Simuler un appel API pour obtenir des éléments
    const newData = items.slice(newPage * itemsPerPage, (newPage * itemsPerPage) + itemsPerPage);
    setData(newData);
    
    setIsLoading(false);
    setIsLoadingMore(false);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && (page + 1) * itemsPerPage < items.length) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMoreData(nextPage);
    }
  };

  const handleLoadPrevious = () => {
    if (page > 0) {
      const previousPage = page - 1;
      setPage(previousPage);
      loadMoreData(previousPage);
    }
  };

  return (
    isLoading ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ width: '100%', alignItems: 'center',marginTop: 20}}>
                <Track data={item} />
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
          <View style={styles.buttonContainer}>
            <FontAwesome name="arrow-left" onPress={handleLoadPrevious} size={20} color={Colors.DarkSpringGreen} disabled={page === 0} />
            <Text style={styles.pageNumber}>{page + 1}/{Math.ceil(items.length/itemsPerPage)} </Text>
            <FontAwesome name="arrow-right"  onPress={handleLoadMore} size={20} color={Colors.DarkSpringGreen} disabled={(page + 1) * itemsPerPage >= items.length} />
          </View>
        </View>
   )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Licorice,
    marginBottom: 25
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  sectionFilter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 30,
    marginBottom: 30,
    marginTop: 10,
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
    transition: 'background-color 0.3s ease',
  },
  btnHovered: {
    backgroundColor: Colors.Onyx,
  },
  filterText: {
    fontWeight: 'bold',
    color: Colors.White,
    fontSize: 15,
  },
  btn: {
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 9,
    borderColor: Colors.SeaGreen,
    borderWidth: 1,
    backgroundColor: 'transparent',
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  pageNumber:{
    color: Colors.White,
    fontSize: 15
  }
});

export default Trackgraphy;

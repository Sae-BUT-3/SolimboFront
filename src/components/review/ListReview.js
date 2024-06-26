import React from 'react';
import {Text, Pressable, Platform, StyleSheet, FlatList} from 'react-native';
import Review from '../review/Review';
import { Colors } from '../../style/color';
import { useNavigation } from '@react-navigation/native';
import screenStyle from '../../style/screenStyle';

const ListReview = ({ items, id }) => {
  const navigation = useNavigation();

  const renderReview = ({ item }) => (
    <Review key={item.id_review} data={item} />
  );

  const renderEmptyList = () => (
    <Text style={screenStyle.noItemsText}>Aucune critique disponible pour le moment.</Text>
  );

  const renderFooter = () => (
    Platform.OS !== 'web' && items.length > 0 && (
      <Pressable style={screenStyle.btn} onPress={() => navigation.navigate('review', { id })}>
        <Text style={screenStyle.filterText}>Voir tous les critiques</Text>
      </Pressable>
    )
  );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={items.slice(0, 5)}
      renderItem={renderReview}
      keyExtractor={(item) => item.id_review.toString()}
      ListEmptyComponent={renderEmptyList}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: Platform.OS === 'web' ? 'flex-start' : 'center',
    justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center',
    marginBottom: 30,
  }
});

export default ListReview;

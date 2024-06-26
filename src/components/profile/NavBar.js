import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../style/color';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

const NavBar = ({setTab}) => {
  const [selectedTab, setSelectedTab] = useState('posts');

  const handleTabPress = (tab) => {
    setTab(tab);
    setSelectedTab(tab);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => handleTabPress('posts')} style={[styles.tab, selectedTab === 'posts' && styles.selectedTab]}>
        <FontAwesome  name="pencil-square-o" size={25} color={Colors.DarkSpringGreen} regular/>
        <Text style={styles.tabText}>Posts</Text>
      </Pressable>
      <Pressable onPress={() => handleTabPress('fav')} style={[styles.tab, selectedTab === 'fav' && styles.selectedTab]}>
        <FontAwesome5 name="bookmark" size={20} color={Colors.SeaGreen} regular  />
        <Text style={styles.tabText}>Favoris</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.Jet,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 15,
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.Silver
  },
  selectedTab: {
    borderBottomWidth: 4,
    borderColor: Colors.DarkSpringGreen,
  },
});

export default NavBar;

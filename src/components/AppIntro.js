import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {Colors} from '../style/color';

const slides = [
  {
    key: 1,
    title: 'Bienvenue sur SOLIMBO !',
    text: 'Une application faites pour vous accompagner dans votre passion de la musique',
    image: require('../assets/images/main_logo_v1_500x500.png'),
    backgroundColor: Colors.Licorice,
    page: false
  },
  {
    key: 2,
    title: 'Présentation des pages',
    text: 'Other cool stuff',
    image: require('./assets/2.jpg'),
    backgroundColor: Colors.Licorice,
    page: true
  },
  {
    key: 3,
    title: 'Rocket guy',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image: require('./assets/3.jpg'),
    backgroundColor: Colors.Licorice,
    page: false
  }
];

const AppIntro = () => {
  const [showRealApp, setShowRealApp] = useState(false);

  const renderItem = ({ item }) => {
    return (
      item.page ?
        <View style={styles.slide}>
            <Text style={styles.title}>{item.title}</Text>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.text}>{item.text}</Text>
        </View> :
        <View>
            <View>
                <FontAwesome5 name='home' size={24} color={Colors.DarkSpringGreen} />
                <Text>Pour suivre les derniers critiques de vos abonnement</Text>
            </View>
            <View>
                <FontAwesome5 name='search' size={24} color={Colors.DarkSpringGreen} />
                <Text>Pour rechercher un artiste, une oeuvre ou un utlisateur </Text> 
            </View>
            <View>
                <FontAwesome5 name='plus' size={24} color={Colors.DarkSpringGreen} />
                <Text>Pour rédiger une critique à vos soins</Text>
            </View>
            <View>
                <FontAwesome5 name='bell' size={24} color={Colors.DarkSpringGreen} />
                <Text>Pour suivre l'activté sur vos critiques</Text>
            </View>
            <View>
                <FontAwesome5 name='user' size={24} color={Colors.DarkSpringGreen} />
                <Text>Pour gérer votre profil utilisateur</Text>
            </View>
        </View>
    );
  }
  renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <FontAwesome
          name="arrow-left"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <FontAwesome
          name="check"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  const onDone = () => {
    setShowRealApp(true);
  }

  return (
    <AppIntroSlider
        renderItem={renderItem}
        data={slides}
        onDone={onDone}
        renderDoneButton={renderDoneButton}
        renderNextButton={renderNextButton}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 64,
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppIntro;

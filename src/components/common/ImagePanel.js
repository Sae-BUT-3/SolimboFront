import { useState } from "react";
import { FlatList, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome5, FontAwesome } from '@expo/vector-icons'; // Importation de FontAwesome5
import { Colors } from '../../style/color';
import { Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const ImagePanel = ({ avatars, type, show }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const navigation = useNavigation();

  const closeModal = () => {
    setIsModalVisible(false);
    show(false);
  };

  const onfollow = (id, follow) => {
    if(type== 'artist'){
      axiosInstance.post('/users/follow', { artistId: id })
      .then(res => {
      }).catch(e => console.log('Une erreur interne à notre serveur est survenue. Réessayer plus tard !'));
    }else{
      if (!follow) {
        axiosInstance.post('/amis/follow', { amiIdUtilisateur: id })
        .then(res => {
        }).catch(e => console.log('Une erreur interne à notre serveur est survenue. Réessayer plus tard !'));
      }else{
        axiosInstance.post('/amis/unfollow', { amiIdUtilisateur: id })
        .then(res => {
        }).catch(e => console.log('Une erreur interne à notre serveur est survenue. Réessayer plus tard !'));
      }
    }
    
  };


  return (
    <Modal
      isVisible={isModalVisible}
      style={styles.modal}
      swipeDirection={['down']}
      onSwipeComplete={closeModal}
      onBackdropPress={closeModal}
      animationType="slide"
    >
      <View style={styles.panelContainer}>
        <View style={{ paddingTop: 37 }}>
          <Pressable onPress={closeModal}>
            <FontAwesome name="close" size={30} color={Colors.White} />
          </Pressable>
        </View>
        <View style={styles.panelContent}>
          <FlatList
            data={avatars}
            renderItem={({ item }) => ( // Correction ici
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, flexWrap: 'wrap' }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 15 }}>
                  <Pressable onPress={() => { if(type === 'artist'){
                    closeModal();
                    navigation.navigate('Artist', { id: item.id })
                  }}}>
                    <Avatar.Image size={56} source={{ uri: type === 'user' ? item?.photo : item?.image }} />
                  </Pressable>
                  <Text numberOfLines={1} style={styles.panelText}>{type === 'user' ? item?.pseudo : item?.name}</Text>
                </View>
                <Pressable style={styles.followButton}
                  activeOpacity={1}
                  onPress={() => onfollow(item.id, type === 'user' ? true : item.doesUserFollow)}
                >
                  {type === 'user' || item.doesUserFollow  ? <Text style={styles.buttonText}>Suivi(e)</Text> : <Text style={styles.buttonText}>+ Suivre</Text>  }
                </Pressable>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  panelContainer: {
      flex: 1,
      backgroundColor: Colors.Jet,
      paddingLeft: 20,
      paddingRight: 20,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
  },
  panelContent: {
      backgroundColor: Colors.Onyx,
      borderRadius: 15,
      justifyContent: 'space-around',
      marginTop: 10,
      paddingTop: 20,
      paddingBottom: 20,
  },
  panelText: {
      color: Colors.White,
      fontSize: 20,
      marginBottom: 20,
  },
  buttonText: {
    color: Colors.White,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15
  },
  followButton: {
    backgroundColor: Colors.DarkSpringGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 4 : 0, 
    transition: 'background-color 0.3s ease'
  },
  btnHovered: {
      backgroundColor: Colors.SeaGreen, 
  },
});

export default ImagePanel;

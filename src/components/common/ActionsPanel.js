import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../../style/color';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import PropTypes from 'prop-types';

const ActionsPanel = ({ actions }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      isVisible={isModalVisible}
      style={styles.modal}
      swipeDirection={['down']}
      onSwipeComplete={closeModal}
      onBackdropPress={closeModal}
    >
      <View style={styles.panelContainer}>
        <View style={styles.closeButtonContainer}>
          <Pressable onPress={closeModal}>
            <FontAwesome name="close" size={30} color={Colors.White} />
          </Pressable>
        </View>
        <View style={styles.panelContent}>
          {actions.map((item, index) => (
            <Pressable key={index} onPress={item.handle}>
              <View style={styles.actionItem}>
                <Text style={[styles.panelText, { color: item.textColor }]}>{item.text}</Text>
                <FontAwesome5 name={item.name} size={item.size} color={item.color} solid={item.solid} />
              </View>
              {index < actions.length - 1 && <Divider style={styles.divider} />}
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
};

ActionsPanel.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      handle: PropTypes.func.isRequired,
      color: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      textColor: PropTypes.string.isRequired,
      solid: PropTypes.bool,
      size: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const styles = StyleSheet.create({
  modal: {
      justifyContent: 'flex-end',
      margin: 0,
  },
  panelContainer: {
      backgroundColor: Colors.Jet,
      paddingLeft: 20,
      paddingRight: 20,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
  },
  panelContent: {
      backgroundColor: Colors.Onyx,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      justifyContent: 'space-around',
      marginTop: 10,
      paddingTop: 20,
      paddingBottom: 20,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  panelText: {
      color: Colors.White,
      fontSize: 20,
      marginBottom: 20,
  },
  btnHovered: {
      backgroundColor: Colors.SeaGreen, 
  },
});

export default ActionsPanel;

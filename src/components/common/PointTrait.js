import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '../../style/color';

const PointTrait = ({point}) => {
  return (
    <View style={styles.container}>
        {point ? <Text style={styles.point}>•</Text> :
            <Text style={styles.trait}>─────────</Text>
        }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  point: {
    fontSize: 30,
    opacity: 0.1,
    marginRight: 5,
    color: Colors.White
  },
  trait: {
    flex: 1,
    opacity: 0.5,
    color: Colors.DarkSpringGreen,
    fontSize: Platform.OS  === "web" ? 'large' : 'medium'
  },
});

export default PointTrait;

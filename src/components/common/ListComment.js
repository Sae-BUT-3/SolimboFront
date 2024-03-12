import React, {useState} from 'react';
import {StyleSheet, Pressable, View, Text, Platform} from 'react-native';
import { Colors } from '../../style/color';

const toCapitalCase = (mot) => {
    return mot.charAt(0).toUpperCase() + mot.slice(1);
}

const ListComment = ({id}) => {
    const [comments, setComments] = useState([]);

    return ( null
        
)}
const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: Colors.Jet,
    display: 'flex',
    marginBottom: 20,
    marginLeft: 30,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'space-between',
    maxWidth: 500,

  },
  commentInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: Colors.White,
    gap: 5
  },
});
export default ListComment
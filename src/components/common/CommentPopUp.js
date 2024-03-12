import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Pressable, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Comment from './Comment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Colors } from '../../style/color';

const CommentPopup = ({onClose}) => {
 const [comments, setComments] = useState([
   { id: 1, username: "User1", userProfile: "https://i.scdn.co/image/ab6761610000e5ebd95cf4457fac4cc62311f84f", text: "First comment!", likes: 5, doesUserLike: true, replies: [
      {id: 2, username: "User2", userProfile: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228", text: "Second comment!", likes: 10, doesUserLike: true, replies: []}, 
      {id: 3, username: "User3", userProfile: "https://i.scdn.co/image/ab67616d0000b2738cd1023ed6ec97598937d55c", text: "Third comment!", likes: 8, doesUserLike: false, replies: [
        { id: 3, username: "User3", userProfile: "https://i.scdn.co/image/ab67616d0000b2738cd1023ed6ec97598937d55c", text: "Third comment!", likes: 8, doesUserLike: true, replies: []}
    ]}] },
   { id: 2, username: "User2", userProfile: "https://i.scdn.co/image/ab67616d00004851c87bfeef81a210ddb7f717b5", text: "Second comment!", likes: 10, doesUserLike: true, replies: [] },
   { id: 3, username: "User3", userProfile: "https://i.scdn.co/image/ab67616d0000b2738cd1023ed6ec97598937d55c", text: "Third comment!", likes: 8, doesUserLike: false, replies: [] },
 ]);
 const [modalVisible, setModalVisible] = useState(true);
 const [newComment, setNewComment] = useState('');
 const [open, setOpen] = useState(false)
 const [author, setAuthor] = useState([])
 
 const onReply = () => {}
 return (
 
    <Modal isVisible={modalVisible}
      animationType="slide"
      transparent={true}
    >
      <ScrollView style={styles.container}>
        <View style={{position:'fied', top:0, width:'100%'}}><Pressable style={styles.closeButton} onPress={() => setModalVisible(onClose)}>
          <CloseIcon style={{color: 'white'}}/>
        </Pressable>
        <View style={{display: 'flex', alignItems: 'center', marginBottom: 30}}><Text style={styles.title}>Commentaires</Text></View>
        <Divider sx={{backgroundColor: Colors.Onyx }} component="li" /></View>
        <View style={styles.commentContainer}>
          {comments.map((item, index) => (
              <><Comment key= {item.id} data={item} onReply={onReply} setAuthor={setAuthor} setOpen={setOpen}/>
              {index === comments.length - 1 ? null : <Divider sx={{backgroundColor: Colors.Licorice }} component="li" />}</>
          ))}
        </View>
      </ScrollView>
      <View style={{backgroundColor: Colors.Licorice, position: 'fixed', bottom: 0, width: '100%', margin:'auto'}}>
        { open ? <Alert action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() =>setOpen(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Réponse à {author?.username} 
        </Alert> : null}
        <FormControl variant="standard">
          <OutlinedInput
            id="input-with-icon-adornment"
            startAdornment={
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            }
            placeholder='Ajouter un commentaire...'
            multiline
            size='normal'
          />
        </FormControl></View>
    </Modal>
    
 );
};


const styles = StyleSheet.create({
 container: {
   backgroundColor: Colors.Jet,
   borderRadius: 20,
   padding: 30,
 },
 title: {
   fontSize: 'x-large',
   fontWeight: 'bold',
   color: Colors.White
 },
 commentContainer: {
    backgroundColor: Colors.Jet,
    display: 'flex',
    alignContent: 'space-between',
    alignContent: 'center',
 },
 closeButton: {
    color: Colors.DarkSpringGreen,
    position: 'relative',
    top: 0,
    right: 0,
    fontSize:'large'
 },
});


export default CommentPopup;

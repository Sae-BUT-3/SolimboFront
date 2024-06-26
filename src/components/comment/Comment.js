import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable, View, Text, Platform, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../style/color';
import { Avatar, Divider } from 'react-native-paper';
import CommentResponse from './CommentResponse';
import axiosInstance from '../../api/axiosInstance';
import Date from '../common/DateT';
import ReadMore from 'react-native-read-more-text';
import { useNavigation } from '@react-navigation/native';
import Tokenizer from '../../utils/Tokenizer';
import ActionsPanel from '../common/ActionsPanel';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import PropTypes from 'prop-types';

const toCapitalCase = (mot) => mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;

const Comment = ({ data, hide }) => {
  const [replies, setReplies] = useState(null);
  const [like, setLike] = useState(data.doesUserLike);
  const [countLike, setCountLike] = useState(data.countLike);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentUser, setUser] = useState({});
  const [isActive, setActive] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const user = await Tokenizer.getCurrentUser();
      setUser(user);
    };
    fetchData();
  }, []);

  const handleLikePress = async (id) => {
    try {
      await axiosInstance.post(`comment/${id}/like`);
      setLike((prevLike) => !prevLike);
      setCountLike((prevCount) => (like ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.log(`comment/${id}/like : ${error.response.data}`);
    }
  };

  const displayReply = async () => {
    setActive(false);
    if (replies === null) {
      axiosInstance.get(`/comment/${data.id_com}`, {params: {page: 1, pageSize: data.countComment, orderByLike: false}})
      .then(response => {
        setReplies(response.data.comments);
      }).catch(e =>  console.log(`comment/${id} : ${e.response.data}`));
    } else {
      setReplies(null);
    }
  };

  const deleteComment = async () => {
    axiosInstance.delete(`comment/${data.id_com}`)
      .then(res => {
        
      }).catch(e => console.log(`delete comment : ${e.response.data}`));
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cet commentaire ?',
      [
        {
          text: 'Annuler',
          onPress: () => console.log('Annulation de la suppression'),
          style: 'cancel',
        },
        { text: 'Supprimer', onPress: () => { setActive(false); deleteComment(); } },
      ],
      { cancelable: false }
    );
  };

  const actions = [
    {
      name: 'comment-medical',
      handle: () => {
        setActive(false);
        navigation.navigate('Response', { type: 'comment', id: data.id_com });
      },
      color: Colors.SeaGreen,
      text: 'Répondre',
      textColor: Colors.White,
      solid: true,
      size: 30,
    },
  ];

  if (data.countComment > 0) {
    actions.push({
      name: 'comment-dots',
      handle: displayReply,
      color: Colors.SeaGreen,
      text: replies ? "Masquer les réponses" : 'Afficher les réponses',
      textColor: Colors.White,
      solid: true,
      size: 30,
    });
  }

  if (currentUser.id_utilisateur === data.utilisateur.id_utilisateur) {
    actions.push({
      name: 'trash-alt',
      handle: handleDelete,
      color: 'red',
      text: 'Supprimer',
      textColor: '#d62828',
      solid: true,
      size: 24,
    });
  }

  return (
    <View style={styles.commentContainer}>
      <Pressable onLongPress={() => setActive(!isActive)}>
        <View style={styles.userInfo}>
          <Pressable onPress={() => navigation.navigate('user', { id: data.utilisateur.id_utilisateur })}>
            <Avatar.Image source={{ uri: data.utilisateur.photo }} size={Platform.OS === 'web' ? 75 : 64} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('user', { id: data.utilisateur.id_utilisateur })}>
            <Text style={styles.userName}>{'@' + data.utilisateur.alias}</Text>
          </Pressable>
        </View>
        <View style={styles.commentTextContainer}>
          <ReadMore
            numberOfLines={5}
            renderTruncatedFooter={(handlePress) => (
              <Text onPress={handlePress} style={styles.readMore}>
                Lire plus
              </Text>
            )}
            renderRevealedFooter={(handlePress) => (
              <Text onPress={handlePress} style={styles.readMore}>
                Lire moins
              </Text>
            )}
            onReady={() => setIsExpanded(false)}
            onExpand={() => setIsExpanded(true)}
          >
            <Text style={styles.commentText}>{toCapitalCase(data.description)}</Text>
          </ReadMore>
        </View>
        <View style={styles.commentInfo}>
          <View style={styles.likeCommentInfo}>
            <View style={styles.likeInfo}>
              <Pressable onPress={() => handleLikePress(data.id_com)}>
                <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} solid={like} />
              </Pressable>
              <Text style={styles.likeCount}>{countLike}</Text>
            </View>
            <View style={styles.commentCountInfo}>
              <FontAwesome5 name="comments" size={30} color={Colors.DarkSpringGreen} />
              <Text style={styles.commentCount}>{data.countComment}</Text>
            </View>
          </View>
          <Date dateString={data.createdAt} />
        </View>
        {!hide && (data.countComment > 0 ? (
          <>
            <Divider style={styles.divider} />
            <View style={styles.replySection}>
              <Pressable onPress={displayReply}>
                <Text style={styles.replyText}>{replies ? "Masquer" : 'Voir les réponses '}</Text>
              </Pressable>
              <Pressable onPress={() => { navigation.navigate('response', { type: 'comment', id: data.id_com }) }}>
                <Text style={styles.replyText}> Répondre</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Divider style={styles.divider} />
            <View style={styles.replyContainer}>
              <Pressable onPress={() => { navigation.navigate('response', { type: 'comment', id: data.id_com }) }}>
                <Text style={styles.replyText}> Répondre</Text>
              </Pressable>
            </View>
          </>
        ))}
      </Pressable>
      {replies && (
        <>
          <Divider style={[styles.divider, { marginBottom: 15 }]} />
          <CommentResponse items={replies} />
        </>
      )}
      {isActive && <ActionsPanel actions={actions} />}
    </View>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    display: 'flex',
    padding: 20,
    marginBottom: Platform.OS == 'web' ? 30 : 20,
    marginHorizontal: Platform.OS == 'web' ? 20 : 0,
    width:  Platform.OS  == "web" ? wp('80%') : wp('90%'),
    backgroundColor: Colors.Jet,
    borderRadius: 15,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 3 : 0,
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    color: Colors.DarkSpringGreen,
    fontSize: 19,
    fontWeight: 'normal',
  },
  commentTextContainer: {
    marginBottom: Platform.OS == 'web' ? 20 : 10,
    marginTop: Platform.OS == 'web' ? 20 : 10,
  },
  readMore: {
    color: Colors.SeaGreen,
    fontSize: Platform.OS == 'web' ? 20 : 17,
    fontWeight: 'normal',
  },
  commentText: {
    color: Colors.White,
    padding: 10,
    fontSize: 19,
    fontWeight: 'normal',
  },
  commentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  likeCommentInfo: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  likeInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    color: Colors.White,
    padding: 10,
    fontSize: 19,
    fontWeight: 'normal',
  },
  commentCountInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    color: Colors.White,
    padding: 10,
    fontSize: 19,
    fontWeight: 'normal',
  },
  divider: {
    backgroundColor: Colors.BattleShipGray,
    marginTop: 10,
  },
  replySection: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  replyText: {
    color: Colors.DarkSpringGreen,
    fontSize: 19,
    fontWeight: 'normal',
  },
  replyContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
});

Comment.propTypes = {
  data: PropTypes.shape({
    id_com: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    countLike: PropTypes.number.isRequired,
    doesUserLike: PropTypes.bool.isRequired,
    countComment: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    utilisateur: PropTypes.shape({
      id_utilisateur: PropTypes.number.isRequired,
      alias: PropTypes.string.isRequired,
      photo: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  hide: PropTypes.bool,
};

Comment.defaultProps = {
  hide: false,
};

export default Comment;

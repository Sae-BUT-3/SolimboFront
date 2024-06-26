import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../style/color';
import { Avatar, Divider } from 'react-native-paper';
import DateT from '../common/DateT';
import { FontAwesome5 } from '@expo/vector-icons';
import ReadMore from 'react-native-read-more-text';
import axiosInstance from '../../api/axiosInstance';
import { useNavigation } from '@react-navigation/native';
import ActionsPanel from '../common/ActionsPanel';
import Tokenizer from '../../utils/Tokenizer';

const toCapitalCase = (mot) => mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : '';

const Response = ({ data }) => {
  const [like, setLike] = useState(false);
  const [countLike, setCountLike] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [replies, setReplies] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [isActive, setIsActive] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      setCurrentUser(await Tokenizer.getCurrentUser());
      setLike(data?.doesUserLike);
      setCountLike(data?.countLike);
    };
    fetchData();
  }, [data]);

  const handlePress = async () => {
    try {
      await axiosInstance.post(`comment/${data.id_com}/like`);
      setLike((prev) => !prev);
      setCountLike((prev) => (like ? prev - 1 : prev + 1));
    } catch (e) {
      console.error(`comment/${data.id_com}/like : ${e.response.data}`);
    }
  };

  const displayReply = async () => {
    setIsActive(false);
    if (replies === null) {
      try {
        const response = await axiosInstance.get(`/comment/${data.id_com}`, {
          params: { page: 1, pageSize: data.countComment, orderByLike: false },
        });
        setReplies(response.data.comments);
      } catch (e) {
        console.error(`comment/${data.id_com} : ${e.response.data}`);
      }
    } else {
      setReplies(null);
    }
  };

  const deleteComment = async () => {
    try {
      await axiosInstance.delete(`comment/${data.id_com}`);
    } catch (e) {
      console.error(`delete comment : ${e.response.data}`);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cet commentaire ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', onPress: () => { setIsActive(false); deleteComment(); } },
      ],
      { cancelable: false }
    );
  };

  const actions = [
    {
      name: 'comment-medical',
      handle: () => {
        setIsActive(false);
        navigation.navigate('response', { type: 'comment', id: data.id_com });
      },
      color: Colors.SeaGreen,
      text: 'Répondre',
      textColor: Colors.White,
      solid: true,
      size: 30,
    },
  ];

  if (data?.countComment > 0) {
    actions.push({
      name: 'comment-dots',
      handle: displayReply,
      color: Colors.SeaGreen,
      text: replies ? 'Masquer les réponses' : 'Afficher les réponses',
      textColor: Colors.White,
      solid: true,
      size: 30,
    });
  }

  if (currentUser.id_utilisateur === data?.utilisateur.id_utilisateur) {
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
      <Pressable onLongPress={() => setIsActive(!isActive)}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.navigate('user', { id: data?.utilisateur.id_utilisateur })}>
            <Avatar.Image source={{ uri: data?.utilisateur.photo }} size={Platform.OS === 'web' ? 75 : 64} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('user', { id: data?.utilisateur.id_utilisateur })}>
            <Text style={styles.alias}>{'@' + data?.utilisateur.alias}</Text>
          </Pressable>
        </View>
        <View style={styles.body}>
          <ReadMore
            numberOfLines={5}
            renderTruncatedFooter={(handlePress) => <Text onPress={handlePress} style={styles.readMore}>Lire plus</Text>}
            renderRevealedFooter={(handlePress) => <Text onPress={handlePress} style={styles.readMore}>Lire moins</Text>}
            onReady={() => setIsExpanded(false)}
            onExpand={() => setIsExpanded(true)}
          >
            <Text style={styles.description}>{toCapitalCase(data?.description)}</Text>
          </ReadMore>
        </View>
        <View style={styles.commentInfo}>
          <View style={styles.commentStats}>
            <View style={styles.statItem}>
              <View style={styles.statItem}>
                <Pressable onPress={handlePress}>
                  <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} solid={like} />
                </Pressable>
                <Text style={styles.statText}>{countLike}</Text>
              </View>
              <View style={styles.statItem}>
                <FontAwesome5 name="comments" size={30} color={Colors.DarkSpringGreen} />
                <Text style={styles.statText}>{data?.countComment}</Text>
              </View>
            </View>
            <DateT dateString={data?.createdAt} />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.commentActions}>
            {data?.countComment > 0 && (
              <Pressable onPress={displayReply}>
                <Text style={styles.commentActionText}>{replies ? 'Masquer' : 'Voir les réponses'}</Text>
              </Pressable>
            )}
            <Pressable onPress={() => navigation.navigate('response', { type: 'comment', id: data.id_com })}>
              <Text style={styles.commentActionText}>Répondre</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
      {replies && (
        <>
          <Divider style={[styles.divider, styles.repliesDivider]} />
          <CommentResponse items={replies} />
        </>
      )}
      {isActive && <ActionsPanel actions={actions} />}
    </View>
  );
};

const CommentResponse = ({ items }) => {
  return items.map((data, index) => (
    <React.Fragment key={index}>
      <Response data={data} />
      {index < items.length - 1 && <Divider style={styles.divider} />}
    </React.Fragment>
  ));
};

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: Colors.Jet,
    marginBottom: 10,
    marginTop: 5,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alias: {
    color: Colors.DarkSpringGreen,
    fontSize: 19,
  },
  body: {
    marginVertical: 10,
  },
  description: {
    color: Colors.White,
    padding: 10,
    fontSize: 19,
  },
  readMore: {
    color: Colors.SeaGreen,
    fontSize: Platform.OS === 'web' ? 20 : 17,
  },
  commentInfo: {
    marginTop: 10,
  },
  commentStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statText: {
    color: Colors.White,
    fontSize: 19,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  commentActionText: {
    color: Colors.DarkSpringGreen,
    fontSize: 19,
  },
  divider: {
    backgroundColor: Colors.Onyx,
    marginVertical: 10,
  },
  repliesDivider: {
    marginTop: 10,
  },
});

export default Response;

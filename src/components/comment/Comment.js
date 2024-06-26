import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  Platform,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Importation de FontAwesome depuis react-native-vector-icons
import { Colors } from "../../style/color";
import { Avatar, Divider } from "react-native-paper";
import CommentResponse from "./CommentResponse";
import axiosInstance from "../../api/axiosInstance";
import Date from "../common/DateT";
import ReadMore from "react-native-read-more-text";
import { useNavigation } from "@react-navigation/native";
import Tokenizer from "../../utils/Tokenizer";
import ActionsPanel from "../common/ActionsPanel";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { getDeeplLangAttribute } from "../../utils/DeepLangAttribute";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import PropTypes from 'prop-types';

const toCapitalCase = (mot) => {
  return mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;
};

const Comment = ({ data, hide }) => {
  const [comment, setComment] = useState(data);
  const [replies, setReplies] = useState(null);
  const [like, setLike] = useState(false);
  const [countlike, setCountLike] = useState(0);  
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentUser, setUser] = useState({});
  const [isActive, setActive] = useState(false);
  const navigation = useNavigation();

  const [isTradEnabled, setIsTradEnabled] = useState(false);
  const [isTradActive, setIsTradActive] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    axiosInstance
        .get(`/comment/${data?.id_com}`, {
          params: { page: 1, pageSize: 1, orderByLike: false , lang : getDeeplLangAttribute(i18next.language) },
        })
        .then((response) => {
          setReplies(response.data?.comments);
          setComment(response.data?.comment);
          if (response.data?.comment.translatedDescription != null && (response.data?.comment.translatedDescription !== response.data?.comment.description)) {
            setIsTradEnabled(true);
          }
        })
        .catch((e) => console.log(`comment/${data?.id_com} : ${e.response.data}`));
  }, [data]);

  const handleTradButtonClick = () => {
    setIsTradActive(!isTradActive);
  };

  const renderTruncatedFooter = (handlePress) => (
    <Text
      onPress={handlePress}
      style={{
        color: Colors.SeaGreen,
        fontSize: Platform.OS == "web" ? 20 : 17,
        fontWeight: "normal",
      }}
    >
      {t("common.readmore")}
    </Text>
  );

  const renderRevealedFooter = (handlePress) => (
    <Text
      onPress={handlePress}
      style={{
        color: Colors.SeaGreen,
        fontSize: Platform.OS == "web" ? 20 : 17,
        fontWeight: "normal",
      }}
    >
      {t("common.readless")}
    </Text>
  );
  const getData = async () => {
    setUser(await Tokenizer.getCurrentUser());
  };
  useEffect(() => {
    getData();
    setLike(data?.doesUserLike);
    setCountLike(data?.countLike);
  }, [data]);

  const handleLikePress = (id) => {
    axiosInstance
      .post(`comment/${id}/like`)
      .then((res) => {
        if (!like) {
          setLike(true);
          setCountLike(countlike + 1);
        } else {
          setLike(false);
          setCountLike(countlike - 1);
        }
      })
      .catch((e) => console.log(`comment/${id}/like : ${e.response.data}`));
  };

  const displayReply = () => {
    setActive(false);
    if (replies === null) {
      axiosInstance
        .get(`/comment/${data?.id_com}`, {
          params: { page: 1, pageSize: data?.countComment, orderByLike: false , lang: i18next.language },
        })
        .then((response) => {
          setReplies(response.data?.comments);
          setComment(response.data?.comment);
          if (response.data?.comment.translatedDescription != null) {
            setIsTradEnabled(true);
          }
        })
        .catch((e) => console.log(`comment/${id} : ${e.response.data}`));
    } else {
      setReplies(null);
    }
  };

  const deleteComment = () => {
    axiosInstance
      .delete(`comment/${data?.id_com}`)
      .then((res) => {})
      .catch((e) => console.log(`delete comment : ${e.response.data}`));
  };
  const handleDelete = () => {
    Alert.alert(
      t("common.confirmation"),
      t("comment.deleteverification"),
      [
        {
          text: t("common.cancel"),
          onPress: () => t("review.canceldelete"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          onPress: () => {
            setActive(false);
            deleteComment();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const actions = [
    {
      name: "comment-medical",
      handle: () => {
        setActive(false);
        navigation.navigate("Response", { type: "comment", id: data?.id_com });
      },
      color: Colors.SeaGreen,
      text: t("common.reply"),
      textColor: Colors.White,
      solid: true,
      size: 30,
    },
  ];
  if (data?.countComment > 0) {
    actions.push({
      name: "comment-dots",
      handle: displayReply,
      color: Colors.SeaGreen,
      text: replies ? t("comment.hide") : t("comment.display"),
      textColor: Colors.White,
      solid: true,
      size: 30,
    });
  }
  if (currentUser.id_utilisateur === data?.utilisateur.id_utilisateur) {
    actions.push({
      name: "trash-alt",
      handle: handleDelete,
      color: "red",
      text: t("common.delete"),
      textColor: "#d62828",
      solid: true,
      size: 24,
    });
  }
  return (
    <View style={styles.commentContainer}>
      <Pressable onLongPress={() => setActive(!isActive)}>
        <View style={styles.userInfo} >
          <Pressable
            onPress={() =>
              navigation.navigate("user", {
                id: data?.utilisateur.id_utilisateur,
              })
            }
          >
            <Avatar.Image
              source={{ uri: data?.utilisateur.photo }}
              size={Platform.OS === "web" ? 75 : 64}
            />
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("user", {
                id: data?.utilisateur.id_utilisateur,
              })
            }
          >
            <Text style={styles.userName} >
              {"@" + data?.utilisateur.alias}
            </Text>
          </Pressable>
        </View>
        <View style={styles.commentTextContainer} >
          <ReadMore
            numberOfLines={5}
            renderTruncatedFooter={renderTruncatedFooter}
            renderRevealedFooter={renderRevealedFooter}
            onReady={() => setIsExpanded(false)}
            onExpand={() => setIsExpanded(true)}
          >
            <Text style={styles.commentText} > 
              {isTradActive ? toCapitalCase(comment.translatedDescription) : toCapitalCase(comment.description)}  
            </Text>
          </ReadMore>
        </View>
        <View style={styles.commentInfo}>
          <View style={styles.likeCommentInfo}>
            <View style={styles.likeInfo}>
              <Pressable onPress={() => handleLikePress(data?.id_com)}>
                <FontAwesome5 name="heart" size={30} color={Colors.DarkSpringGreen} solid={like} />
              </Pressable>
              <Text style={styles.likeCount}>{countlike}</Text>
            </View>
            <View style={styles.commentCountInfo}>
              <FontAwesome5 name="comments" size={30} color={Colors.DarkSpringGreen} />
              <Text style={styles.commentCount}>{data?.countComment}</Text>
              {isTradEnabled ? (
                <Pressable onPress={handleTradButtonClick}>
                  {isTradActive ? (
                  <FontAwesome5
                    name="language"
                    size={30}
                    color={Colors.DarkSpringGreen}
                    solid
                  />
                ) : (
                  <FontAwesome5
                    name="language"
                    size={30}
                    color={Colors.Onyx}
                    regular
                  />
                )}
                </Pressable>
              ) : null}
            </View>
          </View>
          <Date dateString={data?.createdAt} />
        </View>
        {!hide && (data?.countComment > 0 ? (
          <>
            <Divider style={styles.divider} />
            <View style={styles.replySection}>
              <Pressable onPress={displayReply}>
                <Text style={styles.replyText}>{replies ?  t("comment.hide") : t("comment.display") }</Text>
              </Pressable>
              <Pressable onPress={() => { navigation.navigate('response', { type: 'comment', id: data?.id_com }) }}>
                <Text style={styles.replyText}> {t("common.reply")}</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Divider style={styles.divider} />
            <View style={styles.replyContainer}>
              <Pressable onPress={() => { navigation.navigate('response', { type: 'comment', id: data?.id_com }) }}>
                <Text style={styles.replyText}> {t("common.reply")}</Text>
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
};

const styles = StyleSheet.create({
  commentContainer: {
    display: 'flex',
    padding: 20,
    marginBottom: Platform.OS == 'web' ? 30 : 20,
    marginLeft: Platform.OS  == "web" ? 20 : 0,
    marginRight: Platform.OS  == "web" ? 20 : 0,
    marginHorizontal: Platform.OS == 'web' ? 20 : 0,
    width:  Platform.OS  == "web" ? wp('85%') : wp('90%'),
    backgroundColor: Colors.Jet,
    borderRadius: 15,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 3 : 0, 
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

export default Comment;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { Colors } from "../../style/color";
import { breakpoint } from "../../style/breakpoint";
import commonStyles from "../../style/commonStyle";
import ReadMore from "react-native-read-more-text";
import ImagePanel from "../common/ImagePanel";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import screenStyle from "../../style/screenStyle";

const toCapitalCase = (mot) => {
  if (mot === "artist") mot = mot + "e";
  return mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;
};

const getFollowValues = (user, relation) => {
  if (!user) return ["+ Suivre", "Suivi"];
  let afterFollow = "Suivi";
  let beforeFollow = "+ Suivre";

  if (user.is_private && (relation.isWaited || !relation.isFollowed)) {
    afterFollow = "En attente";
  }
  if (relation.doesFollows) {
    beforeFollow = "Suivre en retour";
  }

  return relation.isFollowed
    ? [afterFollow, beforeFollow]
    : [beforeFollow, afterFollow];
};

function Profile({
  user,
  isCurrent,
  relation,
  handleFollow,
  followed,
  followers,
  onRefresh,
}) {
  const [followText, setFollowText] = useState(["+ Suivre", "Suivi"]);
  const [isFollowHovered, setIsFollowHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const windowDimensions = useWindowDimensions();
  const width = windowDimensions ? windowDimensions.width : 0;

  useEffect(() => {
    setFollowText(getFollowValues(user, relation));
  }, [user, relation]);

  const handleFollowMouseEnter = () => {
    setIsFollowHovered(true);
  };

  const handleFollowMouseLeave = () => {
    setIsFollowHovered(false);
  };

  const onFollowPress = () => {
    handleFollow();
    setFollowText([followText[1], followText[0]]);
    setIsFollowHovered(!isFollowHovered);
  };

  const styles = StyleSheet.create({
    container: {
      gap: 10,
      paddingBottom: 15,
      width: Platform.OS === "web" ?  wp('80%') : wp('90%'),
    },
    image: {
      width: width < breakpoint.medium ? 75 : 80,
      height: width < breakpoint.medium ? 75 : 80,
      borderRadius: width < breakpoint.medium ? 35 : 40,
    },
    imageContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: 'flex-start',
      gap: 10,
      paddingLeft: 15,
    },
    diplayContainer: {
      justifyContent: "space-around",
      alignItems: "flex-start",
      flexDirection: "row",
      gap: 35,
    },
    aliasText: {
      fontSize: Platform.OS === "web" ? 35 : 25,
      fontWeight: "500",
      color: Colors.Celadon,
    },
    pseudoText: {
      color: Colors.SeaGreen,
      fontSize: 12,
      fontWeight: "600",
    },
    btnFollowHovered: {
      backgroundColor: Colors.Jet,
    },
    followText: {
      color: Colors.White,
      fontWeight: "bold",
      textAlign: "center",
      alignItems: "center",
      fontSize: 15,
    },
    numberContainer: {
      flexDirection: "row",
      paddingLeft: 10,
      justifyContent: "space-around",
    },
    numberText: {
      fontSize: 15,
      color: Colors.White,
    },
    numberValue: {
      color: Colors.White,
      fontWeight: "bold",
      fontSize: 17,
    },
    bioText: {
      color: Colors.White,
      textAlign: "justify",
      fontSize: Platform.OS === "web" ? 20 : 17,
    },
    descriptionContainer: {
      marginBottom: Platform.OS == 'web' ? 20 : 15,
      marginTop: Platform.OS == 'web' ? 20 : 15,
      marginLeft: 20,
    },
  });

  const renderTruncatedFooter = (handlePress) => (
    <Text
      onPress={handlePress}
      style={{
        color: Colors.SeaGreen,
        fontSize: Platform.OS == "web" ? 20 : 17,
        fontWeight: "normal",
      }}
    >
      Lire plus
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
      Lire moins
    </Text>
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View style={styles.diplayContainer}>
            <Image
              style={styles.image}
              source={{
                uri:
                  user?.photo ||
                  "https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg",
              }}
            />
            <View>
              <Text style={[commonStyles.text, styles.aliasText]}>
                {user?.alias}
              </Text>
              <Text style={[commonStyles.text, styles.pseudoText]}>
                @{user?.pseudo}
              </Text>
            </View>
          </View>
          {isCurrent ? null : (
            <Pressable
              style={[
                screenStyle.followButton,
                {
                  backgroundColor: relation?.isWaited || relation?.isFollowed
                    ? Colors.Jet
                    : Colors.DarkSpringGreen,
                },
                isFollowHovered ? styles.btnFollowHovered : null,
              ]}
              activeOpacity={1}
              onMouseEnter={handleFollowMouseEnter}
              onMouseLeave={handleFollowMouseLeave}
              onPress={onFollowPress}
            >
              <Text numberOfLines={1} style={styles.followText}>
                {followText[0]}
              </Text>
            </Pressable>
          )}
        </View>
        <View style={styles.descriptionContainer}>
          <ReadMore
            numberOfLines={3}
            renderTruncatedFooter={renderTruncatedFooter}
            renderRevealedFooter={renderRevealedFooter}
            onReady={() => setIsExpanded(false)}
            onExpand={() => setIsExpanded(true)}
          >
            <Text
              style={styles.bioText}
            >
              {toCapitalCase(user?.bio)}
            </Text>
          </ReadMore>
        </View>
        <View style={styles.numberContainer}>
          <View style={styles.followText}>
            <Text style={styles.numberValue}>{user?.review_count}</Text>
            <Text style={styles.numberText}>Critique(s)</Text>
          </View>
          <Pressable onPress={() => setVisible(!visible)}>
            <View style={styles.followText}>
              <Text style={styles.numberValue}>{user?.follower_count}</Text>
              <Text style={styles.numberText}>Abonné(s)</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => setShowAll(!showAll)}>
            <View style={styles.followText}>
              <Text style={styles.numberValue}>{user?.following_count}</Text>
              <Text style={styles.numberText}>Abonnement(s)</Text>
            </View>
          </Pressable>
        </View>
      </View>
      {user?.follower_count > 0 && visible && (
        <ImagePanel
          avatars={followers}
          type={"user"}
          show={setVisible}
          onRefresh={onRefresh}
        />
      )}
      {user?.following_count > 0 && showAll && (
        <ImagePanel
          avatars={followed}
          show={setShowAll}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}

export default Profile;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Pressable,
} from "react-native";
import { Colors } from "../../style/color";
import { breakpoint } from "../../style/breakpoint";
import commonStyles from "../../style/commonStyle";
import ReadMore from 'react-native-read-more-text';
import ImagePanel from "../common/ImagePanel";

const toCapitalCase = (mot) => {
  if(mot == 'artist') mot =  mot + 'e'
  return mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;
}

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
  if (relation.doesFollow) {
  }
  return relation.isFollowed
    ? [afterFollow, beforeFollow]
    : [beforeFollow, afterFollow];
};
function SearchBar({
  user,
  isCurrent,
  relation,
  handleFollow,
  followed,
  followers,
  onRefresh
}) {
  const { height, width } = useWindowDimensions();
  const [followText, setFollowText] = useState(["+ Suivre", "Suivi"]);
  const [isFollowHovered, setIsFollowHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [visible, isVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const renderTruncatedFooter = (handlePress) => (
    <Text onPress={handlePress} style={{ color: Colors.SeaGreen, fontSize: Platform.OS == 'web' ? 20 : 17, fontWeight: 'normal' }}>
      Lire plus
    </Text>
  );

  const renderRevealedFooter = (handlePress) => (
    <Text onPress={handlePress} style={{ color: Colors.SeaGreen, fontSize: Platform.OS == 'web' ? 20 : 17, fontWeight: 'normal' }}>
      Lire moins
    </Text>
  );

  useEffect(() => {
    setFollowText(getFollowValues(user, relation));
  }, [user]);
  const handleFollowMouseEnter = () => {
    setIsFollowHovered(true);
  };

  const handleFollowMouseLeave = () => {
    setIsFollowHovered(false);
  };

  const onFollowPress = () => {
    handleFollow().then(() => {
      setFollowText([followText[1], followText[0]]);
    });
  };
  const styles = StyleSheet.create({
    container: {
      gap: 10,
      marginBottom: 15,
    },
    diplayContainer: {
      alignItems: "center",
      justifyContent: "space-around",
    },
    image: {
      width: width < breakpoint.medium ? 75 : 80,
      height: width < breakpoint.medium ? 75 : 80,
      borderRadius: width < breakpoint.medium ? 35 : 40,
    },
    imageContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: "center",
      gap: 10,
      paddingLeft: 9
    },

    infoContainer: {
      flex: 1,
      justifyContent: "center",
    },
    numberContainer: {
      flexDirection: "row",
      paddingHorizontal: 30,
      justifyContent:
        width < breakpoint.mobile ? "space-between" : "space-around",
    },
    followText: {
      fontWeight: "600",
      textAlign: "center",
      color: Colors.White,
    },
    followButton: {
      backgroundColor: Colors.SeaGreen,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 15,
      marginTop: 10,
      shadowColor: Colors.Onyx,
      shadowOpacity: 0.3,
      shadowRadius: 3,
      maxWidth: 250,
      elevation: Platform.OS === 'android' ? 3 : 0, 
      transition: 'background-color 0.3s ease',
      width: 150
    },
    btnFollowHovered: {
      backgroundColor: Colors.Jet,
    },
    btnModiferHovered: {
      backgroundColor: Colors.SeaGreen,
    },
    aliasText: {
      fontSize: Platform.OS === 'web' ? 35 : 25,
      fontWeight: "500",
      color: Colors.Celadon,
    },
    pseudoText: {
      color: Colors.SeaGreen,
      fontSize: 12,
      fontWeight: "600",
    },
    followText:{
      color: Colors.White,
      fontWeight: 'bold',
      textAlign: 'center',
      alignItems: 'center',
      fontSize: 15
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
      textAlign: 'left',
      fontSize: Platform.OS === 'web' ? 20 : 15
    },
  });

  return (<>
    <View style={[styles.container]}>
      <View style={[styles.imageContainer]}>
          <View style={{justifyContent: 'space-around', alignItems: 'flex-start', flexDirection: 'row', gap: 35}}>
            <Image
              style={styles.image}
              source={{
                uri:
                  user?.photo ||
                  "https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg",
              }}
            />        
            <View style={[styles.diplayContainer]}>
              <Text style={[commonStyles.text, styles.aliasText]}>{user?.alias}</Text>
              <Text style={[commonStyles.text, styles.pseudoText]}> @{user?.pseudo}</Text>
            </View>
          </View>
          {isCurrent ? null : (
            <Pressable
              style={[
                styles.followButton,
                {backgroundColor : relation?.isWaited ? Colors.Jet : Colors.DarkSpringGreen},
                isFollowHovered ? styles.btnFollowHovered : null,
              ]}
              activeOpacity={1}
              onMouseEnter={handleFollowMouseEnter}
              onMouseLeave={handleFollowMouseLeave}
              onPress={onFollowPress}
            >
              {!false ? (
                <Text numberOfLines={1} style={styles.followText}>
                  {followText[0]}
                </Text>
              ) : (
                <Text numberOfLines={1} style={styles.followText}>Suivi</Text>
              )}
            </Pressable>
          )}    
      </View>
      <View style={{paddingHorizontal: 35}}>
        <ReadMore
          numberOfLines={2}
          renderTruncatedFooter={renderTruncatedFooter}
          renderRevealedFooter={renderRevealedFooter}
          onReady={() => setIsExpanded(false)}
          onExpand={() => setIsExpanded(true)}
        >
          <Text style={{color: Colors.White, padding:10, fontSize: Platform.OS == 'web' ? 20 : 16, fontWeight: 'normal' }}>{toCapitalCase(user?.bio)}</Text>
        </ReadMore>
      </View>
     
      <View style={styles.numberContainer}>
        <View style={styles.followText}>
          <Text style={styles.numberValue}>{user?.review_count}</Text>
          <Text style={styles.numberText}>Critique</Text>
        </View>
        <Pressable onPress={()=> isVisible(!visible)}>
          <View style={styles.followText}>
            <Text style={styles.numberValue}>{user?.follower_count}</Text>
            <Text style={styles.numberText}>Abonné</Text>
          </View>
        </Pressable>
        
        <Pressable onPress={()=> setShowAll(!showAll)}>
          <View style={styles.followText}>
            <Text style={styles.numberValue}>{user?.following_count}</Text>
            <Text style={styles.numberText}>Abonnement</Text>
          </View>
        </Pressable>
       
      </View>
    </View>
    { (user?.follower_count > 0 && visible) && <ImagePanel avatars={followers} type={'user'} show={isVisible} onRefresh={onRefresh}/>}
    { (user?.following_count > 0 && showAll) && <ImagePanel avatars={followed} show={setShowAll} onRefresh={onRefresh} />}
    </>
  );
}

export default SearchBar;

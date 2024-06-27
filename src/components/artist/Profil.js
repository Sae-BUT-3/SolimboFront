import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  ImageBackground,
  Image,
} from "react-native";
import { Colors } from "../../style/color";
import AvatarGroup from "../common/AvatarGroup";
import { Avatar, Divider } from "react-native-paper";
import Follower from "../follow/Follower";
import ImagePanel from "../common/ImagePanel";
import { useTranslation } from "react-i18next";
import screenStyle from "../../style/screenStyle";

const Profil = ({ data, friends_followers, follow, followArtist }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [visible, isVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleImageMouseEnter = () => {
    setIsImageHovered(true);
  };

  const handleImageMouseLeave = () => {
    setIsImageHovered(false);
  };

  return (
    <>
      <ImageBackground
        source={{ uri: data.image }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View key={data.id} style={styles.profileContainer}>
            <View>
              <Pressable
                activeOpacity={1}
                onMouseEnter={handleImageMouseEnter}
                onMouseLeave={handleImageMouseLeave}
                style={[isImageHovered && styles.imageContainerHovered]}
              >
                <Image
                  source={{ uri: data.image }}
                  style={{ width: 164, height: 164, borderRadius: 82 }}
                />
              </Pressable>
              <Pressable
                style={[
                  screenStyle.followButton,
                  isHovered ? styles.btnHovered : null,
                ]}
                activeOpacity={1}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onPress={followArtist}
              >
                {!follow ? (
                  <Text style={styles.buttonText}>{t("friend.follow")}</Text>
                ) : (
                  <Text style={styles.buttonText}>{t("friend.followed")}</Text>
                )}
              </Pressable>
            </View>
            <View
              style={{
                display: Platform.OS !== "web" ? "flex" : undefined,
                alignItems: Platform.OS !== "web" ? "center" : null,
              }}
            >
              <View style={screenStyle.container}>
                <Text numberOfLines={2} style={styles.nameA}>
                  {data.name}
                </Text>
              </View>
              <View style={styles.sectionFollower}>
                <View>
                  <Pressable onPress={() => isVisible(!visible)}>
                    <Text
                      style={{
                        color: Colors.White,
                        fontSize: 20,
                        textAlign: "center",
                        margin: 5,
                        fontWeight: "bold",
                      }}
                    >
                      {data.follower_count}
                    </Text>
                  </Pressable>
                  <Text
                    style={{
                      color: Colors.White,
                      fontSize: 16,
                      textAlign: "center",
                      margin: 5,
                    }}
                  >
                    {t("friend.followers")}
                  </Text>
                </View>
                {friends_followers.count > 0 && (
                  <>
                    <Divider
                      style={{
                        height: "100%",
                        width: 1,
                        backgroundColor: Colors.White,
                      }}
                    />
                    <View style={{ display: "flex", alignItems: "center" }}>
                      {friends_followers && friends_followers.count > 1 ? (
                        <Pressable onPress={() => setShowAll(!showAll)}>
                          <AvatarGroup
                            avatars={friends_followers.users}
                            size={34}
                            type="user"
                          />
                        </Pressable>
                      ) : (
                        <Pressable>
                          <Avatar.Image
                            source={{ uri: friends_followers.users[0].photo }}
                            size={34}
                          />
                        </Pressable>
                      )}
                      <Text
                        style={{
                          color: Colors.White,
                          fontSize: 16,
                          textAlign: "center",
                          margin: 5,
                        }}
                      >
                        {t("friend.count", { count: friends_followers.count })}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
      {visible && data.follower_count > 0 && (
        <Follower id={data.id} isVisible={isVisible} type="follower" />
      )}
      {friends_followers.count > 1 && showAll && (
        <ImagePanel
          avatars={friends_followers.users}
          type={"user"}
          show={setShowAll}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 30,
    color: Colors.White,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    borderBottomLeftRadius: 75,
    borderBottomRightRadius: 75,
  },
  btnHovered: {
    backgroundColor: Colors.SeaGreen,
  },
  buttonText: {
    color: Colors.White,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  sectionFollower: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 20,
    backgroundColor: Colors.BattleShipGray,
    borderRadius: 9,
    padding: 10,
    gap: 8,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === "android" ? 4 : 0,
  },
  container: {
    flexDirection: "row", // Définit une disposition des éléments en ligne
    flexWrap: "wrap", // Permet le retour à la ligne automatique
    alignItems: "flex-start", // Aligne les éléments en haut
  },
  nameA: {
    fontSize: Platform.OS === "web" ? 30 : 20,
    color: Colors.White,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowRadius: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    overflow: "hidden",
    borderBottomLeftRadius: 75,
    borderBottomRightRadius: 75,
    marginBottom: 30,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === "android" ? 3 : 0,
  },
  imageContainerHovered: {
    transform: [{ scale: 1.2 }],
  },
});

export default Profil;

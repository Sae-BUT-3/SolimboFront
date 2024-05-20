import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, useWindowDimensions, TouchableOpacity, Pressable, ScrollView, Platform } from "react-native";
import { Switch } from "react-native-switch";
import { Colors } from "../../../style/color";
import { breakpoint } from "../../../style/breakpoint";
import * as ImagePicker from "expo-image-picker";
import axiosInstance from "../../../api/axiosInstance";
import ModifyInput from "./ModifyInput";
import hexToRgbA from "../../../utils/HexToRgbA";
import pressableBasicStyle from "../../../style/pressableBasicStyle";
import { FontAwesome} from "@expo/vector-icons";
import BasicInput from "../../form/BasicInput";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../contexts/AuthContext";
import { Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const MIN_PSEUDO = 3;

const Update = ({ user }) => {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logout } = useAuth();
  const navigation = useNavigation();
  
  const handleResetPassword = () => {
    setShowPasswordInput(!showPasswordInput);
  };

  const handleUpdateEmail = () => {
    setShowEmailInput(!showEmailInput);
  };

  const handleSubmitEmail = () => {
    axiosInstance.post('users/sendResetEmail', { email })
      .then(() => {
        setShowEmailInput(false);
        setEmail('');
        Toast.show({
          type: 'success',
          text1: '✅  Email bien modifiée',
          text1Style: {color: Colors.White},
          position: 'bottom'
        });
      })
      .catch((e) => {
        console.error(e);
        Toast.show({
          type: 'error',
          text1: '❌  Une erreur interne est survenue.',
          position: 'bottom'
        });
      });
  };

  const handleSubmitPassword = () => {
    axiosInstance.post('users/resetPassword', { password, resetToken: user.reset_token })
      .then(() => {
        setShowPasswordInput(false);
        setPassword('');
        Toast.show({
          type: 'success',
          text1: '✅  Mot de passe bien modifiée',
          text1Style: {color: Colors.White},
          position: 'bottom'
        });
      })
      .catch((e) => {
        console.error(e);
        Toast.show({
          type: 'error',
          text1: '❌  Une erreur interne est survenue.',
          position: 'bottom'
        });
      });
  };

  return (
    <View style={{ justifyContent: "center"}}>
      <View style={{ justifyContent: 'center', flexDirection: "row-reverse", alignItems: 'baseline', flexWrap: 'wrap', gap: 15, marginBottom: 30}}>
        <Pressable onPress={handleUpdateEmail}>
          <Text style={styles.buttonText}>Mettre à jour l'email</Text>
        </Pressable>
       <Divider style={styles.divider} />
        <Pressable onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Réinitialiser le mot de passe</Text>
        </Pressable>
        <Pressable onPress={() => {
          logout()
          navigation.navigate('signin');
        }}>
          <Text style={[styles.text, { color: Colors.Red }]}>Se déconnecter</Text> 
        </Pressable>
      </View>  
      
      <View style={{justifyContent: "center", alignItems: 'center'}}>
        {showEmailInput && (
          <>
            <BasicInput
              autoCapitalize="none"
              autoCorrect={false} 
              placeholder="Nouvel email"
              textContentType="emailAddress"
              keyboardType="email-address"
              value={email} 
              onChangeText={setEmail}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Pressable
                style={[pressableBasicStyle.button, { width: 120 }]}
                onPress={handleSubmitEmail}
              >
                <FontAwesome size={20} name='pencil' color={Colors.White} style={{ paddingRight: 10 }} />
                <Text style={pressableBasicStyle.button_text}>Modifier</Text>
              </Pressable>
              <Pressable
                style={[pressableBasicStyle.button, { backgroundColor: Colors.Red, width: 120 }]}
                onPress={() => setShowEmailInput(false)}
              >
                <FontAwesome size={20} name='close' color={Colors.White} style={{ paddingRight: 10 }} />
                <Text style={pressableBasicStyle.button_text}>Annuler</Text>
              </Pressable>
            </View>
          </>
        )}
        {showPasswordInput && (
          <>
            <BasicInput 
              style={styles.input} 
              placeholder="Nouveau mot de passe" 
              secureTextEntry
              onChangeText={setPassword} 
              value={password}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Pressable
                style={[pressableBasicStyle.button, { width: 120 }]}
                onPress={handleSubmitPassword}
              >
                <FontAwesome size={20} name='pencil' color={Colors.White} style={{ paddingRight: 10 }} />
                <Text style={pressableBasicStyle.button_text}>Modifier</Text>
              </Pressable>
              <Pressable
                style={[pressableBasicStyle.button, { backgroundColor: Colors.Red, width: 120 }]}
                onPress={() => setShowPasswordInput(false)}
              >
                <FontAwesome size={20} name='close' color={Colors.White} style={{ paddingRight: 10 }} />
                <Text style={pressableBasicStyle.button_text}>Annuler</Text>
              </Pressable>
            </View>
            
          </>
        )}
      </View>
    </View>
  );
};

function ModifyForm({ user, checkPseudo, handleModify, isModify, setModify }) {
  const windowDimensions = useWindowDimensions();
  const width = windowDimensions ? windowDimensions.width : 0;
  const [imageHovered, setImageHovered] = useState(false);
  const [image, setImage] = useState("");
  const [uri, setUri] = useState("");
  const [actualAlias, setActualAlias] = useState("");
  const [actualPseudo, setActualPseudo] = useState("");
  const [actualBio, setActualBio] = useState("");
  const [pseudoError, setPseudoError] = useState("");
  const [aliasError, setAliasError] = useState("");
  const [isPseudoValid, setIsPseudoValid] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [spotify, setAuthSpotify] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    setActualAlias(user?.alias);
    setActualPseudo(user?.pseudo);
    setActualBio(user?.bio);
    setIsPrivate(user?.is_private);
    setAuthSpotify(user?.auth_with_spotify)
    setUri(
      user?.photo ||
        "https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg"
    );
  }, [user]);

  const handleImagePickerPress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
      setUri(result.assets[0].uri);
    }
  };

  const handleAliasChange = (value) => {
    setActualAlias(value);
  };

  const handlePseudoChange = async (value) => {
    setPseudoError("");
    setActualPseudo(value);
    setIsPseudoValid(true);
    if (value !== user.pseudo && !(await checkPseudo(value))) {
      setPseudoError("Le pseudo est déjà pris");
      setIsPseudoValid(false);
    }
  };

  const handleBioChange = (value) => {
    setActualBio(value);
  };

  const handleSubmit = async () => {
    let valid = true;
    if (!isPseudoValid) {
      setPseudoError("Le pseudo est déjà pris");
      valid = false;
    }
    if (actualAlias.length < MIN_PSEUDO) {
      setAliasError("L'alias doit contenir au moins 3 caractères");
      valid = false;
    }
    if (actualPseudo.length < MIN_PSEUDO) {
      setPseudoError("Le pseudo doit contenir au moins 3 caractères");
      valid = false;
    }
    if (valid) {
      const formData = new FormData();
      if (image) {
        const binaryImg = atob(image.base64);
        const blob = new Blob(
          [
            new Uint8Array(
              Array.prototype.map.call(binaryImg, (c) => c.charCodeAt(0))
            ),
          ],
          { type: "image/jpeg" }
        );

        formData.append("photo", blob, "image.jpeg");
      }
      if (actualAlias !== user.alias) {
        formData.append("alias", actualAlias);
      }
      if (actualPseudo !== user.pseudo) {
        formData.append("pseudo", actualPseudo);
      }
      if (actualBio !== user.bio) {
        formData.append("bio", actualBio);
      }
      formData.append("isPrivate", isPrivate);
      handleModify(formData);
    }
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: Colors.Licorice,
    },
    imageContainer: {
      position: "relative",
      marginBottom: 10,
      backgroundColor: Colors.Licorice
    },
    image: {
      width: width > breakpoint.small ? 200 : 95,
      height: width > breakpoint.small ? 200 : 95,
      borderRadius: width < breakpoint.medium ? 100 : 75,
    },
    imageChangeContainer: {
      position: "absolute",
      top: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: hexToRgbA(Colors.Jet, imageHovered ? 0.1 : 0.4),
    },
    imageChange: {
      width: Platform.OS === 'web' ? "70%" : 85,
      height: Platform.OS === 'web' ? "70%" : 85,
    },
    switch: {
      marginBottom: 10,
    },
    header:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: uri }} />
       { isModify && <TouchableOpacity
          onPress={handleImagePickerPress}
          style={[styles.image, styles.imageChangeContainer]}
          onMouseEnter={() => setImageHovered(true)}
          onMouseLeave={() => setImageHovered(false)}
        >
          <Image
            style={styles.imageChange}
            source={require("../../../assets/images/photo.png")}
          />
        </TouchableOpacity>}
      </View>
      <Switch
        value={isPrivate}
        onValueChange={(val) => setIsPrivate(val)}
        disabled={!isModify}
        activeText={"Privé"}
        inActiveText={"Public"}
        backgroundActive={Colors.SeaGreen}
        backgroundInactive={Colors.Jet}
        circleActiveColor={Colors.CalPolyGreen}
        circleInActiveColor={Colors.Licorice}
        circleSize={20.25}
        barHeight={27}
        circleBorderWidth={0}
        switchLeftPx={2.5}
        switchRightPx={2.5}
        switchWidthMultiplier={4.1}
        style={styles.switch}
      />
      <ModifyInput
        max={15}
        label="Alias"
        error={aliasError}
        value={actualAlias}
        onChangeText={handleAliasChange}
        onFocus={() => setAliasError("")}
        editable={!isModify}
      />
      <ModifyInput
        max={15}
        label="Pseudo"
        value={actualPseudo}
        error={pseudoError}
        onChangeText={handlePseudoChange}
        onFocus={() => setPseudoError("")}
        editable={!isModify}
      />
      <ModifyInput
        max={200}
        multiline={true}
        numberOfLines={4}
        label="Biographie"
        height={100}
        value={actualBio}
        onChangeText={handleBioChange}
        editable={!isModify}
      />
      {isModify &&
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Pressable
            style={[pressableBasicStyle.button, { width: 150 }]}
            onPress={handleSubmit}
          >
            <FontAwesome size={20} name='pencil' color={Colors.White} style={{ paddingRight: 10 }} />
            <Text style={pressableBasicStyle.button_text}>Modifier</Text>
          </Pressable>
          <Pressable
            style={[pressableBasicStyle.button, { backgroundColor: Colors.Red, width: 150 }]}
            onPress={() => setModify(false)}
          >
            <FontAwesome size={20} name='close' color={Colors.White} style={{ paddingRight: 10 }} />
            <Text style={pressableBasicStyle.button_text}>Annuler</Text>
          </Pressable>
        </View>}
      {!spotify && <Update user={user} />}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: Colors.White,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  divider: {
    height: 2,
    borderColor: Colors.Silver,
    marginVertical: 10,
  },
});

export default ModifyForm;

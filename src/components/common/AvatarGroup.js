import React from 'react';
import { Platform } from 'react-native';
import { View} from 'react-native';
import { Avatar } from 'react-native-paper';
import { Colors } from '../../style/color';

const AvatarGroup = ({ avatars, size, type}) => {
  const maxAvatars = Platform.OS === 'web' ? 5 : 3;

  return (   
    <View style={{ flexDirection: 'row' , alignItems: 'center',}}>
      {avatars && avatars.slice(0, maxAvatars).map((avatar, index) => (
        <Avatar.Image
          key={index}
          source={{ uri: type === 'user' ? avatar?.photo : avatar?.image }}
          size={size}
          style={{ marginRight: -15 }}
        />
      ))}
      {avatars && avatars.length > maxAvatars && (
          <Avatar.Text
            label={`+${avatars.length - maxAvatars}`}
            size={size + 2}
            color={Colors.White}
            style={{ marginRight: -15, backgroundColor: 'rgba(43, 43, 43, 0.5)'}}
          />
      )}
    </View>
  );
};

export default AvatarGroup;

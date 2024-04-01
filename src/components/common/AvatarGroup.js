import React from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-paper';

const AvatarGroup = ({ avatars }) => {
  return (
    avatars && avatars.length > 0 ? 
      <View style={{ flexDirection: 'row' }}>
        {avatars.map((avatar, index) => (
          <Avatar.Image
            key={index}
            source={avatar.photo}
            size={34}
            style={{ marginRight: 10 }}
          />
        ))}
      </View>
    : null
  );
};

export default AvatarGroup;

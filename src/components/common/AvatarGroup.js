import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Avatar } from 'react-native-paper';

const maxAvatars = 5;

const AvatarGroup = ({ avatars, size, type }) => {
  const [showAll, setShowAll] = useState(false);

  const handleShowAll = () => {
    setShowAll(true);
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      {!showAll && avatars ? (
        <>
          {avatars.slice(0, maxAvatars).map((avatar, index) => (
            <Avatar.Image
              key={index}
              source={{ uri: type === 'user' ? avatar.photo : avatar.image }}
              size={size}
              style={{ marginRight: 10 }}
              accessibilityLabel={type === 'user' ? avatar.pseudo : avatar.name}
            />
          ))}
          {avatars.length > maxAvatars && (
            <Pressable onPress={handleShowAll}>
              <Avatar.Text
                label={`+${avatars.length - maxAvatars}`}
                size={size}
                style={{ marginRight: 10 }}
              />
            </Pressable>
          )}
        </>
      ) : avatars && (
          avatars.map((avatar, index) => (
          <Avatar.Image
            key={index}
            source={{ uri:  type === 'user' ? avatar.photo : avatar.image }}
            size={size}
            style={{zIndex: avatars.length - index }}
            accessibilityLabel={type === 'user' ? avatar.pseudo : avatar.name}
          />
        ))
      )}
    </View>
  );
};

export default AvatarGroup;

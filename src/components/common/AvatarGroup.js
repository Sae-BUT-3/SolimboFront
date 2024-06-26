import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import { Colors } from '../../style/color';
import PropTypes from 'prop-types';

const AvatarGroup = ({ avatars, size, type }) => {
  const maxAvatars = Platform.OS === 'web' ? 5 : 3;

  return (
    <View style={styles.container}>
      {avatars && avatars.slice(0, maxAvatars).map((avatar, index) => (
        <Avatar.Image
          key={index}
          source={{ uri: type === 'user' ? avatar?.photo : avatar?.image }}
          size={size}
          style={styles.avatar}
        />
      ))}
      {avatars && avatars.length > maxAvatars && (
        <Avatar.Text
          label={`+${avatars.length - maxAvatars}`}
          size={size + 2}
          color={Colors.White}
          style={styles.extraAvatar}
        />
      )}
    </View>
  );
};

AvatarGroup.propTypes = {
  avatars: PropTypes.arrayOf(
    PropTypes.shape({
      photo: PropTypes.string,
      image: PropTypes.string
    })
  ).isRequired,
  size: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: -15,
  },
  extraAvatar: {
    marginRight: -15,
    backgroundColor: 'rgba(43, 43, 43, 0.5)',
  },
});

export default AvatarGroup;

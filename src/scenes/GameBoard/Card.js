import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const Card = ({ color, hide, isFaceUp, onPress }) => {
  if (hide) {
    return <View style={styles.cardInvisible} />;
  }

  if (isFaceUp) {
    return (
      <TouchableOpacity
        style={{ ...styles.card, backgroundColor: color }}
        onPress={onPress}
        underlayColor="white"
        activeOpacity={0.9}>
        <View />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      underlayColor="white"
      activeOpacity={0.9}>
      <Text style={styles.cardText}>Press To Flip {color}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#333',
    flex: 1,
    aspectRatio: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 12,
    color: 'white',
  },
  cardInvisible: {
    borderWidth: 1,
    borderColor: 'transparent',
    flex: 1,
    aspectRatio: 1,
    margin: 5,
  },
});

export default Card;

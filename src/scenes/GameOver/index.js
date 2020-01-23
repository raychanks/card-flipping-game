import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const NameInput = ({ navigation }) => {
  const playAgain = () => {
    navigation.navigate('GameBoard', { reset: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Game Over</Text>
      <Text style={styles.scoreText}>
        Your Final Score is: {navigation.getParam('score')}
      </Text>
      <Button title="Play Again" onPress={playAgain}>
        Play Again
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    fontSize: 24,
    margin: 20,
  },
  scoreText: {
    margin: 16,
  },
});

export default NameInput;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { retrieveData } from '../../services/storage';

const HighScore = ({ navigation }) => {
  const [highScoreData, setHighScoreData] = useState([]);

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.cell}>
          <Text>Rank</Text>
        </View>
        <View style={styles.cell}>
          <Text>Name</Text>
        </View>
        <View style={styles.cell}>
          <Text>Score</Text>
        </View>
      </View>
    );
  };

  const renderRow = (datum, idx) => {
    return (
      <View key={idx} style={styles.row}>
        <View style={styles.cell}>
          <Text>{idx + 1}</Text>
        </View>
        <View style={styles.cell}>
          <Text>{datum.name}</Text>
        </View>
        <View style={styles.cell}>
          <Text>{datum.score}</Text>
        </View>
      </View>
    );
  };

  const getHighScoreData = () => {
    (async () => {
      const data = await retrieveData('HIGH_SCORE');

      setHighScoreData(data || []);
    })();
  };

  const playAgain = () => {
    navigation.navigate('GameBoard', { reset: true });
  };

  useEffect(getHighScoreData, []);

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        {renderHeader()}

        {highScoreData.map((datum, idx) => {
          return renderRow(datum, idx);
        })}
      </View>
      <View style={styles.playAgainBtn}>
        <Button title="Play Again" onPress={playAgain} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 40,
  },
  table: {
    height: '60%',
  },
  header: {
    height: 40,
    alignSelf: 'stretch',
    flexDirection: 'row',
    backgroundColor: 'skyblue',
  },
  row: { flex: 3, flexDirection: 'row', maxHeight: 50 },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  playAgainBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default HighScore;

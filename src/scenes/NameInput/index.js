import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { storeData } from '../../services/storage';

const NameInput = ({ navigation }) => {
  const [textInput, setTextInput] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const highScoreData = navigation.getParam('highScoreData');
  const score = navigation.getParam('score');

  const handleInputChange = text => {
    const isValid = validateInput(text);

    setErrMsg(isValid ? '' : 'Invalid Name');
    setTextInput(text);
  };

  const handleSubmit = async () => {
    if (validateInput(textInput)) {
      const newHighScoreData = highScoreData
        .concat({ name: textInput.trim(), score })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      await storeData('HIGH_SCORE', newHighScoreData);

      navigation.replace('HighScore');
    }
  };

  const getRank = () => {
    let rank = 1;

    for (const data of highScoreData) {
      if (data.score >= score) {
        rank++;
      }
    }

    return rank;
  };

  const validateInput = input => {
    return !/[^a-z0-9_. ]/i.test(input) && input.trim();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>High Score!</Text>
      <Text style={styles.subHeader}>
        Score: {score}, Rank: {getRank()}
      </Text>
      <View style={styles.body}>
        <Text style={styles.text}>Please Enter Your Name:</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSubmit}
          value={textInput}
        />
        <Text style={styles.errText}>{errMsg}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: {
    marginHorizontal: 40,
    paddingHorizontal: 20,
    flex: 1,
    alignSelf: 'stretch',
  },
  header: {
    marginTop: 40,
    marginBottom: 4,
    fontSize: 24,
  },
  subHeader: {
    marginBottom: 20,
    fontSize: 16,
  },
  text: {
    marginBottom: 10,
    fontSize: 16,
  },
  textInput: { height: 40, borderColor: 'gray', borderWidth: 1 },
  errText: {
    color: 'crimson',
    fontSize: 12,
  },
});

export default NameInput;

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Dimensions } from 'react-native';

import Card from './Card';

import {
  createBoard,
  getBoardAction,
  flipCard,
  removeCard,
  getScoreChange,
  isSameCell,
  isGameOver,
  checkIsHighScore,
} from '../../services/gameService';
import { retrieveData } from '../../services/storage';

const GameBoard = ({ navigation }) => {
  const [gameBoard, setGameBoard] = useState([]);
  const [orientation, setOrientation] = useState('portrait');
  const [selectedCells, setSelectedCells] = useState([]);
  const [flipCount, setFlipCount] = useState(0);
  const [score, setScore] = useState(0);

  const navigateToHighScore = () => {
    navigation.navigate('HighScore');
  };

  const getOrientation = () => {
    if (Dimensions.get('window').width < Dimensions.get('window').height) {
      setOrientation('portrait');
    } else {
      setOrientation('landscape');
    }
  };
  const getBoardRowflexDir = () => ({
    flexDirection: orientation === 'portrait' ? 'row' : 'column',
  });
  const getBoardFlexDir = () => ({
    flexDirection: orientation === 'portrait' ? 'column' : 'row',
  });

  const resetInitState = () => {
    setScore(0);
    setGameBoard(createBoard());
    setSelectedCells([]);
    setFlipCount(0);
  };

  const init = () => {
    const onDimensionsChange = () => getOrientation();

    resetInitState();
    getOrientation();
    navigation.setParams({ navigateToHighScore });
    Dimensions.addEventListener('change', onDimensionsChange);

    return () => Dimensions.removeEventListener('change', onDimensionsChange);
  };

  const handleCardBtnClick = (rowIdx, colIdx) => () => {
    const newCell = { row: rowIdx, col: colIdx };
    let newSelectedCells = [...selectedCells];

    if (flipCount === 2 || isSameCell(newSelectedCells[0], newCell)) {
      return;
    }

    if (newSelectedCells.length < 2) {
      setFlipCount(count => count + 1);
      newSelectedCells.push(newCell);
    } else {
      setFlipCount(1);
      newSelectedCells = [newCell];
    }

    const boardAction = getBoardAction(gameBoard, newSelectedCells);

    setGameBoard(prevBoard =>
      flipCard(prevBoard, boardAction.cardToFlipUp, true),
    );
    setSelectedCells(newSelectedCells);

    setTimeout(() => {
      if (boardAction.cardToRemove.length === 2) {
        setFlipCount(0);
      } else {
        setFlipCount(count => count - boardAction.cardToFlipDown.length);
      }

      setScore(
        prevScore => prevScore + getScoreChange(gameBoard, newSelectedCells),
      );
      setGameBoard(prevBoard =>
        removeCard(prevBoard, boardAction.cardToRemove),
      );
      setGameBoard(prevBoard =>
        flipCard(prevBoard, boardAction.cardToFlipDown, false),
      );
    }, 1000);
  };

  const updateNavParams = () => {
    navigation.setParams({ score });
  };

  const renderBoard = () => {
    return gameBoard.map((row, rowIdx) => {
      return (
        <View key={rowIdx} style={[styles.boardRow, getBoardRowflexDir()]}>
          {row.map((cell, colIdx) => {
            return (
              <Card
                key={colIdx}
                color={cell.color}
                hide={cell.isRemoved}
                isFaceUp={cell.isSelected}
                onPress={handleCardBtnClick(rowIdx, colIdx)}
              />
            );
          })}
        </View>
      );
    });
  };

  useEffect(init, []);
  useEffect(updateNavParams, [score]);
  useEffect(() => {
    (async () => {
      if (isGameOver(gameBoard)) {
        const highScoreData = (await retrieveData('HIGH_SCORE')) || [];
        const isHighScore = checkIsHighScore(highScoreData, score);

        if (isHighScore) {
          navigation.replace('NameInput', { highScoreData, score });
        } else {
          navigation.replace('GameOver', { score });
        }
      }
    })();
  }, [gameBoard, score, navigation]);
  useEffect(() => {
    if (navigation.getParam('reset')) {
      navigation.setParams({ reset: false });
      resetInitState();
    }
  }, [navigation]);

  return <View style={[styles.board, getBoardFlexDir()]}>{renderBoard()}</View>;
};

GameBoard.navigationOptions = ({ navigation }) => ({
  headerLeft: () => <Text style={styles.headerLeft}>Colour Memory</Text>,
  headerLeftContainerStyle: {
    marginLeft: 16,
  },
  headerRight: () => (
    <Button
      onPress={navigation.getParam('navigateToHighScore')}
      title="High Score"
    />
  ),
  headerRightContainerStyle: {
    marginRight: 16,
  },
  headerTitle: () => (
    <View style={styles.headerScore}>
      <Text>Score:</Text>
      <Text>{navigation.getParam('score')}</Text>
    </View>
  ),
  headerTitleAlign: 'center',
});

const styles = StyleSheet.create({
  headerLeft: {
    fontSize: 20,
  },
  headerScore: {
    alignItems: 'center',
  },
  board: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardRow: {
    flexDirection: 'row',
  },
});

export default GameBoard;

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import GameBoard from './scenes/GameBoard';
import HighScore from './scenes/HighScore';
import NameInput from './scenes/NameInput';
import GameOver from './scenes/GameOver';

const AppNavigator = createStackNavigator(
  {
    GameBoard,
    HighScore,
    NameInput,
    GameOver,
  },
  {
    initialRouteName: 'GameBoard',
  },
);

export default createAppContainer(AppNavigator);

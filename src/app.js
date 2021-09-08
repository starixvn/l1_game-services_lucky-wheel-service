import appConfigs from './app-configs';
import gameSettings from './game-settings';
import { generateResult } from './helpers/result-helper';
import GameDefinition from './game-definition';
import GameData from './game-data';
import BaseGameApp from 'sc-game-base/src/core/base-game-app';
import GameContainerRegistry from './game-container-registry';
import GameStartup from './game-startup';

export const run = async () => {
  const definition = new GameDefinition(gameSettings, generateResult);
  const gameData = new GameData();
  const container = new GameContainerRegistry().register(
    appConfigs,
    definition,
    gameData
  );

  const gameStartup = new GameStartup(container);
  const app = new BaseGameApp(container, gameStartup);

  await app.run();
};

run();

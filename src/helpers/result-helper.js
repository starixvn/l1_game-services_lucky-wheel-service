import Chance from 'chance';
import gameSettings from '../game-settings';

export const generateResult = () => {
  const chance = new Chance();

  return chance.integer({ min: 0, max: gameSettings.choices.length - 1 });
};

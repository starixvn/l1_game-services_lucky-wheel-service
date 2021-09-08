import GameStartup from '../game-startup';
import { Core } from 'sc-game-base';

describe('game-startup', () => {
  describe('extends', () => {
    it('inherit Core.BaseStartup', () => {
      // arrange
      const container = { resolve: jest.fn() };

      // act
      const gameStartup = new GameStartup(container);

      //assert
      expect(gameStartup instanceof Core.BaseStartup);
    });
  });
});

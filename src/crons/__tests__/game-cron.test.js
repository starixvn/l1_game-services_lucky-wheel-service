import GameCron from '../game-cron';

describe('game-cron', () => {
  describe('start', () => {
    it('should start successfully', async () => {
      //arrange
      const cron = new GameCron();

      // assert
      expect(async () => await cron.start()).not.toThrow();
    });
  });
});

import GameDefinition from '../game-definition';
describe('game-settings', () => {
  describe('constructor', () => {
    const testCases = [
      { configs: {}, expectedConfigName: '' },
      {
        configs: {
          name: 'LuckyWheel',
          choices: [],
          numberOfRoundHistory: 100,
          historyPageSize: 8,
        },
        expectedConfigName: 'luckywheel',
      },
    ];

    it.each(testCases)('configName should be in lowercase', (testCase) => {
      // act
      const gameDefinition = new GameDefinition(testCase.configs);

      //assert
      expect(gameDefinition.configName).toStrictEqual(
        testCase.expectedConfigName
      );
    });
  });
});

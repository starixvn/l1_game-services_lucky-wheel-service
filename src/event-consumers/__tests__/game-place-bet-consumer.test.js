import GamePlaceBetConsumer from '../game-place-bet-consumer';

describe('game-place-bet-consumer', () => {
  describe('validateBetRequest', () => {
    const testCases = [
      { session: null, expectedValue: false },
      { session: 'player-session', expectedValue: true },
    ];

    it.each(testCases)('should base on player.session', (testCase) => {
      // arrange
      const consumer = new GamePlaceBetConsumer();
      const player = { session: testCase.session };

      // act
      const actualValue = consumer.validateBetRequest(player);

      //assert
      expect(actualValue).toStrictEqual(testCase.expectedValue);
    });
  });

  describe('consume', () => {
    it('when player not have session should not add player to ingame array', () => {
      // arrange
      const gameData = { ingame: {} };
      const consumer = new GamePlaceBetConsumer(null, gameData);
      const player = { session: null };

      // act
      consumer.consume(player);

      //assert
      expect(consumer.gameData.ingame).toStrictEqual({});
    });

    it('when player have session and not in game yet should add player and bet info', () => {
      // arrange
      const gameData = { ingame: {} };
      const consumer = new GamePlaceBetConsumer(null, gameData);
      const player = {
        session: { memberId: 1 },
        profile: { name: 'PlayerName' },
      };

      const expectedValue = {
        PlayerName: {
          name: 'PlayerName',
          betQueue: [{ player, payload: 1 }],
        },
      };

      // act
      consumer.consume(player);

      //assert
      expect(consumer.gameData.ingame).toStrictEqual(expectedValue);
    });

    it('when player have session and already in game should add bet info to ingame', () => {
      // arrange
      const gameData = {
        ingame: {
          PlayerName: {
            name: 'PlayerName',
            betQueue: [],
          },
        },
      };
      const consumer = new GamePlaceBetConsumer(null, gameData);
      const player = {
        session: { memberId: 1 },
        profile: { name: 'PlayerName' },
      };

      const expectedValue = {
        PlayerName: {
          name: 'PlayerName',
          betQueue: [{ player, payload: 1 }],
        },
      };

      // act
      consumer.consume(player);

      //assert
      expect(consumer.gameData.ingame).toStrictEqual(expectedValue);
    });
  });
});

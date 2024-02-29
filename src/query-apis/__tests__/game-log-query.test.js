import GameLogQuery from '../game-log-query';
import mongoose from 'mongoose';
import { stubMongooseModelStupidly } from 'jest-micro-auto-stub';

describe('game-log-query', () => {
  describe('queryLogs', () => {
    it('when player not have session should return nothing', async () => {
      // arrange
      const player = {};
      const gameLogQuery = new GameLogQuery();

      // act
      const actualValue = await gameLogQuery.queryLogs(player);

      //assert
      expect(actualValue).toStrictEqual({});
    });

    it('when not find user info should return nothing', async () => {
      // arrange
      const player = { UID: 1, session: {} };
      const userInfosRepository = stubMongooseModelStupidly(mongoose.Model);
      userInfosRepository.findOne().lean().exec.mockReturnValueOnce(null);
      const gameLogQuery = new GameLogQuery(null, userInfosRepository);

      // act
      const actualValue = await gameLogQuery.queryLogs(player);

      //assert
      expect(actualValue).toStrictEqual({});
    });

    it('when user not have spins should log with zero totalCoins and availSpins', async () => {
      // arrange
      const player = { UID: 1, session: {} };
      const userInfosRepository = stubMongooseModelStupidly(mongoose.Model);
      userInfosRepository.findOne().lean().exec.mockReturnValueOnce({ id: 1 });

      const gameConfigsRepository = stubMongooseModelStupidly(mongoose.Model);
      gameConfigsRepository.findOne().lean().exec.mockReturnValueOnce({});

      const roundsRepository = stubMongooseModelStupidly(mongoose.Model);
      roundsRepository.findOne().lean().exec.mockReturnValueOnce(null);

      const definition = { choices: [] };
      const gameLogQuery = new GameLogQuery(
        roundsRepository,
        userInfosRepository,
        gameConfigsRepository,
        definition
      );

      const expectedValue = {
        choices: [],
        um: true,
        um_message: undefined,
        totalCoins: 0,
        availSpins: 0,
      };

      // act
      const actualValue = await gameLogQuery.queryLogs(player);

      //assert
      expect(actualValue).toStrictEqual(expectedValue);
    });

    const testCases = [
      { config: null },
      { config: { enabled: false, disabled_message: '' } },
    ];
    it.each(testCases)(
      'when user have spins should return correct logs',
      async (testCase) => {
        // arrange
        const player = { UID: 1, session: {} };
        const userInfosRepository = stubMongooseModelStupidly(mongoose.Model);
        userInfosRepository
          .findOne()
          .lean()
          .exec.mockReturnValueOnce({ id: 1, scoins: 10 });

        const gameConfigsRepository = stubMongooseModelStupidly(mongoose.Model);
        gameConfigsRepository
          .findOne()
          .lean()
          .exec.mockReturnValueOnce(testCase.config);

        const roundsRepository = stubMongooseModelStupidly(mongoose.Model);
        roundsRepository
          .findOne()
          .lean()
          .exec.mockReturnValueOnce({ availSpins: 3 });

        const definition = { choices: [] };
        const gameLogQuery = new GameLogQuery(
          roundsRepository,
          userInfosRepository,
          gameConfigsRepository,
          definition
        );

        const expectedValue = {
          choices: [],
          um: true,
          um_message: '',
          totalCoins: 10,
          availSpins: 3,
        };

        // act
        const actualValue = await gameLogQuery.queryLogs(player);

        //assert
        expect(actualValue).toStrictEqual(expectedValue);
      }
    );
  });
});

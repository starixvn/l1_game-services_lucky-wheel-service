import GameHistoryQuery from '../game-history-query';
import mongoose from 'mongoose';
import { stubMongooseModelStupidly } from 'jest-micro-auto-stub';

describe('game-history-query', () => {
  describe('queryHistory', () => {
    it('when page < 1 should return empty', async () => {
      // arrange
      const gameHistoryQuery = new GameHistoryQuery();
      const page = 0;

      // act
      const actualValue = await gameHistoryQuery.queryHistory(null, page);

      //assert
      expect(actualValue).toStrictEqual({});
    });

    it('when not have player should return empty', async () => {
      // arrange
      const gameHistoryQuery = new GameHistoryQuery();
      const player = null;
      const page = 2;

      // act
      const actualValue = await gameHistoryQuery.queryHistory(player, page);

      //assert
      expect(actualValue).toStrictEqual({});
    });

    it('when have player and pageSize >=1 should correct value', async () => {
      // arrange
      const betsRepository = {
        countDocuments: () => {
          return { exec: () => 3 };
        },
        find: () => {
          return {
            lean: () => {
              return { exec: () => [] };
            },
          };
        },
      };

      const gameHistoryQuery = new GameHistoryQuery(betsRepository); 
      const player = {};
      const page = 2;
      const pageSize = 8;

      // act
      const actualValue = await gameHistoryQuery.queryHistory(
        player,
        page,
        pageSize
      );

      //assert
      expect(actualValue).toStrictEqual({
        history: { betLogs: [], page: 2, pageSize: 8, total: 3 },
      });
    });
  });
});

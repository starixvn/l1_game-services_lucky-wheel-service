import GameSettleRoundConsumer from '../game-settle-round-consumer';
import mongoose from 'mongoose';
import { stubMongooseModelStupidly } from 'jest-micro-auto-stub';

describe('game-settle-round-consumer', () => {
  describe('settle', () => {
    it('should reduce availSpins and add usedSpins', async () => {
      // arrange
      const roundsRepository = stubMongooseModelStupidly(mongoose.Model);
      const userInfosRepository = stubMongooseModelStupidly(mongoose.Model);
      const consumer = new GameSettleRoundConsumer({
        roundsRepository,
        userInfosRepository,
      });

      const memberId = 1;
      const coins = 10;
      const payload = 1;

      // act
      await consumer.settle(memberId, payload, coins);

      //assert
      expect(roundsRepository.updateOne).toBeCalledWith(
        { playerId: 1 },
        { $inc: { availSpins: -1, usedSpins: 1 } }
      );
    });

    it('should add coins to userinfo', async () => {
      // arrange
      const roundsRepository = stubMongooseModelStupidly(mongoose.Model);
      const userInfosRepository = stubMongooseModelStupidly(mongoose.Model);
      const consumer = new GameSettleRoundConsumer({
        roundsRepository,
        userInfosRepository,
      });

      const memberId = 1;
      const coins = 10;
      const payload = 1;

      // act
      await consumer.settle(memberId, payload, coins);

      //assert
      expect(userInfosRepository.updateOne).toBeCalledWith(
        { id: 1 },
        { $inc: { scoins: 10 } }
      );
    });
  });
});

import GameProcessBetQueue from '../game-process-bet-queue';
import { Core } from 'sc-game-base';
import mongoose from 'mongoose';
import { stubMongooseModelStupidly } from 'jest-micro-auto-stub';

describe('game-process-bet-queue', () => {
  describe('extends', () => {
    it('inherit Core.Crons.ProcessBetQueue', () => {
      // arrange
      const processBetQueue = new GameProcessBetQueue({});

      //assert
      expect(processBetQueue instanceof Core.Crons.ProcessBetQueue);
    });
  });

  describe('proceedBet', () => {
    it('when bet is not valid should not call handleSuccessBet', async () => {
      // arrange
      const gameConfigsRepository = stubMongooseModelStupidly(mongoose.Model);
      gameConfigsRepository
        .findOne()
        .lean()
        .exec.mockReturnValueOnce({ enabled: true });

      const roundsRepository = stubMongooseModelStupidly(mongoose.Model);
      roundsRepository
        .findOne()
        .lean()
        .exec.mockReturnValueOnce({ availSpins: 0 });

      const definition = {};
      const processBetQueue = new GameProcessBetQueue({
        definition,
        roundsRepository,
        gameConfigsRepository,
      });

      spyOn(processBetQueue, 'handleSuccessBet');
      spyOn(processBetQueue, 'handleFailedBet');

      // act
      await processBetQueue.proceedBet();

      //assert
      expect(processBetQueue.handleSuccessBet).not.toBeCalled();
    });

    it('when bet is valid should call handleSuccessBet', async () => {
      // arrange
      const gameConfigsRepository = stubMongooseModelStupidly(mongoose.Model);
      gameConfigsRepository
        .findOne()
        .lean()
        .exec.mockReturnValueOnce({ enabled: true });

      const roundsRepository = stubMongooseModelStupidly(mongoose.Model);
      roundsRepository
        .findOne()
        .lean()
        .exec.mockReturnValueOnce({ availSpins: 10 });

      const definition = {};
      const processBetQueue = new GameProcessBetQueue({
        definition,
        roundsRepository,
        gameConfigsRepository,
      });

      spyOn(processBetQueue, 'handleSuccessBet');
      spyOn(processBetQueue, 'handleFailedBet');

      // act
      await processBetQueue.proceedBet();

      //assert
      expect(processBetQueue.handleSuccessBet).toBeCalled();
    });
  });

  describe('composeValidationCriteria', () => {
    let testCases = [
      { userSpin: null, expectedFailure: true },
      { userSpin: { availSpins: 0 }, expectedFailure: true },
      { userSpin: { availSpins: 1 }, expectedFailure: false },
    ];

    it.each(testCases)('should check availSpins', async (testCase) => {
      // arrange
      const gameConfigsRepository = stubMongooseModelStupidly(mongoose.Model);
      gameConfigsRepository
        .findOne()
        .lean()
        .exec.mockReturnValueOnce({ enabled: true });

      const roundsRepository = stubMongooseModelStupidly(mongoose.Model);
      roundsRepository
        .findOne()
        .lean()
        .exec.mockReturnValueOnce(testCase.userSpin);

      const definition = {};
      const processBetQueue = new GameProcessBetQueue({
        definition,
        roundsRepository,
        gameConfigsRepository,
      });

      const expectedValue = {
        failure: testCase.expectedFailure,
        notice: { message: { errorCode: 'SB1934' } },
      };

      // act
      const actualValue = await processBetQueue.composeValidationCriteria();

      //assert
      expect(actualValue[0]).toStrictEqual(expectedValue);
    });

    testCases = [
      {
        config: null,
        expectedFailure: true,
        expectedUM: true,
        expectedMessage: ["disabled"],
      },
      {
        config: { enabled: false },
        expectedFailure: true,
        expectedUM: true,
        expectedMessage: ["disabled"],
      },
      {
        config: { enabled: true },
        expectedFailure: false,
        expectedUM: false,
        expectedMessage: [],
      },
    ];

    it.each(testCases)('should check enabled status', async (testCase) => {
      // arrange
      const gameConfigsRepository = stubMongooseModelStupidly(mongoose.Model);
      gameConfigsRepository
        .findOne()
        .lean()
        .exec.mockReturnValueOnce(testCase.config);

      const roundsRepository = stubMongooseModelStupidly(mongoose.Model);
      roundsRepository
        .findOne()
        .lean()
        .exec.mockReturnValueOnce({ availSpins: 1 });

      const notificationRepository = stubMongooseModelStupidly(mongoose.Model);
      notificationRepository
        .findOne()
        .lean()
        .exec.mockReturnValueOnce({ messages: ["disabled"] });

      const definition = {};
      const processBetQueue = new GameProcessBetQueue({
        definition,
        roundsRepository,
        gameConfigsRepository,
        notificationRepository,
      });

      const expectedValue = {
        failure: testCase.expectedFailure,
        notice: { um: testCase.expectedUM, message: testCase.expectedMessage },
        um: testCase.expectedUM,
      };

      // act
      const actualValue = await processBetQueue.composeValidationCriteria();

      //assert
      expect(actualValue[1]).toStrictEqual(expectedValue);
    });
  });

  describe('handleFailedBet', () => {
    const testCases = [
      {
        notice: { um: true, message: 'um' },
        expectedPayload: { um: true, um_message: 'um' },
      },
      {
        notice: { um: false, message: '' },
        expectedPayload: { notice: '', endBet: -1 },
      },
    ];

    it.each(testCases)(
      'should publishGameFailedBet with correct payload',
      (testCase) => {
        // arrange
        const placeBetPublisher = { publishGameFailedBet: jest.fn() };
        const processBetQueue = new GameProcessBetQueue({
          placeBetPublisher,
        });

        const notice = testCase.notice;
        const player = {};

        // act
        processBetQueue.handleFailedBet(player, notice);

        //assert
        expect(
          processBetQueue.placeBetPublisher.publishGameFailedBet
        ).toHaveBeenCalledWith(
          undefined,
          expect.objectContaining(testCase.expectedPayload)
        );
      }
    );
  });

  describe('handleSuccessBet', () => {
    const testCases = [{ user: null }, { user: { id: 1 } }];
    it.each(testCases)(
      'should insertRound and notifyPlacingBetResult',
      async (testCase) => {
        // arrange
        const definition = { generateResult: jest.fn(), choices: [] };

        const roundsRepository = stubMongooseModelStupidly(mongoose.Model);
        roundsRepository
          .findOne()
          .lean()
          .exec.mockReturnValueOnce({ availSpins: 6 });

        const userInfosRepository = stubMongooseModelStupidly(mongoose.Model);
        userInfosRepository
          .findOne()
          .lean()
          .exec.mockReturnValueOnce(testCase.user);

        const settleGameRoundConsumer = { settle: jest.fn() };
        const processBetQueue = new GameProcessBetQueue({
          definition,
          roundsRepository,
          userInfosRepository,
          settleGameRoundConsumer,
        });
        spyOn(processBetQueue, 'insertRound');
        spyOn(processBetQueue, 'notifyPlacingBetResult');

        const player = {};
        const payload = {};

        // act
        await processBetQueue.handleSuccessBet(player, payload);

        //assert
        expect(processBetQueue.insertRound).toBeCalled();
        expect(settleGameRoundConsumer.settle).toBeCalled();
        expect(processBetQueue.notifyPlacingBetResult).toBeCalled();
      }
    );
  });

  describe('notifyPlacingBetResult', () => {
    it('should call placeBetPublisher.publishSuccessBet', () => {
      // arrange
      const placeBetPublisher = { publishSuccessBet: jest.fn() };
      const processBetQueue = new GameProcessBetQueue({ placeBetPublisher });

      const player = {};
      const status = {};

      // act
      processBetQueue.notifyPlacingBetResult(player, status);

      //assert
      expect(processBetQueue.placeBetPublisher.publishSuccessBet).toBeCalled();
    });
  });

  describe('insertRound', () => {
    const testCases = [
      { player: { session: null, profile: null } },
      { player: { session: {}, profile: {} } },
    ];
    it.each(testCases)(
      'should call spinResultsRepository.create',
      async (testCase) => {
        // arrange
        const betsRepository = { create: jest.fn() };
        const processBetQueue = new GameProcessBetQueue({
          betsRepository,
        });

        const status = {};

        // act
        await processBetQueue.insertRound(testCase.player, status);

        //assert
        expect(processBetQueue.spinResultsRepository.create).toBeCalled();
      }
    );
  });
});

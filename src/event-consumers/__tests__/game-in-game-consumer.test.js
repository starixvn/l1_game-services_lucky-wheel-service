import GameInGameConsumer from '../game-in-game-consumer';
import mongoose from 'mongoose';
import { stubMongooseModelStupidly } from 'jest-micro-auto-stub';

describe('game-in-game-consumer', () => {
    const definition = { choices: [] };
    const publisher = { publishToUser: jest.fn() };
    const gameConfigsRepository = stubMongooseModelStupidly(mongoose.Model);
    const roundsRepository = stubMongooseModelStupidly(mongoose.Model);
    const userInfosRepository = stubMongooseModelStupidly(mongoose.Model);
    const notificationRepository = stubMongooseModelStupidly(mongoose.Model);

    describe('consume', () => {
        it('should return definition.choices', async () => {
            // arrange
            const consumer = new GameInGameConsumer(definition, publisher, gameConfigsRepository, roundsRepository, userInfosRepository);
            jest.spyOn(consumer, 'getUMStatus').mockReturnValueOnce(false);
            jest.spyOn(consumer, 'getPlayerAvailableSpins').mockReturnValueOnce(1);
            jest.spyOn(consumer, 'getPlayerScoins').mockReturnValueOnce(10);

            const player = { UID: 1 };
            const expectedPayload = {
                um: false,
                um_message: '',
                availSpins: 1,
                scoins: 10,
                choices: definition.choices,
            };

            // act
            await consumer.consume(player);

            //assert
            expect(publisher.publishToUser).toHaveBeenCalledWith(1, expect.objectContaining(expectedPayload));
        });

        it('when um should return um message', async () => {
            // arrange
            const consumer = new GameInGameConsumer(definition, publisher, gameConfigsRepository, roundsRepository, userInfosRepository);
            jest.spyOn(consumer, 'getUMStatus').mockReturnValueOnce(true);
            jest.spyOn(consumer, 'getUMMessages').mockReturnValueOnce('UM Message');
            jest.spyOn(consumer, 'getPlayerAvailableSpins').mockReturnValueOnce(1);
            jest.spyOn(consumer, 'getPlayerScoins').mockReturnValueOnce(10);

            const player = { UID: 1 };
            const expectedPayload = {
                um: true,
                um_message: 'UM Message',
                availSpins: 1,
                scoins: 10,
                choices: definition.choices,
            };

            // act
            await consumer.consume(player);

            //assert
            expect(publisher.publishToUser).toHaveBeenCalledWith(1, expect.objectContaining(expectedPayload));
        });
    });

    describe('getUMStatus', () => {
        it('when not have config should return disabled', async () => {
            // arrange
            gameConfigsRepository.findOne().lean().exec.mockReturnValueOnce(null);
            const consumer = new GameInGameConsumer(definition, publisher, gameConfigsRepository, roundsRepository, userInfosRepository);

            // act
            const actualValue = await consumer.getUMStatus();

            //assert
            expect(actualValue).toBeTruthy();
        });

        it('when config disabled should return disabled', async () => {
            // arrange
            gameConfigsRepository.findOne().lean().exec.mockReturnValueOnce({ enabled: false });
            const consumer = new GameInGameConsumer(definition, publisher, gameConfigsRepository, roundsRepository, userInfosRepository);

            // act
            const actualValue = await consumer.getUMStatus();

            //assert
            expect(actualValue).toBeTruthy();
        });

        it('when config enabled should return enabled', async () => {
            // arrange
            gameConfigsRepository.findOne().lean().exec.mockReturnValueOnce({ enabled: true });
            const consumer = new GameInGameConsumer(definition, publisher, gameConfigsRepository, roundsRepository, userInfosRepository);

            // act
            const actualValue = await consumer.getUMStatus();

            //assert
            expect(actualValue).toBeFalse();
        });
    });

    describe('getUMMessages', () => {
        it('when not have message should return empty', async () => {
            // arrange
            notificationRepository.findOne().lean().exec.mockReturnValueOnce(null);
            const consumer = new GameInGameConsumer(
                definition,
                publisher,
                gameConfigsRepository,
                roundsRepository,
                userInfosRepository,
                notificationRepository
            );

            // act
            const actualValue = await consumer.getUMMessages();

            //assert
            expect(actualValue).toStrictEqual({});
        });

        it('when have messages should return messages', async () => {
            // arrange
            notificationRepository
                .findOne()
                .lean()
                .exec.mockReturnValueOnce({ messages: { en: 'UM' } });
            const consumer = new GameInGameConsumer(
                definition,
                publisher,
                gameConfigsRepository,
                roundsRepository,
                userInfosRepository,
                notificationRepository
            );
            const expectedValue = { en: 'UM' };

            // act
            const actualValue = await consumer.getUMMessages();

            //assert
            expect(actualValue).toStrictEqual(expectedValue);
        });
    });

    describe('getPlayerAvailableSpins', () => {
        it('when not have data should return 0', async () => {
            // arrange
            roundsRepository.findOne().lean().exec.mockReturnValueOnce(null);
            const consumer = new GameInGameConsumer(definition, publisher, gameConfigsRepository, roundsRepository, userInfosRepository);
            const player = {};
            const expectedSpins = 0;

            // act
            const actualValue = await consumer.getPlayerAvailableSpins(player);

            //assert
            expect(actualValue).toBe(expectedSpins);
        });

        it('when have data should return correct info', async () => {
            // arrange
            roundsRepository.findOne().lean().exec.mockReturnValueOnce({ availSpins: 1 });
            const consumer = new GameInGameConsumer(definition, publisher, gameConfigsRepository, roundsRepository, userInfosRepository);
            const player = {};
            const expectedSpins = 1;

            // act
            const actualValue = await consumer.getPlayerAvailableSpins(player);

            //assert
            expect(actualValue).toBe(expectedSpins);
        });
    });

    describe('getPlayerScoins', () => {
        it('when not have data should return 0', async () => {
            // arrange
            userInfosRepository.findOne().lean().exec.mockReturnValueOnce(null);
            const consumer = new GameInGameConsumer(definition, publisher, gameConfigsRepository, roundsRepository, userInfosRepository);
            const player = {};
            const expectedSpins = 0;

            // act
            const actualValue = await consumer.getPlayerScoins(player);

            //assert
            expect(actualValue).toBe(expectedSpins);
        });

        it('when have data should return correct info', async () => {
            // arrange
            userInfosRepository.findOne().lean().exec.mockReturnValueOnce({ scoins: 1 });
            const consumer = new GameInGameConsumer(definition, publisher, gameConfigsRepository, roundsRepository, userInfosRepository);
            const player = {};
            const expectedSpins = 1;

            // act
            const actualValue = await consumer.getPlayerScoins(player);

            //assert
            expect(actualValue).toBe(expectedSpins);
        });
    });
});

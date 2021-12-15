import GameContainerRegistry from '../game-container-registry';
import { Core } from 'sc-game-base';
import { InjectionMode } from 'awilix';

jest.mock(
    'awilix',
    () => {
        return {
            asClass: (t) => {
                return {
                    proxy: () => t,
                    singleton: () => {
                        return { proxy: jest.fn(() => t) };
                    },
                };
            },
            asValue: jest.fn((t) => t),
            InjectionMode: jest.fn(() => {}),
            createContainer: jest.fn(() => {}),
        };
    },
    { virtual: true }
);

describe('game-container-registry', () => {
    // arrange
    const defaultInjectionMode = InjectionMode.CLASSIC;

    describe('extends', () => {
        it('inherit Core.ContainerRegistry', () => {
            // arrange
            const containerRegistry = new GameContainerRegistry();

            //assert
            expect(containerRegistry instanceof Core.ContainerRegistry);
        });
    });

    describe('registerModels', () => {
        it('should register correct Models', () => {
            // arrange
            const containerRegistry = new GameContainerRegistry(defaultInjectionMode);
            containerRegistry.container = { register: jest.fn() };

            // act
            containerRegistry.registerModels();

            //assert
            expect(containerRegistry.container.register).toBeCalledWith({
                roundsRepository: expect.any(Function),
                betsRepository: expect.any(Function),
            });
        });
    });

    describe('registerCrons', () => {
        it('should register correct Crons', () => {
            // arrange
            const containerRegistry = new GameContainerRegistry(defaultInjectionMode);
            containerRegistry.container = { register: jest.fn() };

            // act
            containerRegistry.registerCrons();

            //assert
            expect(containerRegistry.container.register).toBeCalledWith({
                processBetQueue: expect.any(Function),
            });
        });
    });

    describe('registerConsumers', () => {
        it('should register correct Consumers', () => {
            // arrange
            const containerRegistry = new GameContainerRegistry(defaultInjectionMode);
            containerRegistry.container = { register: jest.fn() };

            // act
            containerRegistry.registerConsumers();

            //assert
            expect(containerRegistry.container.register).toBeCalledWith({
                inGameConsumer: expect.any(Object),
                placeBetConsumer: expect.any(Object),
                settleGameRoundConsumer: expect.any(Function),
            });
        });
    });

    describe('registerApis', () => {
        it('should register correct query apis', () => {
            // arrange
            const containerRegistry = new GameContainerRegistry(defaultInjectionMode);
            containerRegistry.container = { register: jest.fn() };

            // act
            containerRegistry.registerApis();

            //assert
            expect(containerRegistry.container.register).toBeCalledWith({
                historyQuery: expect.any(Object),
                logQuery: expect.any(Object),
            });
        });
    });

    describe('registerRouters', () => {
        it('should register correct query routers', () => {
            // arrange
            const containerRegistry = new GameContainerRegistry(defaultInjectionMode);
            containerRegistry.container = { register: jest.fn() };

            // act
            containerRegistry.registerRouters();

            //assert
            expect(containerRegistry.container.register).toBeCalledWith({
                socketRouter: expect.any(Function),
            });
        });
    });
});

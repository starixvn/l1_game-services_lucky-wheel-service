import GameSocketRouter from '../game-socket-router';
import { Core } from 'sc-game-base';

describe('game-socket-router', () => {
  describe('extends', () => {
    it('inherit Core.Routers.BaseSocketRouter', () => {
      // act
      const gameSocketRouter = new GameSocketRouter({});

      //assert
      expect(gameSocketRouter instanceof Core.Routers.BaseSocketRouter);
    });
  });

  describe('init', () => {
    it('should register correct events', () => {
      // arrange
      const gameSocketRouter = new GameSocketRouter({});
      const socketClient = { on: jest.fn() };

      // act
      gameSocketRouter.init(socketClient);

      //assert
      expect(socketClient.on).toBeCalledWith('playSpin', expect.any(Function));
      expect(socketClient.on).toBeCalledWith(
        'getHistory',
        expect.any(Function)
      );
      expect(socketClient.on).toBeCalledWith('getLogs', expect.any(Function));
    });
  });

  describe('handleGetLogs', () => {
    it('when not allow get logs should not emit event to return logs', async () => {
      // arrange
      const gameData = {
        realPlayers: { 1: { session: { siteName: 'ind' } } },
        gameConfigs: { siteExclusions: ['ind'] },
      };
      const logQuery = { queryLogs: () => [{ id: 1 }] };
      const definition = { name: 'LuckyWheel' };
      const userSignInPublisher = {
        publishNotPermittedToPlayMessage: jest.fn(),
      };
      const gameSocketRouter = new GameSocketRouter({
        definition,
        gameData,
        logQuery,
        userSignInPublisher,
      });

      const socketClient = { id: 1, on: jest.fn(), emit: jest.fn() };
      gameSocketRouter.init(socketClient);

      // act
      await gameSocketRouter.handleGetLogs();

      //assert
      expect(socketClient.emit).not.toBeCalled();
    });

    it('when query logs has error should log error', async () => {
      // arrange
      const gameData = {};
      const logService = { logError: jest.fn() };
      const logQuery = {
        queryLogs: () => {
          throw new Error();
        },
      };

      const gameSocketRouter = new GameSocketRouter({
        gameData,
        logQuery,
        logService,
      });

      const socketClient = { on: jest.fn() };
      gameSocketRouter.init(socketClient);

      // act
      await gameSocketRouter.handleGetLogs();

      //assert
      expect(logService.logError).toBeCalled();
    });

    it('when not have error should emit event to return logs', async () => {
      // arrange
      const gameData = { realPlayers: { 1: {} }, gameConfigs: {} };
      const logQuery = { queryLogs: () => [{ id: 1 }] };
      const definition = { name: 'LuckyWheel' };
      const gameSocketRouter = new GameSocketRouter({
        definition,
        gameData,
        logQuery,
      });

      const socketClient = { id: 1, on: jest.fn(), emit: jest.fn() };
      gameSocketRouter.init(socketClient);

      // act
      await gameSocketRouter.handleGetLogs();

      //assert
      expect(socketClient.emit).toBeCalledWith(
        'LuckyWheel',
        expect.objectContaining([{ id: 1 }])
      );
    });
  });
});

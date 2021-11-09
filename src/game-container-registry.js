import awilix from 'awilix';
const { asClass, asValue } = awilix;
import { Core } from 'sc-game-base';
import { GameCron, GameProcessBetQueue } from './crons';
import { Spins, SpinResults } from './models';
import { GameHistoryQuery, GameLogQuery } from './query-apis';
import GameSocketRouter from './routers/game-socket-router';
import {
  GamePlaceBetConsumer,
  GameSettleRoundConsumer,
  GameInGameConsumer,
} from './event-consumers';

export default class GameContainerRegistry extends Core.ContainerRegistry {
  registerModels() {
    super.registerModels();

    this.container.register({
      roundsRepository: asValue(Spins),
      betsRepository: asValue(SpinResults),
    });
  }

  registerCrons() {
    this.container.register({
      gameCron: asClass(GameCron).singleton().proxy(),
      processBetQueue: asClass(GameProcessBetQueue).singleton().proxy(),
    });
  }

  registerConsumers() {
    super.registerConsumers();
    this.container.register({
      inGameConsumer: asClass(GameInGameConsumer).singleton(),
      placeBetConsumer: asClass(GamePlaceBetConsumer).singleton(),
      settleGameRoundConsumer: asClass(GameSettleRoundConsumer)
        .singleton()
        .proxy(),
    });
  }

  registerApis() {
    super.registerApis();
    this.container.register({
      historyQuery: asClass(GameHistoryQuery).singleton(),
      logQuery: asClass(GameLogQuery).singleton(),
    });
  }

  registerRouters() {
    this.container.register({
      socketRouter: asClass(GameSocketRouter).proxy(),
    });
  }
}

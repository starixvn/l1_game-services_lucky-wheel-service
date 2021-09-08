import { Core } from 'sc-game-base';
export default class GameSocketRouter extends Core.Routers.BaseSocketRouter {
  constructor(params) {
    super(params);
    this.logQuery = params.logQuery;
  }

  init(socketClient) {
    this.socketClient = socketClient;
    super.init(socketClient);
    this.socketClient.on('playSpin', this.handlePlaceBet.bind(this));
    this.socketClient.on('getLogs', this.handleGetLogs.bind(this));
  }

  async handleGetLogs() {
    try {
      if (!this.verify()) {
        return;
      }

      const player = this.gameData.realPlayers[this.socketClient.id];
      const logs = await this.logQuery.queryLogs(player);
      this.socketClient.emit(this.definition.name, logs);
    } catch (error) {
      this.logService.logError(error);
    }
  }
}

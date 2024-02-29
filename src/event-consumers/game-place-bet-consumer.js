export default class GamePlaceBetConsumer {
  constructor(definition, gameData, publisher) {
    this.definition = definition;
    this.gameData = gameData;
    this.publisher = publisher;
  }

  validateBetRequest(player) {
    return !!player.session;
  }

  consume(player) {
    if (!this.validateBetRequest(player)) {
      return;
    }

    const name = player.profile.name;

    if (!this.gameData.ingame[name]) {
      const newPlayer = {
        name: player.profile.name,
        betQueue: [],
      };

      this.gameData.ingame[name] = newPlayer;
    }

    this.gameData.ingame[name].betQueue.push({
      player,
      payload: player.session.playerId,
    });
  }
}

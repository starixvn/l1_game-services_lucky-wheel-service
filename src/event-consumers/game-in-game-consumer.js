export default class GameInGameConsumer {
  constructor(definition, publisher) {
    this.definition = definition;
    this.publisher = publisher;
  }

  async consume(realPlayer) {
    const payload = {
      choices: this.definition.choices,
    };

    this.publisher.publishToUser(realPlayer.UID, payload);
  }
}

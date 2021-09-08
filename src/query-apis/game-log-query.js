export default class GameLogQuery {
  constructor(
    roundsRepository,
    userInfosRepository,
    gameConfigsRepository,
    definition
  ) {
    this.roundsRepository = roundsRepository;
    this.userInfosRepository = userInfosRepository;
    this.gameConfigsRepository = gameConfigsRepository;
    this.definition = definition;
  }

  async queryLogs(player) {
    if (!player.session) {
      return {};
    }

    const user = await this.userInfosRepository
      .findOne({ id: player.UID })
      .lean()
      .exec();

    if (!user) {
      return {};
    }

    const config = await this.gameConfigsRepository
      .findOne({
        name: this.definition.configName,
      })
      .lean()
      .exec();

    const disabledMessage = config === null ? '' : config.disabled_message;
    let disabled = true;
    if (!!config) {
      const { enabled } = config;
      disabled = !enabled;
    }

    const logs = {
      choices: this.definition.choices,
      um: disabled,
      um_message: disabledMessage,
      totalCoins: 0,
      availSpins: 0,
    };

    const spins = await this.roundsRepository
      .findOne({ memberId: player.session.memberId, enabled: true })
      .lean()
      .exec();

    if (spins) {
      logs.totalCoins = user.scoins;
      logs.availSpins = spins.availSpins;
    }

    return logs;
  }
}

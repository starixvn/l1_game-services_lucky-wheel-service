export default class GameInGameConsumer {
    constructor(definition, publisher, gameConfigsRepository, roundsRepository, userInfosRepository, notificationRepository) {
        this.definition = definition;
        this.publisher = publisher;
        this.gameConfigsRepository = gameConfigsRepository;
        this.roundsRepository = roundsRepository;
        this.userInfosRepository = userInfosRepository;
        this.notificationRepository = notificationRepository;
    }

    async consume(realPlayer) {
        const isUM = await this.getUMStatus();
        const payload = {
            um: isUM,
            um_message: isUM ? await this.getUMMessages() : '',
            availSpins: await this.getPlayerAvailableSpins(realPlayer),
            scoins: await this.getPlayerScoins(realPlayer),
            choices: this.definition.choices,
        };

        this.publisher.publishToUser(realPlayer.UID, payload);
    }

    async getUMStatus() {
        const gameName = this.definition.configName;
        const config = await this.gameConfigsRepository.findOne({ name: gameName }).lean().exec();
        let disabled = true;
        if (!!config) {
            const { enabled } = config;
            disabled = !enabled;
        }

        return disabled;
    }

    async getUMMessages() {
        const notification = await this.notificationRepository
            .findOne({ gameName: this.definition.configName, displayKind: 2 }, 'messages')
            .lean()
            .exec();

        return notification?.messages ?? {};
    }

    async getPlayerAvailableSpins(realPlayer) {
        const memberId = realPlayer.session?.memberId;
        const userSpins = await this.roundsRepository.findOne({ memberId }).lean().exec();
        return userSpins?.availSpins ?? 0;
    }

    async getPlayerScoins(realPlayer) {
        const user = await this.userInfosRepository.findOne({ id: realPlayer.UID }).lean().exec();
        return user?.scoins ?? 0;
    }
}

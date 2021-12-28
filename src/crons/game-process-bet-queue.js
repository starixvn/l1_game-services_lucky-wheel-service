import { Core } from 'sc-game-base';
import constants from '../constants';

export default class GameProcessBetQueue extends Core.Crons.ProcessBetQueue {
    constructor(params) {
        super(params);
        this.gameConfigsRepository = params.gameConfigsRepository;
        this.userInfosRepository = params.userInfosRepository;
        this.spinResultsRepository = params.betsRepository;
        this.roundsRepository = params.roundsRepository;
        this.notificationRepository = params.notificationRepository;
        this.settleGameRoundConsumer = params.settleGameRoundConsumer;
    }

    async proceedBet(player, payload) {
        if (!(await this.validateBetRequest(player, payload))) {
            return;
        }

        await this.handleSuccessBet(player, payload);
    }

    async composeValidationCriteria(player, payload) {
        const gameName = this.definition.configName;
        const config = await this.gameConfigsRepository.findOne({ name: gameName }).lean().exec();
        let disabled = true;
        if (!!config) {
            const { enabled } = config;
            disabled = !enabled;
        }

        const userSpin = await this.roundsRepository.findOne({ memberId: payload, enabled: true }).lean().exec();
        const disabledMessages = disabled
            ? await this.notificationRepository.findOne({ gameName, displayKind: 2 }, 'messages').lean().exec()
            : { messages: [] };

        return [
            {
                failure: !userSpin || userSpin?.availSpins < 1,
                notice: { message: { errorCode: constants.notEnoughSpin } },
            },
            {
                failure: disabled,
                um: disabled,
                notice: { um: disabled, message: disabledMessages?.messages },
            },
        ];
    }

    handleFailedBet(player, notice, bet) {
        const payload = notice.um ? { um: true, um_message: notice.message } : { notice: notice.message, endBet: -1 };

        this.placeBetPublisher.publishGameFailedBet(player.UID, payload);
    }

    async handleSuccessBet(player, payload) {
        const result = this.definition.generateResult();
        const coins = this.definition.choices[result];

        await this.insertRound(player, coins);

        const userSpin = await this.roundsRepository.findOne({ memberId: payload }).lean().exec();

        const user = await this.userInfosRepository.findOne({ id: player.UID }).lean().exec();

        const status = {
            coins,
            availSpins: userSpin.availSpins - 1,
            totalCoins: user ? user.scoins + coins : 0,
        };

        await this.settleGameRoundConsumer.settle(player.UID, payload, coins);
        this.notifyPlacingBetResult(player, status);
    }

    notifyPlacingBetResult(player, status) {
        this.placeBetPublisher.publishSuccessBet(player.UID, { status });
    }

    async insertRound(player, coins) {
        await this.spinResultsRepository.create({
            uid: player.UID,
            name: player.profile?.name,
            result: coins,
            memberId: player.session?.memberId,
            siteId: player.session?.siteId,
            time: new Date(),
        });
    }
}

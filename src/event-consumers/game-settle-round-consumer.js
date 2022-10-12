export default class GameSettleRoundConsumer {
  constructor({ roundsRepository, userInfosRepository }) {
    this.roundsRepository = roundsRepository;
    this.userInfosRepository = userInfosRepository;
  }

  async settle(memberId, payload, coins) {
    await this.roundsRepository.updateOne(
      { playerId: payload },
      { $inc: { availSpins: -1, usedSpins: 1 } }
    );

    await this.userInfosRepository.updateOne(
      { id: memberId },
      { $inc: { scoins: coins } }
    );
  }
}

export default class GameHistoryQuery {
  constructor(betsRepository) {
    this.betsRepository = betsRepository;
  }

  async queryHistory(player, page, pageSize) {
    if (page < 1 || !player) {
      return {};
    }

    const filter = { uid: player.UID };
    const numberOfSkippedBets = (page - 1) * pageSize;
    const total = await this.betsRepository.countDocuments(filter).exec();
    const betProjection = {
      _id: false,
      uid: false,
      siteId: false,
      memberId: false,
      playerId: false,
      __v: false,
      __archive: false,
    };

    const betLogs = await this.betsRepository
      .find(filter, betProjection, {
        sort: { _id: -1 },
        skip: numberOfSkippedBets,
        limit: pageSize,
      })
      .lean()
      .exec();

    return { history: { betLogs, page, pageSize, total } };
  }
}

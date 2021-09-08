export default class GameDefinition {
  constructor(
    {
      name = '',
      choices = [],
      numberOfRoundHistory = 100,
      historyPageSize = 8,
    },
    generateResult
  ) {
    this.name = name;
    this.configName = name.toLowerCase();
    this.choices = choices;
    this.numberOfRoundHistory = numberOfRoundHistory;
    this.historyPageSize = historyPageSize;
    this.generateResult = generateResult;
  }
}

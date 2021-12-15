export default class GameDefinition {
    constructor({ name = '', choices = [], numberOfRoundHistory = 100, historyPageSize = 8, durations = {} }, generateResult) {
        this.name = name;
        this.configName = name.toLowerCase();
        this.choices = choices;
        this.numberOfRoundHistory = numberOfRoundHistory;
        this.historyPageSize = historyPageSize;
        this.generateResult = generateResult;
        this.durations = durations;
    }
}

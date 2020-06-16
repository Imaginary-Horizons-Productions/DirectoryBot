module.exports = class Command {
    constructor(namesInput, summaryInput, managerCommandInput) {
        this.names = namesInput;
        this.summary = summaryInput;
        this.managerCommand = managerCommandInput;
    }

    help(clientUser, state) { }

    execute(receivedMessage, state, metrics) { }
}
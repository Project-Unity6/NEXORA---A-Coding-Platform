const EventEmitter = require("events");

class SubmissionCompletedEvent extends EventEmitter {}

module.exports = new SubmissionCompletedEvent();
const moment = require('moment');

interface Message {
    user_name: string;
    text: string;
    time: string;
}

function createMsg(user_name: string, text: string): Message {
    return {
        user_name,
        text,
        time: moment().format('h:mm a'),
    };
}

module.exports = createMsg;

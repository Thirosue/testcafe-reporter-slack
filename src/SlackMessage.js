/*
The MIT License (MIT)

Copyright (c) Shafied <s.kasiemkhan@kifid.nl>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
require('dotenv').config();
const envs = require('envs');

export default class SlackMessage {
    constructor() {
        let slackNode = require('slack-node');
        this.slack = new slackNode();
        this.slack.setWebhook(envs('TESTCAFE_SLACK_WEBHOOK', 'http://example.com'));
        this.message = [];
        this.errorMessage = [];
    }

    addMessage(message) {
        this.message.push(message)
    }

    addErrorMessage(message) {
        this.errorMessage.push(message)
    }

    sendMessage(message, slackProperties = null) {
        this.slack.webhook(Object.assign({
            channel: envs('TESTCAFE_SLACK_CHANNEL', '#testcafe'),
            username: envs('TESTCAFE_SLACK_BOT', 'testcafebot'),
            text: message
        }, slackProperties), function (err, response) {
            if(err) {
                console.log('Unable to send a message to slack');
                console.log(response);
            } else {
                console.log(`The following message is send to slack: \n ${message}`);
            }
        })
    }

    sendTestReport(nrFailedTests) {
        this.sendMessage(this.getTestReportMessage(), nrFailedTests > 0
            ? {
                "attachments": [{
                    color: 'danger',
                    text: `${nrFailedTests} test failed`
                }]
            }
            : null
        )
    }

    getTestReportMessage() {
        let message = this.getSlackMessage();
        let errorMessage = this.getErrorMessage();

        if(errorMessage.length > 0) {
            message = message + "\n\n\n```" + this.getErrorMessage() + '```';
        }
        return message;
    }

    getErrorMessage() {
        return this.errorMessage.join("\n\n\n");
    }

    getSlackMessage() {
        return this.message.join("\n");
    }
}
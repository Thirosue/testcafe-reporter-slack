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
import SlackMessage from './SlackMessage'

export default function () {
    return {

        noColors: true,

        reportTaskStart (startTime, userAgents, testCount) {
            this.slack = new SlackMessage();
            this.startTime = startTime;
            this.testCount = testCount;

            this.slack.sendMessage(`Starting testcafe ${startTime}. \n Running tests in: ${userAgents}`)
        },

        reportFixtureStart (name, path) {
            this.currentFixtureName = name;
            this.slack.addMessage(this.currentFixtureName);
        },

        reportTestDone (name, testRunInfo) {
            const hasErr = testRunInfo.errs.length > 0;
            const result = hasErr ? ':heavy_multiplication_x:' : ':heavy_check_mark: ';

            this.slack.addMessage(`${result} ${name}`);
        },

        reportTaskDone (endTime, passed, warnings) {
            const durationMs  = endTime - this.startTime;
            const durationStr = this.moment
                .duration(durationMs)
                .format('h[h] mm[m] ss[s]')
            let footer = passed === this.testCount ?
                `${this.testCount} passed` :
                `${this.testCount - passed}/${this.testCount} failed`;

            footer = `\n*${footer}* (Duration: ${durationStr})`;

            this.slack.addMessage(footer);
            this.slack.sendTestReport(this.testCount - passed);
        }
    }
}

import * as _ from 'lodash';
import * as nodemailer from 'nodemailer';

export class MailerWrapper {
    constructor(smtpConfig, mailTitle, mailingList) {
        this.initTransporter(smtpConfig);
        this.mailingList = mailingList;
        this.mailTitle = mailTitle;
    }

    initTransporter(smtpConfig) {
        this.transporter = nodemailer.createTransport({
            host: smtpConfig.hostname,
            port: smtpConfig.port,
            secure: true,
            auth: {
                user: smtpConfig.username,
                pass: smtpConfig.pass
            }
        });
    }

    sendMail(pushInfo) {
        const mailOptions = {
            from: _.first(this.mailingList),
            to: this.mailingList.join(','),
            subject: this.mailTitle,
            html: this.createHtmlBody(pushInfo)
        };

        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                process.stdout.write(error);
            }
            else {
                process.stdout.write(`Message ${info.messageId} sent: ${info.response}\n`);
            }
        });
    }

    createHtmlBody(pushInfo) {
        let htmlBody = `<h1>${this.mailTitle}</h1><br>`;

        if (!_.isEmpty(pushInfo.removedFilesArray)) {
            htmlBody += MailerWrapper.createHtmlList('Removed Files', pushInfo.removedFilesArray, pushInfo.repoName, pushInfo.branchName);
        }
        if (!_.isEmpty(pushInfo.addedFilesArray)) {
            htmlBody += MailerWrapper.createHtmlList('Added Files', pushInfo.addedFilesArray, pushInfo.repoName, pushInfo.branchName);
        }
        if (!_.isEmpty(pushInfo.modifiedFilesArray)) {
            htmlBody += MailerWrapper.createHtmlList('Modified Files', pushInfo.modifiedFilesArray, pushInfo.repoName, pushInfo.branchName);
        }

        return htmlBody;
    }

    static createHtmlList(title, collection, repoName, branchName) {
        let html = `<h3>${title}:</h3><br>`;
        html += '<ul>';
        _.forEach(collection, (item) => {
            const anchor = `<a target="_blank" href="https://github.com/${repoName}/blob/${branchName}/${item}">${item}</a>`;
            html += `<li>${anchor}</li><br>`;
        });
        html += '</ul><br>';

        return html;
    }
}

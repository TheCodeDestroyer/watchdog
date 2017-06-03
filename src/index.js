import githubHook from 'githubhook';
import * as _ from 'lodash';

import { PushInfoChecker } from './helpers/PushInfoChecker';
import { MailerWrapper } from './helpers/MailerWrapper';
import { InitHelper } from './helpers/InitHelper';

const err = InitHelper.checkConfig();
if (err) {
    process.stderr.write('Server not properly configured!\n');
    process.stderr.write(`Missing ENV variable/s:  ${err}\n`);
    process.stderr.write('Shutting down...\n');
    process.exit();
}

const github = githubHook({
    host: '0.0.0.0',
    port: process.env.PORT || 9898,
    path: '/pushrouteyouwontguess',
    secret: process.env.GITHUB_WEBHOOK_SECRET
});

const appConfig = {
    mailTitle: 'GitHub WebHook - Triggered',
    mailingList: process.env.MAILING_LIST.split(','),
    pathList: process.env.FILE_PATH_LIST.split(',')
};

const mailerConfig = {
    hostname: process.env.SMTP_HOSTNAME,
    port: 465,
    username: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
};

// process.stdout.write(`MAILING LIST: ${appConfig.mailingList}`);
// process.stdout.write(`PATH LIST: ${appConfig.pathList}`);
// process.stdout.write(`SMTP HOSTNAME: ${mailerConfig.hostname}`);
// process.stdout.write(`SMTP USER: ${mailerConfig.username}`);

const mailerWrapper = new MailerWrapper(mailerConfig, appConfig.mailTitle, appConfig.mailingList);

github.on('push', (repo, ref, data) => {
    const branchNameObject = _.chain(ref.split('/')).last();
    const branchName = branchNameObject.value();
    const fullNameRepository = data.repository.full_name;
    const fileData = data.head_commit;
    const pushInfo = {
        repoName: fullNameRepository,
        branchName: branchName,
        removedFilesArray: fileData.removed,
        addedFilesArray: fileData.added,
        modifiedFilesArray: fileData.modified
    };

    if (PushInfoChecker.sendMailCheck(appConfig, pushInfo)) {
        mailerWrapper.sendMail(pushInfo);
    }
});

github.listen();

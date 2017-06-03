import githubHook from 'githubhook';
import * as _ from 'lodash';

import { PushInfoChecker } from './helpers/PushInfoChecker';
import { MailerWrapper } from './helpers/MailerWrapper';
import { InitHelper } from './helpers/InitHelper';

const err = InitHelper.checkConfig();
if (err) {
    process.stdout.write('Server not properly configured!\n');
    process.stdout.write('Missing ENV variable/s: %s\n', err);
    process.stdout.write('Shutting down...\n');
    process.exit();
}

const github = githubHook({
    host: '0.0.0.0',
    port: 9898,
    path: '/pushrouteyouwontguess',
    secret: process.GITHUB_WEBHOOK_SECRET
});

const appConfig = {
    mailTitle: 'GitHub WebHook - Triggered',
    mailingList: process.MAILING_LIST.split(','),
    pathList: process.FILE_PATH_LIST.split(',')
};

const mailerConfig = {
    hostname: process.SMTP_HOSTNAME,
    port: 465,
    username: process.SMTP_USERNAME,
    pass: process.SMTP_PASSWORD
};

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
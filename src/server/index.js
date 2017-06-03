import githubHook from 'githubhook';
import * as _ from 'lodash';

import { PushInfoChecker } from 'helpers/PushInfoChecker';

const github = githubHook({
    host: '0.0.0.0',
    port: 9898,
    path: '/pushrouteyouwontguess',
    secret: '1bdb7d1de432d998ae9cad3921d2c13e53295058'
});

const appConfig = {
    mailingList: [],
    pathList: ['test.js', 'correctFolder/*']
};

github.on('push', (repo, ref, data) => {
    const branchNameObject = _.chain(ref.split('/')).last();
    const branchName = branchNameObject.value();
    const fileData = data.head_commit;
    const pushInfo = {
        removedFilesArray: fileData.removed,
        addedFilesArray: fileData.added,
        modifiedFilesArray: fileData.modified
    };

    if (PushInfoChecker.sendMailCheck(appConfig, pushInfo)) {
        console.log('should send!');
        console.log('should send!');
        console.log('should send!');
    }

    const eventInfo = `
    BRANCH: ${branchName}
    REMOVED FILES: ${pushInfo.removedFilesArray}
    ADDED FILES: ${pushInfo.addedFilesArray}
    CHANGED FILES: ${pushInfo.modifiedFilesArray}
    `;
    console.log(eventInfo);
});

github.listen();

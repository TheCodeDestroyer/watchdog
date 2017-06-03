import * as _ from 'lodash';

export class PushInfoChecker {
    static sendMailCheck(appConfig, pushInfo) {
        let shouldSend = false;
        _.forEach(appConfig.pathList, (pathInfo) => {
            if (shouldSend) {
                return;
            }

            if (_.includes(pathInfo, '*')) {
                const correctedPathInfo = _.replace(pathInfo, '*', '');
                shouldSend = this.commitIncludes(pushInfo, correctedPathInfo);
            }
            else {
                shouldSend = this.commitEquals(pushInfo, pathInfo);
            }
        });

        return shouldSend;
    }

    static commitIncludes(pushInfo, pathInfo) {
        let commitIncludesPath = false;

        _.forEach(pushInfo.removedFilesArray, (removedFile) => {
            if (commitIncludesPath) {
                return;
            }

            commitIncludesPath = _.includes(removedFile, pathInfo);
        });
        _.forEach(pushInfo.addedFilesArray, (addedFile) => {
            if (commitIncludesPath) {
                return;
            }

            commitIncludesPath = _.includes(addedFile, pathInfo);
        });
        _.forEach(pushInfo.modifiedFilesArray, (modifiedFile) => {
            if (commitIncludesPath) {
                return;
            }

            commitIncludesPath = _.includes(modifiedFile, pathInfo);
        });

        return commitIncludesPath;
    }

    static commitEquals(pushInfo, pathInfo) {
        let commitEqualsPath = false;

        _.forEach(pushInfo.removedFilesArray, (removedFile) => {
            if (commitEqualsPath) {
                return;
            }

            commitEqualsPath = removedFile === pathInfo;
        });
        _.forEach(pushInfo.addedFilesArray, (addedFile) => {
            if (commitEqualsPath) {
                return;
            }

            commitEqualsPath = addedFile === pathInfo;
        });
        _.forEach(pushInfo.modifiedFilesArray, (modifiedFile) => {
            if (commitEqualsPath) {
                return;
            }

            commitEqualsPath = modifiedFile === pathInfo;
        });

        return commitEqualsPath;
    }

}

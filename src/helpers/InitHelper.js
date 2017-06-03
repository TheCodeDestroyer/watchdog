export class InitHelper {
    static checkConfig() {
        const missingEnvVariables = [];
        if (!process.MAILING_LIST) {
            missingEnvVariables.push('MAILING_LIST');
        }
        if (!process.FILE_PATH_LIST) {
            missingEnvVariables.push('FILE_PATH_LIST');
        }
        if (!process.GITHUB_WEBHOOK_SECRET) {
            missingEnvVariables.push('GITHUB_WEBHOOK_SECRET');
        }
        if (!process.SMTP_HOSTNAME) {
            missingEnvVariables.push('SMTP_HOSTNAME');
        }
        if (!process.SMTP_USERNAME) {
            missingEnvVariables.push('SMTP_USERNAME');
        }
        if (!process.SMTP_PASSWORD) {
            missingEnvVariables.push('SMTP_PASSWORD');
        }

        return missingEnvVariables.join(', ');
    }
}

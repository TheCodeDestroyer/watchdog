export class InitHelper {
    static checkConfig() {
        const missingEnvVariables = [];
        if (!process.env.MAILING_LIST) {
            missingEnvVariables.push('MAILING_LIST');
        }
        if (!process.env.FILE_PATH_LIST) {
            missingEnvVariables.push('FILE_PATH_LIST');
        }
        if (!process.env.GITHUB_WEBHOOK_SECRET) {
            missingEnvVariables.push('GITHUB_WEBHOOK_SECRET');
        }
        if (!process.env.SMTP_HOSTNAME) {
            missingEnvVariables.push('SMTP_HOSTNAME');
        }
        if (!process.env.SMTP_USERNAME) {
            missingEnvVariables.push('SMTP_USERNAME');
        }
        if (!process.env.SMTP_PASSWORD) {
            missingEnvVariables.push('SMTP_PASSWORD');
        }

        return missingEnvVariables.join(', ');
    }
}

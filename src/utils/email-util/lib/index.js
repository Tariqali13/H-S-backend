const appRoot = require('app-root-path');
const config = require('config');
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = config.get('sendGrid.apiKey');
sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = {
    send: async function (params) {
        try {
            const emailFromName = params.email_from_name;
            const emailFrom = params.email_from;
            const emailTo = params.email_to;
            const subject = params.subject;
            const emailContent = params.email_content;
            //sending email
            const msg = {
                from: {
                    email: emailFrom,
                    name: emailFromName
                },
                subject: subject,
                html: emailContent
            }
            if (emailTo) {
                msg.to = emailTo.toLowerCase();
            }
            // if (!LIVE_MODE) {
            //     msg.mail_settings = {
            //         sandbox_mode: {
            //             enable: true
            //         }
            //     }
            // }
            await sgMail.send(msg);
            return true;
        } catch (error) {
            console.log("error",error)
            return false;
        }
    }
}

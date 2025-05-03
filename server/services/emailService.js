const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

class EmailService {
    constructor() {
        this.service = process.env.EMAIL_SERVICE || 'gmail';
        
        if (this.service === 'gmail') {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
        } else if (this.service === 'sendgrid') {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        }
    }

    async sendEmail(to, subject, html) {
        try {
            if (this.service === 'gmail') {
                await this.transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to,
                    subject,
                    html
                });
            } else if (this.service === 'sendgrid') {
                await sgMail.send({
                    to,
                    from: process.env.SENDER_EMAIL,
                    subject,
                    html
                });
            }
        } catch (error) {
            console.error(`${this.service.toUpperCase()} Email Error:`, error);
            throw error;
        }
    }
}

module.exports = new EmailService(); 
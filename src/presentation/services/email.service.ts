import nodemailer, { Transporter } from 'nodemailer';

export interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
}

export class EmailService {

    private transporter: Transporter;

    constructor(
        public readonly mailerService: string,
        public readonly mailerEmail: string,
        public readonly mailerSecret: string
    ) {
        this.transporter = nodemailer.createTransport({
            service: this.mailerService,
            auth: {
                user: mailerEmail,
                pass: mailerSecret,
            }
        });
    }
    
    async sendEmail( options: SendMailOptions ): Promise<boolean> {

        const { to, subject, htmlBody } = options;

        try {

            const sentInformation = await this.transporter.sendMail( {
                to: to,
                subject: subject,
                html: htmlBody,
            });

            return true;
        } catch ( error ) {
            return false;
        }
    }
}
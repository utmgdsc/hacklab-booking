import nodemailer from 'nodemailer';
import logger from '../common/logger';

logger.info(`EMAIL_USER: ${process.env.EMAIL_USER}`);
logger.info(`EMAIL_PASS: ${process.env.EMAIL_PASS}`);
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export default async (to: string | string[], subject: string, html: string) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
    });
};

// server\services\emailService.js
const nodemailer = require('nodemailer');
const dns = require('dns').promises;

// List of known disposable/temporary email domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
    'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
    '10minutemail.com', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
    'yopmail.com', 'getnada.com', 'maildrop.cc', 'sharklasers.com',
    'grr.la', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me',
    'bccto.me', 'chacuo.net', 'dispostable.com', 'emkei.cz',
    'emailondeck.com', 'getairmail.com', 'hidemail.de', 'mytemp.email',
    'mohmal.com', 'mailnesia.com', 'jetable.org', 'anonymbox.com',
    'deadaddress.com', 'sogetthis.com', 'spamhereplease.com', 'tempinbox.com',
    'discard.email', 'emailtemporanea.com', 'fakemailgenerator.com',
    'incognitomail.org', 'mailcatch.com', 'mailnull.com', 'mintemail.com',
    'mytrashmail.com', 'no-spam.ws', 'nowmymail.com', 'objectmail.com',
    'proxymail.eu', 'rcpt.at', 'safe-mail.net', 'sneakemail.com',
    'spambog.com', 'spamex.com', 'spamgourmet.com', 'tempemail.net',
    'tempmailo.com', 'thankyou2010.com', 'tmail.ws', 'trbvm.com',
    'wegwerfmail.de', 'wh4f.org', 'zetmail.com', 'zoemail.org',
    '33mail.com', 'mailhero.io', 'simplelogin.io', 'anonaddy.com'
]);

// Create transporter for sending emails
const createTransporter = () => {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};


// Validate email format
const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Check if email domain is disposable
const isDisposableEmail = (email) => {
    if (!email || !isValidEmailFormat(email)) {
        return true;
    }
    const domain = email.split('@')[1].toLowerCase();
    return DISPOSABLE_EMAIL_DOMAINS.has(domain);
};

// Validate MX records for email domain
const validateMXRecord = async (email) => {
    if (!email || !isValidEmailFormat(email)) {
        return false;
    }

    try {
        const domain = email.split('@')[1];
        const records = await dns.resolveMx(domain);
        return records && records.length > 0;
    } catch (error) {
        console.error(`MX record validation failed for ${email}:`, error.message);
        return false;
    }
};

// Comprehensive email validation
const validateEmail = async (email) => {
    const errors = [];

    // Check format
    if (!isValidEmailFormat(email)) {
        errors.push('Invalid email format');
        return { valid: false, errors };
    }

    // Check disposable
    if (isDisposableEmail(email)) {
        errors.push('Temporary/disposable email addresses are not allowed');
    }

    // Check MX record
    const hasMX = await validateMXRecord(email);
    if (!hasMX) {
        errors.push('Email domain does not accept emails');
    }

    return {
        valid: errors.length === 0,
        errors,
        isDisposable: isDisposableEmail(email),
        hasMXRecord: hasMX
    };
};

// Send verification code email
const sendVerificationEmail = async (email, code, purpose) => {
    try {
        const transporter = createTransporter();

        let subject, htmlContent;

        if (purpose === 'forgot_password') {
            subject = 'Password Reset Verification Code';
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                        .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
                        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Verification Code</h1>
                            <p>SurangaTours Security</p>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>You have requested to reset your password for your SurangaTours account.</p>

                            <div class="code-box">
                                <p style="margin: 0; color: #666;">Your verification code is:</p>
                                <div class="code">${code}</div>
                            </div>

                            <div class="warning">
                                <strong>⚠️ Important:</strong>
                                <ul style="margin: 10px 0; padding-left: 20px;">
                                    <li>This code will expire in 10 minutes</li>
                                    <li>This code can only be used once</li>
                                    <li>Do not share this code with anyone</li>
                                </ul>
                            </div>

                            <p>If you did not request this code, please ignore this email or contact our support team immediately.</p>

                            <div class="footer">
                                <p>This is an automated message from SurangaTours.</p>
                                <p>&copy; ${new Date().getFullYear()} SurangaTours. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `;
        } else if (purpose === 'change_password') {
            subject = 'Password Change Verification Code';
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                        .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
                        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Verification Code</h1>
                            <p>SurangaTours Security</p>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>You have requested to change your password for your SurangaTours account.</p>

                            <div class="code-box">
                                <p style="margin: 0; color: #666;">Your verification code is:</p>
                                <div class="code">${code}</div>
                            </div>

                            <div class="warning">
                                <strong>⚠️ Important:</strong>
                                <ul style="margin: 10px 0; padding-left: 20px;">
                                    <li>This code will expire in 10 minutes</li>
                                    <li>This code can only be used once</li>
                                    <li>Do not share this code with anyone</li>
                                </ul>
                            </div>

                            <p>If you did not request this code, please ignore this email or contact our support team immediately.</p>

                            <div class="footer">
                                <p>This is an automated message from SurangaTours.</p>
                                <p>&copy; ${new Date().getFullYear()} SurangaTours. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `;
        } else if (purpose === 'registration') {
            subject = 'Email Verification Code - Complete Your Registration';
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #1a6b2e 0%, #2d9e4f 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .code-box { background: white; border: 2px dashed #1a6b2e; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                        .code { font-size: 32px; font-weight: bold; color: #1a6b2e; letter-spacing: 5px; }
                        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                        .welcome { background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🌿 Welcome to SurangaTours!</h1>
                            <p>Email Verification</p>
                        </div>
                        <div class="content">
                            <div class="welcome">
                                <p><strong>Welcome aboard!</strong> You're just one step away from completing your registration.</p>
                            </div>
                            <p>To verify your email address and activate your account, please use the following verification code:</p>

                            <div class="code-box">
                                <p style="margin: 0; color: #666;">Your verification code is:</p>
                                <div class="code">${code}</div>
                            </div>

                            <div class="warning">
                                <strong>⚠️ Important:</strong>
                                <ul style="margin: 10px 0; padding-left: 20px;">
                                    <li>This code will expire in 10 minutes</li>
                                    <li>This code can only be used once</li>
                                    <li>Do not share this code with anyone</li>
                                </ul>
                            </div>

                            <p>If you didn't create an account with SurangaTours, please ignore this email.</p>

                            <div class="footer">
                                <p>This is an automated message from SurangaTours.</p>
                                <p>&copy; ${new Date().getFullYear()} SurangaTours. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `;
        }

        const mailOptions = {
            from: `"SurangaTours" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Verification email sent to ${email}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending verification email:', error.message);
        throw new Error('Failed to send verification email');
    }
};

module.exports = {
    sendVerificationEmail,
    validateEmail,
    isDisposableEmail,
    validateMXRecord,
    isValidEmailFormat,
};

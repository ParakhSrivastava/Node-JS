const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'srivastavaparakh2017@gmail.com',
        subject: 'Testing',
        text: `Hello!!! This is testing, ${name}`
    })
};

module.exports = {
    sendEmail
}

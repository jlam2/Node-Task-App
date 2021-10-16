const sendGrid = require('@sendgrid/mail')

sendGrid.setApiKey(process.env['SENDGRID_KEY'])

function sendWelcomeEmail(email, name){
    sendGrid.send({
        to: process.env['MY_EMAIL'], //prevent random spam
        from: process.env['MY_EMAIL'],
        subject: 'Thanks for joining!',
        text:`Welcome to the app ${name}! I hope the app serves you well. Let me know if you find any problems.`
    })
}

function sendCancellationEmail(email, name){
    sendGrid.send({
        to: process.env['MY_EMAIL'], //prevent random spam
        from: process.env['MY_EMAIL'],
        subject: 'Cancellation confirmation',
        text:`Goodbye ${name}. We are sad to see you leave but wish you good vibes.`
    })
}

module.exports = {sendWelcomeEmail, sendCancellationEmail}
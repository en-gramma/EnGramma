import nodemailer from 'nodemailer';

export const sendMessage = async (req, res) => {
  const { fullName, email, message, object } = req.body;
  const user = process.env.EMAIL_USER;

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_KEY, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: email, 
    to: user, 
    subject: object, 
    text: message, 
    html: `<b>${fullName} Vous a envoyé un message via le formulaire de contact du site En Gramma:</b><br>${message}`, // html body
  });

  res.json({ status: 'Message sent', messageId: info.messageId });
};


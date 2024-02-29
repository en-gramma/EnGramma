import nodemailer from 'nodemailer';

export const sendMessage = async (req, res) => {
  const { fullName, email, message, object } = req.body;
  const user = process.env.EMAIL_USER;

  // Configuration du transporteur
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_KEY, 
    },
  });

  // Mise en page du message
  const info = await transporter.sendMail({
    from: user, 
    replyTo: email,
    to: user, 
    subject: object, 
    text: message, 
    html: `<b>"${fullName}" vous a envoyé un message via le formulaire de contact du site En Gramma:</b><br>${message}`, // html body
  });

  res.json({ status: 'Message sent', messageId: info.messageId });
};


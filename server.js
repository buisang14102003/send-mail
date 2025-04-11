require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-mail', async (req, res) => {
  const { to, positive, negative } = req.body;

  if (!to || positive === undefined || negative === undefined) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  //Email Content
  const content = `
Dear User,
Customer have sentiment index: 
+ PostiveValue: ${positive}
+ NegativeValue: ${negative}
`;

  try {
    await transporter.sendMail({
      from: `"Sentiment Service" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: 'Customer Sentiment Report',
      text: content,
    });

    res.status(200).send({ success: true, message: 'Email sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: 'Failed to send email.' });
  }
});

app.listen(3000, () => {
  console.log('Mail server running at http://localhost:3000');
});

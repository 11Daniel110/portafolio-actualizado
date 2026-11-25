const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  dotfiles: 'deny',
  index: false
}));

app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/hire-me.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'hire-me.html'));
});

app.get('/projects-grid-cards.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'projects-grid-cards.html'));
});

app.post('/send-email', async (req, res) => {
  const { email, subject, message } = req.body || {};

  if (
    typeof email !== 'string' ||
    typeof subject !== 'string' ||
    typeof message !== 'string' ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !subject.trim() ||
    subject.trim().length > 200 ||
    !message.trim() ||
    message.trim().length > 10000
  ) {
    return res.status(400).json({ error: 'Revisa los datos del formulario.' });
  }

  const { SMTP_USER, SMTP_APP_PASSWORD, CONTACT_EMAIL } = process.env;
  if (!SMTP_USER || !SMTP_APP_PASSWORD || !CONTACT_EMAIL) {
    return res.status(503).json({ error: 'El servicio de correo no está configurado.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_USER,
      pass: SMTP_APP_PASSWORD
    }
  });

  try {
    await transporter.sendMail({
      from: SMTP_USER,
      to: CONTACT_EMAIL,
      replyTo: email.trim(),
      subject: subject.trim(),
      text: `De: ${email.trim()}\n\nMensaje: ${message.trim()}`
    });
    return res.status(200).json({ message: 'Correo enviado correctamente.' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return res.status(500).json({ error: 'No fue posible enviar el correo.' });
  }
});

app.use((req, res) => {
  res.status(404).send('No encontrado');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

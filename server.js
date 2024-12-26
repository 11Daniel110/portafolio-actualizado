const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Crea una instancia de express
const app = express();
const port = 3000;  // Puedes usar el puerto que prefieras

// Middleware para parsear JSON
app.use(express.json());
app.use(cors());

// Configura el transporte de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar otro proveedor de correo
  auth: {
    user: 'manejocorreos@gmail.com', // Tu correo de Gmail
    pass: 'nlwd nqyf ehkz afhq' // La contraseña o App Password si usas autenticación de dos factores
  }
});

// Ruta POST para manejar el envío de correos
app.post('/send-email', (req, res) => {
  const { to, subject, message } = req.body;

    // Dirección de correo predeterminada donde quieres recibir los mensajes
    const correoPredeterminado = 'danielacunaaranzazu@gmail.com'; // Reemplaza con tu correo


  const mailOptions = {
    from: to, // Usa la dirección proporcionada por el usuario como remitente
    to: correoPredeterminado, // Envía el correo a tu dirección predeterminada
    subject: subject,
    text: `De: ${to}\n\nMensaje: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error al enviar el correo: ' + error);
    }
    res.status(200).send('Correo enviado: ' + info.response);
  });
});

// Sirve archivos estáticos desde el directorio actual
app.use(express.static(__dirname));


// Define una ruta para "/" que sirva index.html por defecto
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});



// Ruta POST para manejar el envío de correos (no se modifica)
app.post('/send-email', (req, res) => {
    const { to, subject, message } = req.body;
});

// Inicia el servidor en el puerto 3000
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const createUserAndUpdateIdentity = require('./POST/prueba');
const base64Encode = require('./GET/pruebaxapikeyLogin');
const { loginAndGetIdentity, getGlobalIdentityId } = require('./GET/login');
const getIdentityByNumber = require('./GET/getIdentityNumber');
const getTransactionsByIdentityId = require('./GET/getTransactions');
const getWithdrawalsByIdentityId = require('./GET/getWithdrawals');
const getSendsFromByIdentityId = require('./GET/getSendsFrom');
const getSendsToByIdentityId = require('./GET/getSendsTo');
const getAllSend = require('./GET/getAll');
const getCurrencies = require('./DROPDOWN/currencies');
const getDocumentType = require('./DROPDOWN/documentType');
const getInternationalCodes = require('./DROPDOWN/countryCodes');


const app = express(); 
const port = 5000;

// Middleware para manejar solicitudes JSON
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


// Ruta para la solicitud POST desde el frontend para usuarios 1a y 1b
app.post('/post-information', async (req, res) => {
  const requestData = req.body;
  try {
    const success = await createUserAndUpdateIdentity(
      requestData.username,
      requestData.password,
      requestData.country,
      requestData.currency,
      requestData.countryCode,
      requestData.phoneNumber,
      requestData.firstName,
      requestData.lastName,
      requestData.address,
      requestData.city,
      requestData.birthDate,
      requestData.documentType,
      requestData.documentNumber,
      requestData.passportNumber,
      requestData.email
    );

    if (success) {
      // Operación exitosa (código 200)
      res.status(200).send('Autenticación Completada');
    } else {
      // Error de autenticación (código 401)
      res.status(401).send('Error de autenticación');
    }
  } catch (error) {
    // Error interno del servidor (código 500)
    console.error(error);
    res.status(500).send('Error en la solicitud POST.');
  }
});

// Ruta que requiere autenticación
app.get('/get-login', async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  try {
    // Llama a la función de autenticación
    const userData = await loginAndGetIdentity(username, password);

    if (userData) {
      // Si la autenticación es exitosa, devuelve la información del usuario
      res.status(200).json(userData);
    } else {
      res.status(401).send('Error de autenticación');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en la autenticación.');
  }
});


// Ruta para codificación en base64
app.post('/base64encode', (req, res) => {
  const { username, password } = req.body;
  const userApiKey = base64Encode(username, password);
  res.json({ userApiKey });
});


// Ruta para obtener la lista de monedas
app.get('/currencies', async (req, res) => {
  try {
    const currencies = await getCurrencies();
    res.json(currencies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en la solicitud GET de monedas.');
  }
});

// Ruta para obtener la lista de tipos de documentos
app.get('/documentType', async (req, res) => {
  try {
    const documentType = await getDocumentType();
    res.json(documentType);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en la solicitud GET de tipos de documentos.');
  }
});

// Ruta para obtener la información de los códigos internacionales para celulares
app.get('/international-codes', async (req, res) => {
  try {
    const internationalCodes = await getInternationalCodes();
    res.status(200).json(internationalCodes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al recuperar códigos móviles internacionales' });
  }
});


// Ruta para la solicitud GET desde el frontend con número
app.get('/get-data/:number', async (req, res) => {
  const number = req.params.number;
  try {
    const data = await getIdentityByNumber(number);  // Usar la función actualizada
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en la solicitud GET.');
  }
});

// Ruta para obtener transacciones
app.get('/get-transactions', async (req, res) => {
  try {
    const transactions = await getTransactionsByIdentityId();
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en la solicitud GET de transacciones.');
  }
});

// Ruta para obtener retiros
app.get('/get-withdrawals', async (req, res) => {
  try {
    const withdrawals = await getWithdrawalsByIdentityId();
    res.json(withdrawals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en la solicitud GET de retiros.');
  }
});

// Ruta para obtener envíos desde
app.get('/get-sends-from', async (req, res) => {
  try {
    const sendsFrom = await getSendsFromByIdentityId();
    res.json(sendsFrom);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en la solicitud GET de envíos desde.');
  }
});

// Ruta para obtener envíos hacia
app.get('/get-sends-to', async (req, res) => {
  try {
    const sendsTo = await getSendsToByIdentityId();
    res.json(sendsTo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en la solicitud GET de envíos hacia.');
  }
});


// Ruta para la solicitud GET desde el frontend con número
app.get('/get-all-send', async (req, res) => {
  try {
    const data = await getAllSend();  // Usar la función actualizada
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en la solicitud GET.');
  }
});


// Incluir ruta de subir archivos
const postVerification = require('./POST/verification');

// Usar la ruta de subir archivos
app.use(postVerification);


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


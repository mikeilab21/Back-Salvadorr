const fetch = require('node-fetch');
const cleanCountryCode = require('./cleanCountry');

const apiKey = 'NWMxNzlmNGEtYTFiOS00OTQ1LWEwZmItMmMzZmM5NTM0ZDE3OlN2ZXgwNzcwQGdtYWlsLmNvbTpQQHNzdzByZA==';

async function createUserAndUpdateIdentity(username, password, country, currency, countryCode, phoneNumber, firstName, lastName, address, city, birthDate, documentType, documentNumber, passportNumber, email) {
  try {
    // Limpia el código de marcación
    const cleanedNumberPhone = cleanCountryCode(countryCode, phoneNumber);

    // Concatenar cleanedCountryCode con cleanedNumberPhone
    const numberWhatsapp = cleanedNumberPhone;

    // Mostrar los valores ingresados
    console.log('VALORES INGRESADOS:');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Country:', country);
    console.log('Currency:', currency);
    console.log('Number:', numberWhatsapp);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Address:', address);
    console.log('City:', city);
    console.log('Birth Date:', birthDate);
    console.log('Document Type:', documentType);
    console.log('Document Number:', documentNumber);
    console.log('Passport Number:', passportNumber);
    console.log('Email:', email);

    // 1a: Crear Usuario
    console.log('DATOS ANTES DE ENVIAR 1A: CREAR USUARIO:');
    const apiUrlCreateUser = 'https://api.orangepill.cloud/v1/users';
    const fetchOptionsCreateUser = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        username: username,
        password: password,
        roles: 'user',
        scope: 'own'
      })
    };

    console.log('BODY 1A:', fetchOptionsCreateUser.body);

    const responseCreateUser = await fetch(apiUrlCreateUser, fetchOptionsCreateUser);

    if (!responseCreateUser.ok) {
      throw new Error(`Error de red al crear usuario: ${responseCreateUser.status}`);
    }

    const dataCreateUser = await responseCreateUser.json();
    console.log(dataCreateUser);

    // Obtener los valores necesarios
    const { identity, id } = dataCreateUser;

    // 1b: Actualizar Identity
    console.log('DATOS ANTES DE ENVIAR 1B: ACTUALIZAR IDENTITY:');
    const apiUrlUpdateIdentity = `https://api.orangepill.cloud/v1/identities/${identity}`;
    console.log('URL de actualización de Identity:', apiUrlUpdateIdentity);

    const fetchOptionsUpdateIdentity = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        country: country,
        currency: currency,
        type: 'person',
        owner: id
      })
    };

    console.log('BODY 1B:', fetchOptionsUpdateIdentity.body);

    const responseUpdateIdentity = await fetch(apiUrlUpdateIdentity, fetchOptionsUpdateIdentity);

    if (!responseUpdateIdentity.ok) {
      const errorText = await responseUpdateIdentity.text();
      throw new Error(`Error al actualizar identity: ${responseUpdateIdentity.status}, ${errorText}`);
    }

    const dataUpdateIdentity = await responseUpdateIdentity.json();
    console.log(dataUpdateIdentity);

    // 1c: Crear Alias
    console.log('DATOS ANTES DE ENVIAR 1C: CREAR ALIAS:');
    const apiUrlCreateAlias = 'https://api.orangepill.cloud/v1/aliases';
    const fetchOptionsCreateAlias = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        type: 'identity',
        alias: numberWhatsapp,
        identity: identity,
        owner: id
      })
    };

    console.log('BODY 1C:', fetchOptionsCreateAlias.body);

    const responseCreateAlias = await fetch(apiUrlCreateAlias, fetchOptionsCreateAlias);

    if (!responseCreateAlias.ok) {
      const errorText = await responseCreateAlias.text();
      throw new Error(`Error al crear alias: ${responseCreateAlias.status}, ${errorText}`);
    }

    const dataCreateAlias = await responseCreateAlias.json();
    console.log(dataCreateAlias);

    // 1d: Crear Identidad con Información Adicional
    console.log('DATOS ANTES DE ENVIAR 1D: CREAR IDENTIDAD CON INFORMACIÓN ADICIONAL:');
    const apiUrlCreateIdentityWithInfo = `https://api.orangepill.cloud/v1/identities/${identity}/person`;
    console.log('URL de creación de Identidad con Información Adicional:', apiUrlCreateIdentityWithInfo);

    const fetchOptionsCreateIdentityWithInfo = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        country: country,
        birthDate: birthDate,
        contactInformation: {
          phone: [
            {
              number: numberWhatsapp
            }
          ],
          email: [
            {
              address: email
            }
          ]
        },
        customAttributes: {
          documentType: documentType,
          documentNumber: documentNumber,
          passportNumber: passportNumber,
          kyc: false
        }
      })
    };

    console.log('BODY 1D:', fetchOptionsCreateIdentityWithInfo.body);

    const responseCreateIdentityWithInfo = await fetch(apiUrlCreateIdentityWithInfo, fetchOptionsCreateIdentityWithInfo);

    if (!responseCreateIdentityWithInfo.ok) {
      const errorText = await responseCreateIdentityWithInfo.text();
      throw new Error(`Error al crear identidad con información adicional: ${responseCreateIdentityWithInfo.status}, ${errorText}`);
    }

    const dataCreateIdentityWithInfo = await responseCreateIdentityWithInfo.json();
    console.log(dataCreateIdentityWithInfo);

    // 1e: Notificación sobre nueva persona
    console.log('DATOS ANTES DE ENVIAR 1E: NOTIFICACIÓN SOBRE NUEVA PERSONA:');
    const apiUrlNotification = `https://api.orangepill.cloud/v1/identities/6541776baf124a6927e97377/person/message/email`;
    console.log('URL de Notificación:', apiUrlNotification);

    const notificationHtml = `<b>${firstName} ${lastName}</b> ha sido creado en el SalvadorSV. Su número de celular es ${numberWhatsapp} y su email es ${email}.`;

    const fetchOptionsNotification = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        content: {
          subject: 'Nuevo usuario en SalvadorSV',
          html: notificationHtml
        }
      })
    };

    console.log('BODY 1E:', fetchOptionsNotification.body);

    const responseNotification = await fetch(apiUrlNotification, fetchOptionsNotification);

    if (!responseNotification.ok) {
      const errorText = await responseNotification.text();
      throw new Error(`Error al enviar notificación: ${responseNotification.status}, ${errorText}`);
    }

    const dataNotification = await responseNotification.json();
    console.log(dataNotification);

    // Comprobar si la notificación fue exitosa
    if (dataNotification.messages && dataNotification.messages.length > 0 && typeof dataNotification.messages[0].status === 'object') {
      // Todas las operaciones fueron exitosas
      return 200;
    } else {
      // Algo salió mal en la notificación
      throw new Error(`Error de red: ${responseNotification.status}`);
    }
  } catch (error) {
    console.error('Error en la solicitud FETCH:', error);
    throw new Error('Error en la solicitud FETCH:', error);
  }
}

module.exports = createUserAndUpdateIdentity;
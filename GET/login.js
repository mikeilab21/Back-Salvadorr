const fetch = require('node-fetch');
const { encode } = require('base-64');

const realmKey = '5c179f4a-a1b9-4945-a0fb-2c3fc9534d17';

// Variable global para almacenar el identityId
let globalIdentityId = null;

async function loginAndGetIdentity(username, password) {
  // 2a: Login User
  const userApiKey = encode(`${realmKey}:${username}:${password}`);

  // 2b: Login + Recuperar Identity
  const apiUrlGetIdentity = 'https://api.orangepill.cloud/v1/users?populate=identity';

  const fetchOptionsGetIdentity = {
    method: 'GET',
    headers: {
      'x-api-key': userApiKey
    }
  };

  try {
    // Mostrar datos antes de enviar
    console.log('DATOS ANTES DE ENVIAR 2A Y 2B: LOGIN Y RECUPERAR IDENTITY:');
    console.log('USER-X-API-KEY:', userApiKey);

    const responseGetIdentity = await fetch(apiUrlGetIdentity, fetchOptionsGetIdentity);

    const dataLogin = await responseGetIdentity.json();
    console.log(dataLogin);

    // Imprime el objeto identity de manera más detallada
    console.log('Identity Object:', JSON.stringify(dataLogin.rows[0].identity, null, 2));
    
    if (responseGetIdentity.ok) {
      const identityInfo = dataLogin.rows[0].identity;

      // Almacena el identityId en la variable global
      globalIdentityId = identityInfo.id;

      return {
        success: true,
        identityId: globalIdentityId,
      };
    } else {
      throw new Error(`Error de red: ${responseGetIdentity.status}`);
    }

  } catch (error) {
    console.error('Error en la solicitud FETCH:', error);
    throw new Error(`Error en la solicitud FETCH:`, error);
  }
}

module.exports = { loginAndGetIdentity, getGlobalIdentityId: () => globalIdentityId };
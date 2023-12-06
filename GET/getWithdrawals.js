const fetch = require('node-fetch');
const apiKey = 'NWMxNzlmNGEtYTFiOS00OTQ1LWEwZmItMmMzZmM5NTM0ZDE3OlN2ZXgwNzcwQGdtYWlsLmNvbTpQQHNzdzByZA==';

// Importa la función para obtener el identityId
const { getGlobalIdentityId } = require('./login');

async function getWithdrawalsByIdentityId() {
  // Obtén el identityId de la variable global
  const existingIdentityId = getGlobalIdentityId();

  if (existingIdentityId) {
    const apiUrl = `https://api.orangepill.cloud/v1/transactions/all?scope=-own,all&query={"type":"withdrawal","source.holder":"${existingIdentityId}"}`;

    // Muestra el apiUrl en la consola antes de hacer la solicitud FETCH
    console.log('API URL:', apiUrl);

    const fetchOptions = {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    };

    try {
      const response = await fetch(apiUrl, fetchOptions);

      if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error en la solicitud FETCH:', error);
    }
  } else {
    console.error('IdentityId no disponible');
    return null;
  }
}

module.exports = getWithdrawalsByIdentityId;
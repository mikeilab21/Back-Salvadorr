const fetch = require('node-fetch');

const apiKey = 'NWMxNzlmNGEtYTFiOS00OTQ1LWEwZmItMmMzZmM5NTM0ZDE3OlN2ZXgwNzcwQGdtYWlsLmNvbTpQQHNzdzByZA==';

async function getSendsFromByIdentityId(identityId) {  
  const apiUrl = `https://api.orangepill.cloud/v1/transactions/all?scope=-own,all&query={"type":"send","destination.holder":"${identityId}"}`;


  const fetchOptions = {
    method: 'GET',
    headers: {
      'x-api-key': apiKey  // Agregar el encabezado x-api-key
    }
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
}

module.exports = getSendsFromByIdentityId;
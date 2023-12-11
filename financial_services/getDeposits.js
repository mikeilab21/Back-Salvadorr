// Importaciones
const fetch = require('node-fetch');
const { getGlobalIdentityId } = require('../registration_login_services/login');
const { getUniqueUserApiKey } = require('../registration_login_services/login');
const { transformarFechaCreacion } = require('../formatting_services/transformDateFormat');

// Obtener los depositos por IdentityId
async function getDeposits() {
  const existingIdentityId = getGlobalIdentityId();
  const userApiKey = getUniqueUserApiKey();

  if (existingIdentityId) {
    const apiUrl = `https://api.orangepill.cloud/v1/transactions/all?scope=-own,all&query={"type":"deposit","destination.holder":"${existingIdentityId}"}`;

    const fetchOptions = {
      method: 'GET',
      headers: {
        'x-api-key': userApiKey,
      },
    };

    try {
      const response = await fetch(apiUrl, fetchOptions);

      if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
      }

      const data = await response.json();

      // Utiliza el servicio para transformar la fecha de creación
      const dataConFechaTransformada = data.map(transformarFechaCreacion);

      return dataConFechaTransformada;
    } catch (error) {
      console.error('Error en la solicitud FETCH:', error.message);
      throw error; 
    }
  } else {
    console.error('IdentityId no disponible');
    return null;
  }
}

module.exports = getDeposits;
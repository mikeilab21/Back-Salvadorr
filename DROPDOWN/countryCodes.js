const axios = require('axios');

async function getInternationalCodes() {
  try {
    const response = await axios.get('https://cuik-projects.github.io/country-list/countries.json');
    const countries = response.data;

    const mobileCodes = countries.map(country => ({
      name: country.name,
      dial_code: country.dial_code,
      code: country.code,
      emoji: country.emoji
    }));

    return mobileCodes;
  } catch (error) {
    console.error('Error al recuperar códigos móviles internacionales:', error);
    throw new Error('Error al recuperar códigos móviles internacionales');
  }
}

module.exports = getInternationalCodes;
const { encode } = require('base-64');

const realmKey = '5c179f4a-a1b9-4945-a0fb-2c3fc9534d17';  // Reemplazar con el valor correcto

function base64Encode(username, password) {
  const userApiKey = encode(`${realmKey}:${username}:${password}`);
  return userApiKey;
}

module.exports = base64Encode;
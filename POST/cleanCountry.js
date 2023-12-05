// cleanCountryCodeService.js
function cleanCountryCode(countryCode, phoneNumber) {
    // Quitar el "+" del countryCode y eliminar espacios al principio y al final
    const cleanedCountryCode = countryCode.replace(/\+/g, '').trim();
  
    // Puedes hacer algo con el phoneNumber si es necesario
    // Por ejemplo, concatenarlo con el cleanedCountryCode y eliminar espacios al principio y al final
    const cleanedPhoneNumber = (cleanedCountryCode + phoneNumber).trim();
  
    return cleanedPhoneNumber;
  }
  
  module.exports = cleanCountryCode;
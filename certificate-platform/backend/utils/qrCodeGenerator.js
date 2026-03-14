const QRCode = require('qrcode');

/**
 * Generates a QR code as a base64 data URL
 * @param {string} certificateId
 * @param {string} frontendUrl
 * @returns {Promise<string>} base64 data URL
 */
const generateQRCode = async (certificateId, frontendUrl) => {
  const verificationUrl = `${frontendUrl}/verify/${certificateId}`;
  const qrDataURL = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: 'H',
    margin: 1,
    color: { dark: '#1e293b', light: '#ffffff' },
  });
  return qrDataURL;
};

module.exports = { generateQRCode };

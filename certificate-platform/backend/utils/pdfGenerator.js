const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

/**
 * Generate a professional internship certificate PDF
 * @param {Object} cert - Certificate document
 * @param {string} frontendUrl - Base URL for QR code
 * @returns {PDFDocument} - Piped pdf stream
 */
const generateCertificatePDF = async (cert, frontendUrl) => {
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margins: { top: 30, bottom: 30, left: 40, right: 40 },
  });

  const W = 841.89;
  const H = 595.28;

  // ── Background ──────────────────────────────────────────────────────────────
  doc.rect(0, 0, W, H).fill('#0f172a');

  // Gradient overlay strips
  doc.rect(0, 0, W, 8).fill('#6366f1');
  doc.rect(0, H - 8, W, 8).fill('#6366f1');
  doc.rect(0, 0, 8, H).fill('#6366f1');
  doc.rect(W - 8, 0, 8, H).fill('#6366f1');

  // Inner border
  doc.rect(20, 20, W - 40, H - 40).lineWidth(1.5).stroke('#6366f1');

  // Decorative corner circles
  const cornerRadius = 30;
  const corners = [
    [40, 40], [W - 40, 40], [40, H - 40], [W - 40, H - 40],
  ];
  corners.forEach(([x, y]) => {
    doc.circle(x, y, cornerRadius).lineWidth(1).stroke('#6366f150');
    doc.circle(x, y, cornerRadius / 2).lineWidth(0.5).stroke('#6366f180');
  });

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#a5b4fc')
    .text('CERTIFICATE OF INTERNSHIP COMPLETION', 0, 55, { align: 'center' });

  // Decorative rule
  doc.moveTo(160, 75).lineTo(W - 160, 75).lineWidth(1).stroke('#6366f1');

  // ── Organization Name ───────────────────────────────────────────────────────
  doc.font('Helvetica-Bold').fontSize(22).fillColor('#e0e7ff')
    .text(cert.organizationName, 0, 88, { align: 'center' });

  // ── "This is to certify that" ────────────────────────────────────────────────
  doc.font('Helvetica').fontSize(12).fillColor('#94a3b8')
    .text('This is to certify that', 0, 130, { align: 'center' });

  // ── Student Name ────────────────────────────────────────────────────────────
  doc.font('Helvetica-Bold').fontSize(34).fillColor('#ffffff')
    .text(cert.studentName, 0, 150, { align: 'center' });

  // Underline
  const nameWidth = doc.widthOfString(cert.studentName, { fontSize: 34 });
  const nameX = (W - nameWidth) / 2;
  doc.moveTo(nameX, 191).lineTo(nameX + nameWidth, 191).lineWidth(1.5).stroke('#6366f1');

  // ── Body text ────────────────────────────────────────────────────────────────
  doc.font('Helvetica').fontSize(12).fillColor('#94a3b8')
    .text('has successfully completed an internship in', 0, 205, { align: 'center' });

  doc.font('Helvetica-Bold').fontSize(18).fillColor('#818cf8')
    .text(cert.internshipDomain, 0, 225, { align: 'center' });

  const startStr = new Date(cert.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const endStr = new Date(cert.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  doc.font('Helvetica').fontSize(12).fillColor('#94a3b8')
    .text(`from`, 0, 255, { align: 'center' });

  doc.font('Helvetica-Bold').fontSize(13).fillColor('#e0e7ff')
    .text(`${startStr}  —  ${endStr}`, 0, 272, { align: 'center' });

  // ── Divider ──────────────────────────────────────────────────────────────────
  doc.moveTo(160, 305).lineTo(W - 160, 305).lineWidth(0.5).stroke('#334155');

  // ── Certificate ID ───────────────────────────────────────────────────────────
  doc.font('Helvetica').fontSize(10).fillColor('#475569')
    .text(`Certificate ID: ${cert.certificateId}`, 60, 320);

  // ── Signatures ───────────────────────────────────────────────────────────────
  const sigY = 380;
  // Left signature
  doc.moveTo(80, sigY).lineTo(240, sigY).lineWidth(1).stroke('#334155');
  doc.font('Helvetica').fontSize(10).fillColor('#64748b').text('Authorized Signatory', 80, sigY + 6);
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#475569').text(cert.organizationName, 80, sigY + 18);

  // Right signature
  doc.moveTo(W - 240, sigY).lineTo(W - 80, sigY).lineWidth(1).stroke('#334155');
  doc.font('Helvetica').fontSize(10).fillColor('#64748b').text('Program Director', W - 240, sigY + 6);
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#475569').text('Internship Division', W - 240, sigY + 18);

  // ── QR Code ──────────────────────────────────────────────────────────────────
  const verifyUrl = `${frontendUrl}/verify/${cert.certificateId}`;
  const qrBuffer = await QRCode.toBuffer(verifyUrl, {
    type: 'png',
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 256,
    color: { dark: '#e0e7ff', light: '#1e293b' },
  });

  const qrSize = 90;
  const qrX = (W - qrSize) / 2;
  const qrY = sigY - 10;
  doc.rect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12).fill('#1e293b');
  doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
  doc.font('Helvetica').fontSize(7.5).fillColor('#475569')
    .text('Scan to verify', qrX - 6, qrY + qrSize + 4, { width: qrSize + 12, align: 'center' });

  // ── Footer ───────────────────────────────────────────────────────────────────
  doc.font('Helvetica').fontSize(8).fillColor('#334155')
    .text(
      `This certificate was digitally generated and can be verified at ${frontendUrl}/verify/${cert.certificateId}`,
      60, H - 50,
      { align: 'center', width: W - 120 }
    );

  doc.end();
  return doc;
};

module.exports = { generateCertificatePDF };

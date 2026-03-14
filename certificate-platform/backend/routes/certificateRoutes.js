const express = require('express');
const router = express.Router();
const {
  uploadExcel,
  getAllCertificates,
  updateCertificate,
  deleteCertificate,
  verifyCertificate,
  downloadCertificate,
  getStats,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// Public routes
router.get('/verify/:certificateId', verifyCertificate);
router.get('/download/:certificateId', downloadCertificate);

// Admin routes
router.post('/upload-excel', protect, adminOnly, uploadExcel);
router.get('/stats', protect, adminOnly, getStats);
router.get('/', protect, adminOnly, getAllCertificates);
router.put('/:id', protect, adminOnly, updateCertificate);
router.delete('/:id', protect, adminOnly, deleteCertificate);

module.exports = router;

const multer = require('multer');
const Certificate = require('../models/Certificate');
const { parseExcel } = require('../utils/excelParser');
const { generateQRCode } = require('../utils/qrCodeGenerator');
const { generateCertificatePDF } = require('../utils/pdfGenerator');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Multer memory storage (no disk write)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/octet-stream', // sent by curl and some OS tools
    ];
    const allowedExts = ['.xlsx', '.xls'];
    const ext = '.' + (file.originalname || '').split('.').pop().toLowerCase();
    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
    }
  },
});

// @desc  Upload Excel and bulk-insert certificates
// @route POST /api/certificates/upload-excel
const uploadExcel = [
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const { records, errors } = parseExcel(req.file.buffer);

      if (records.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid records found in the Excel file',
          errors,
        });
      }

      // Generate QR codes and detect duplicates
      const existingIds = new Set(
        (await Certificate.find({ certificateId: { $in: records.map((r) => r.certificateId) } }).select('certificateId')).map(
          (c) => c.certificateId
        )
      );

      const duplicates = [];
      const newRecords = [];

      for (const record of records) {
        if (existingIds.has(record.certificateId)) {
          duplicates.push(record.certificateId);
        } else {
          const qrCodeURL = await generateQRCode(record.certificateId, FRONTEND_URL);
          newRecords.push({ ...record, qrCodeURL });
        }
      }

      let inserted = [];
      if (newRecords.length > 0) {
        inserted = await Certificate.insertMany(newRecords, { ordered: false });
      }

      res.status(201).json({
        success: true,
        message: `${inserted.length} certificate(s) created successfully`,
        inserted: inserted.length,
        duplicates: duplicates.length,
        duplicateIds: duplicates,
        parseErrors: errors,
      });
    } catch (error) {
      next(error);
    }
  },
];

// @desc  Get all certificates (paginated + search)
// @route GET /api/certificates
const getAllCertificates = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { studentName: { $regex: search, $options: 'i' } },
            { certificateId: { $regex: search, $options: 'i' } },
            { internshipDomain: { $regex: search, $options: 'i' } },
            { organizationName: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [certificates, total] = await Promise.all([
      Certificate.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Certificate.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: certificates,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Update certificate
// @route PUT /api/certificates/:id
const updateCertificate = async (req, res, next) => {
  try {
    const { studentName, internshipDomain, organizationName, startDate, endDate } = req.body;

    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    if (studentName) cert.studentName = studentName;
    if (internshipDomain) cert.internshipDomain = internshipDomain;
    if (organizationName) cert.organizationName = organizationName;
    if (startDate) cert.startDate = new Date(startDate);
    if (endDate) cert.endDate = new Date(endDate);

    // Regenerate QR if needed (cert ID unchanged)
    cert.qrCodeURL = await generateQRCode(cert.certificateId, FRONTEND_URL);

    await cert.save();

    res.json({ success: true, data: cert });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete certificate
// @route DELETE /api/certificates/:id
const deleteCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    res.json({ success: true, message: 'Certificate deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc  Verify certificate by certificateId (public)
// @route GET /api/certificates/verify/:certificateId
const verifyCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findOne({
      certificateId: req.params.certificateId.toUpperCase(),
    });

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.json({ success: true, data: cert });
  } catch (error) {
    next(error);
  }
};

// @desc  Download certificate PDF (public)
// @route GET /api/certificates/download/:certificateId
const downloadCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findOne({
      certificateId: req.params.certificateId.toUpperCase(),
    });

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="certificate-${cert.certificateId}.pdf"`
    );

    const doc = await generateCertificatePDF(cert, FRONTEND_URL);
    doc.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc  Get dashboard analytics
// @route GET /api/certificates/stats
const getStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, thisMonth, domainCounts] = await Promise.all([
      Certificate.countDocuments(),
      Certificate.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Certificate.aggregate([
        { $group: { _id: '$internshipDomain', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
    ]);

    // Monthly trend for last 6 months
    const monthlyCounts = await Certificate.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(now.getMonth() - 5)),
          },
        },
      },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      success: true,
      data: {
        total,
        thisMonth,
        domainDistribution: domainCounts,
        monthlyTrend: monthlyCounts,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadExcel,
  getAllCertificates,
  updateCertificate,
  deleteCertificate,
  verifyCertificate,
  downloadCertificate,
  getStats,
};

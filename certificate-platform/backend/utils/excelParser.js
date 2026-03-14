const XLSX = require('xlsx');

const REQUIRED_COLUMNS = [
  'CertificateID',
  'StudentName',
  'InternshipDomain',
  'OrganizationName',
  'StartDate',
  'EndDate',
];

/**
 * Parse Excel buffer and return array of certificate records
 * @param {Buffer} buffer
 * @returns {{ records: Array, errors: Array }}
 */
const parseExcel = (buffer) => {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { raw: false, dateNF: 'yyyy-mm-dd' });

  const errors = [];
  const records = [];

  if (rows.length === 0) {
    throw new Error('Excel file is empty or has no data rows');
  }

  // Validate columns
  const firstRow = rows[0];
  const missingCols = REQUIRED_COLUMNS.filter((col) => !(col in firstRow));
  if (missingCols.length > 0) {
    throw new Error(`Missing required columns: ${missingCols.join(', ')}`);
  }

  rows.forEach((row, i) => {
    const rowNum = i + 2; // Excel row (1-indexed header + 1)
    const missingFields = REQUIRED_COLUMNS.filter((col) => !row[col] || String(row[col]).trim() === '');

    if (missingFields.length > 0) {
      errors.push({ row: rowNum, error: `Missing fields: ${missingFields.join(', ')}` });
      return;
    }

    const startDate = new Date(row.StartDate);
    const endDate = new Date(row.EndDate);

    if (isNaN(startDate.getTime())) {
      errors.push({ row: rowNum, error: 'Invalid StartDate format' });
      return;
    }
    if (isNaN(endDate.getTime())) {
      errors.push({ row: rowNum, error: 'Invalid EndDate format' });
      return;
    }
    if (endDate <= startDate) {
      errors.push({ row: rowNum, error: 'EndDate must be after StartDate' });
      return;
    }

    records.push({
      certificateId: String(row.CertificateID).trim().toUpperCase(),
      studentName: String(row.StudentName).trim(),
      internshipDomain: String(row.InternshipDomain).trim(),
      organizationName: String(row.OrganizationName).trim(),
      startDate,
      endDate,
    });
  });

  return { records, errors };
};

module.exports = { parseExcel };

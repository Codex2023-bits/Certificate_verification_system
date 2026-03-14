// Script to create a test Excel file and upload it
const XLSX = require('xlsx');
const https = require('http');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Create workbook
const wb = XLSX.utils.book_new();
const data = [
  ['CertificateID', 'StudentName', 'InternshipDomain', 'OrganizationName', 'StartDate', 'EndDate'],
  ['CERT-2024-001', 'Alice Johnson', 'Web Development', 'TechCorp Ltd', '2024-01-15', '2024-04-15'],
  ['CERT-2024-002', 'Bob Smith', 'Data Science', 'DataViz Inc', '2024-02-01', '2024-05-01'],
  ['CERT-2024-003', 'Carol White', 'Machine Learning', 'AI Solutions', '2024-03-01', '2024-06-30'],
  ['CERT-2024-004', 'David Lee', 'Cybersecurity', 'SecureNet', '2024-01-10', '2024-03-10'],
  ['CERT-2024-005', 'Eva Martinez', 'Cloud Computing', 'CloudBase LLC', '2024-04-01', '2024-07-01'],
];
const ws = XLSX.utils.aoa_to_sheet(data);
XLSX.utils.book_append_sheet(wb, ws, 'Certificates');

const filePath = path.join(__dirname, 'test-certs.xlsx');
XLSX.writeFile(wb, filePath);
console.log('✅ Excel file created:', filePath);
console.log('\nTo upload via curl:\ncurl -X POST http://localhost:5000/api/certificates/upload-excel -H "Authorization: Bearer YOUR_TOKEN" -F "file=@test-certs.xlsx"');

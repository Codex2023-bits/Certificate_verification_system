# 🎓 Certificate Verification Platform

A production-ready full-stack MERN application for issuing internship certificates and allowing anyone to verify them via Certificate ID or QR code.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Bulk Upload** | Upload Excel files to generate hundreds of certificates instantly |
| **QR Code Verification** | Every certificate contains a scannable QR code |
| **PDF Download** | Download professional PDF certificates |
| **Analytics Dashboard** | Charts for monthly trends and domain distribution |
| **Role-Based Auth** | JWT-secured admin and student accounts |
| **Public Verification** | Anyone can verify a certificate without logging in |

---

## 🗂️ Project Structure

```
certificate-platform/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # authController, certificateController
│   ├── middleware/       # auth, admin, errorHandler
│   ├── models/          # User, Certificate
│   ├── routes/          # authRoutes, certificateRoutes
│   ├── utils/           # pdfGenerator, qrCodeGenerator, excelParser
│   ├── .env             # Environment variables
│   └── server.js        # Express entry point
└── frontend/
    └── src/
        ├── components/  # Navbar, ProtectedRoute
        ├── context/     # AuthContext
        ├── pages/       # Home, Login, Register, Verify, VerifyResult
        │   └── admin/   # Dashboard, UploadExcel, Certificates
        └── services/    # api.js (Axios)
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Clone & Navigate

```bash
git clone <repo-url>
cd certificate-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create/edit `.env`:

```env
MONGO_URI=mongodb://localhost:27017/cert_platform
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev   # development (nodemon)
# or
npm start     # production
```

Backend runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## 📊 Excel Upload Format

Your Excel file must have these **exact column headers** (first row):

| Column | Format | Example |
|---|---|---|
| `CertificateID` | Any unique string | `CERT-2024-001` |
| `StudentName` | Full name | `John Doe` |
| `InternshipDomain` | Domain/skill | `Web Development` |
| `OrganizationName` | Company name | `Tech Corp Ltd` |
| `StartDate` | YYYY-MM-DD | `2024-01-15` |
| `EndDate` | YYYY-MM-DD | `2024-04-15` |

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Certificates
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/certificates/upload-excel` | Admin | Bulk upload |
| GET | `/api/certificates` | Admin | List all (paginated) |
| PUT | `/api/certificates/:id` | Admin | Update |
| DELETE | `/api/certificates/:id` | Admin | Delete |
| GET | `/api/certificates/verify/:certId` | Public | Verify |
| GET | `/api/certificates/download/:certId` | Public | Download PDF |
| GET | `/api/certificates/stats` | Admin | Dashboard stats |

---

## 🛡️ Security

- JWT tokens with 7-day expiry
- bcrypt password hashing (12 rounds)
- Role-based route protection (admin/student)
- Request file validation (Excel only, max 10 MB)
- Duplicate certificate ID detection

---

## 🌐 Deployment

### Backend (Render / Railway)
1. Set environment variables in your hosting dashboard
2. Set `MONGO_URI` to your MongoDB Atlas connection string
3. Set `FRONTEND_URL` to your deployed frontend URL
4. Build command: `npm install`
5. Start command: `node server.js`

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your deployed backend URL
2. Build command: `npm run build`
3. Output directory: `dist`

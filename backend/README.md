# 📬 Portfolio Contact Form — Backend

Production-ready Node.js + Express.js backend for the portfolio contact form.  
Sends styled HTML emails via Gmail SMTP using Nodemailer.

---

## 📁 Folder Structure

```
backend/
│
├── server.js                  # Express app entry point
├── package.json               # Dependencies & scripts
├── .env                       # Environment variables (secrets — NOT committed)
├── .gitignore                 # Files excluded from Git
│
├── config/
│   └── mail.js                # Nodemailer SMTP transporter configuration
│
├── controllers/
│   └── contactController.js   # Email sending business logic
│
├── routes/
│   └── contactRoutes.js       # API route definitions
│
├── middleware/
│   ├── validateInput.js       # Input validation & sanitization
│   └── rateLimiter.js         # Rate limiting (global + contact-specific)
│
├── utils/
│   └── emailTemplate.js       # HTML email templates
│
└── README.md                  # This file
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Open the `.env` file and fill in your credentials:

```env
PORT=5000
EMAIL_USER=joshivarun089@gmail.com
EMAIL_PASS=your_gmail_app_password_here
FRONTEND_URL=http://localhost:5500,http://127.0.0.1:5500
```

> ⚠️ **Never use your regular Gmail password.** You must use a **Gmail App Password** (see below).

### 3. Start the Server

**Development** (auto-restarts on file changes):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

### 4. Test the Health Endpoint

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is healthy and running.",
  "timestamp": "2026-08-01T00:00:00.000Z",
  "uptime": "42 seconds"
}
```

---

## 🔑 Gmail App Password Setup

Google requires a special **App Password** instead of your regular password when using SMTP with third-party apps.

### Steps:

1. Go to [Google Account Security](https://myaccount.google.com/security).
2. Enable **2-Step Verification** if not already enabled.
3. Go to [App Passwords](https://myaccount.google.com/apppasswords).
4. Select **Mail** as the app and **Other** as the device (name it "Portfolio Backend").
5. Click **Generate**.
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`).
7. Paste it into your `.env` file as `EMAIL_PASS` (**without spaces**).

```env
EMAIL_PASS=abcdefghijklmnop
```

---

## 📡 API Documentation

### `POST /api/contact`

Send a contact form submission.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Collaboration Opportunity",
  "message": "Hi Varun, I loved your portfolio! Let's connect."
}
```

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Email sent successfully."
}
```

**Validation Error** (`422 Unprocessable Entity`):
```json
{
  "success": false,
  "message": "Validation failed. Please check your input.",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address." },
    { "field": "message", "message": "Message must be between 10 and 5000 characters." }
  ]
}
```

**Server Error** (`500 Internal Server Error`):
```json
{
  "success": false,
  "message": "Unable to send email. Please try again later."
}
```

**Rate Limited** (`429 Too Many Requests`):
```json
{
  "success": false,
  "message": "Too many messages sent. Please try again after 15 minutes."
}
```

---

### `GET /api/health`

Check if the server is running.

**Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Server is healthy and running.",
  "timestamp": "2026-08-01T00:00:00.000Z",
  "uptime": "120 seconds"
}
```

---

## 🔒 Security Features

| Feature | Implementation |
|---|---|
| **Helmet** | Sets secure HTTP headers (CSP, HSTS, X-Frame, etc.) |
| **CORS** | Restricts API access to allowed frontend origins only |
| **Rate Limiting** | Global: 100 req/15 min • Contact: 5 req/15 min per IP |
| **Input Validation** | express-validator checks all fields, rejects invalid data |
| **Input Sanitization** | Trims whitespace, escapes HTML entities to prevent XSS |
| **Body Size Limit** | JSON payloads capped at 10 KB to prevent abuse |
| **Environment Variables** | All secrets stored in `.env`, never hardcoded |
| **Graceful Shutdown** | Closes connections cleanly on SIGTERM/SIGINT |

---

## 🌐 Frontend Integration

Add a `subject` field to your contact form HTML, then use the following JavaScript to connect the form to the backend:

```javascript
// Replace with your deployed backend URL in production
const API_URL = 'http://localhost:5000/api/contact';

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  // Disable button and show loading
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  const payload = {
    name: document.getElementById('formName').value.trim(),
    email: document.getElementById('formEmail').value.trim(),
    subject: document.getElementById('formSubject').value.trim(),
    message: document.getElementById('formMessage').value.trim(),
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success) {
      alert('✅ Message sent successfully!');
      contactForm.reset();
    } else {
      alert('❌ ' + (data.message || 'Something went wrong.'));
    }
  } catch (error) {
    alert('❌ Network error. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});
```

---

## ☁️ Deployment on Render

### 1. Push to GitHub

```bash
git add .
git commit -m "Add contact form backend"
git push origin main
```

### 2. Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New → Web Service**.
3. Connect your GitHub repository.
4. Configure:
   - **Name**: `portfolio-contact-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add **Environment Variables** in the Render dashboard:
   - `EMAIL_USER` = `joshivarun089@gmail.com`
   - `EMAIL_PASS` = your Gmail App Password
   - `FRONTEND_URL` = your deployed portfolio URL (e.g., `https://varunjoshi.dev`)
6. Click **Deploy**.

### 3. Update Frontend

After deployment, update `API_URL` in your frontend JavaScript to point to the Render URL:

```javascript
const API_URL = 'https://portfolio-contact-backend.onrender.com/api/contact';
```

---

## 🧪 Test with cURL

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "This is a test message from cURL."
  }'
```

---

## 📜 License

MIT © Varun Joshi

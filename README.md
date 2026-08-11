# 🌐 Varun Joshi — Personal Portfolio & CV Viewer

[![GitHub repo](https://img.shields.io/badge/GitHub-portfolio--website-181717?style=flat&logo=github)](https://github.com/VarunJoshi591/portfolio-website)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat&logo=vercel)](https://github.com/VarunJoshi591/portfolio-website)

A modern, responsive, and high-performance personal portfolio website and dedicated CV document viewer. Showcases software engineering projects, technical skill set, academic background, and provides a serverless backend for contact form handling.

---

## 👤 About Me

**Varun Joshi**  
M.Sc. Computer Science Student | Aspiring Full-Stack Software Engineer  
📍 **Location:** Pune, Maharashtra, India  
📧 **Email:** [joshivarun089@gmail.com](mailto:joshivarun089@gmail.com)  
💼 **LinkedIn:** [varun-joshi-287990306](https://www.linkedin.com/in/varun-joshi-287990306/)  
🐙 **GitHub:** [@VarunJoshi591](https://github.com/VarunJoshi591)  

---

## ✨ Features

- 📱 **Fully Responsive Layout:** Optimized across mobile, tablet, and desktop viewports.
- 🎨 **Modern Glassmorphism Design:** Dark theme, fluid typography, smooth section scrolling, and micro-animations.
- 📄 **Dedicated In-Browser CV Viewer (`/cv`):** Dedicated document viewer page that opens in a new tab without interrupting portfolio browsing.
  - **Inline Viewing:** Renders PDF directly in the browser.
  - **Zoom & Controls:** Interactive Zoom In (`+`), Zoom Out (`-`), Reset (`100%`), and Fullscreen (`⛶`) toggles.
  - **Quick Actions:** Direct Download CV (`⬇`) and Open Raw PDF (`↗`) buttons.
  - **Mobile Fallback:** Clean fallback UI for devices/browsers restricting inline PDF embedding.
- 🛠️ **Technical Skills Grid:** Interactive grid showing HTML, CSS, JavaScript, Git/GitHub, C, C++, DSA, and Python.
- 💼 **Projects Showcase:** Highlighted full-stack and web development projects with GitHub code links.
- 📩 **Serverless Contact Form:** Backend contact service powered by Node.js/Express & Nodemailer with rate limiting and input validation.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Frontend** | HTML5, Vanilla CSS3 (Custom Tokens & Glassmorphism), Vanilla JS (ES6+) |
| **CV Viewer** | Custom PDF Viewport, URL Routing Rewrite (`/cv` -> `/cv.html`), CSS Transform Zoom Engine |
| **Backend & APIs** | Node.js, Express.js, Nodemailer, CORS, Express-Validator, Helmet, Express-Rate-Limit |
| **Serverless & Hosting**| Vercel Serverless Functions (`/api/*`), Vercel Static Hosting |
| **Tooling & Ops** | Git, GitHub, npm |

---

## 📁 Project Structure

```text
portfolio-website/
├── api/                      # Vercel serverless functions
│   ├── contact.js            # Contact form submission serverless function
│   └── health.js             # API health check serverless function
├── assets/
│   ├── css/                  # Custom design system & stylesheet (style.css)
│   ├── js/                   # Main JavaScript & contact form integration (main.js)
│   ├── images/               # Project screenshots & profile images
│   └── resume/               # Official PDF Resume (Varun_Joshi_Resume.pdf)
├── backend/                  # Local Express development server & microservice
│   ├── config/               # Nodemailer SMTP transporter configuration
│   ├── controllers/          # Contact controller business logic
│   ├── middleware/           # Rate limiting & input validation middleware
│   ├── routes/               # Express API routes
│   ├── utils/                # Styled HTML email templates
│   └── server.js             # Express API server entry point
├── cv.html                   # Dedicated CV Document Viewer page (/cv)
├── index.html                # Main Portfolio Homepage
├── vercel.json               # Vercel routing & serverless rewrites
├── package.json              # Root dependencies & npm scripts
└── README.md                 # Project documentation
```

---

## 📄 CV Document Viewer (`/cv`)

The CV Viewer (`cv.html`) provides recruiters with a direct document viewing experience:

- **Route:** `/cv` (rewritten via `vercel.json` to `/cv.html`)
- **Structure:**
  - **Header Left:** `← Back to Portfolio` button
  - **Header Center:** `👁️ Varun Joshi — Curriculum Vitae` title
  - **Header Right Toolbar:** Zoom controls (`+` / `-` / `100%`), Fullscreen button, `Open Raw PDF`, and `Download CV`
  - **Main Viewport:** Full-bleed embedded PDF container with CSS transform scale zoom engine and fallback error card

---

## 📡 Backend API Documentation

### `POST /api/contact`
Send a contact message.

**Request Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Job Opportunity",
  "message": "Hi Varun, let's discuss a full-stack role!"
}
```

**Responses:**
- `200 OK`: `{"success": true, "message": "Email sent successfully."}`
- `422 Unprocessable Entity`: Input validation errors.
- `429 Too Many Requests`: Rate limit exceeded (5 requests per 15 mins).

### `GET /api/health`
Health check endpoint returning system status and uptime.

---

## 🔒 Security Features

| Feature | Implementation |
|---|---|
| **Helmet** | Sets secure HTTP headers (CSP, HSTS, X-Frame-Options) |
| **CORS** | Restricts API access to allowed origins |
| **Rate Limiting** | Global: 100 req/15 min • Contact: 5 req/15 min per IP |
| **Input Validation** | express-validator checks all fields |
| **Input Sanitization** | Trims whitespace and escapes HTML entities |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VarunJoshi591/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional for local email testing):**
   Create a `.env` file in the root or `backend/` directory:
   ```env
   PORT=5000
   EMAIL_USER=joshivarun089@gmail.com
   EMAIL_PASS=your_gmail_app_password
   FRONTEND_URL=http://localhost:5500,http://127.0.0.1:5500
   ```

4. **Start local development server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   - Homepage: `http://localhost:5000` (or open `index.html`)
   - CV Viewer: `http://localhost:5000/cv.html`

---

## 🔑 Gmail App Password Setup

Google requires a **Gmail App Password** for SMTP dispatch:
1. Go to [Google Account Security](https://myaccount.google.com/security).
2. Enable **2-Step Verification**.
3. Go to [App Passwords](https://myaccount.google.com/apppasswords).
4. Create an App Password for **Mail**.
5. Copy the 16-character code into your `.env` as `EMAIL_PASS` (without spaces).

---

## 🌐 Deployment

The repository is pre-configured for **Vercel**:
- `index.html` and `cv.html` are served statically.
- `/cv` rewrites automatically to `/cv.html`.
- `/api/contact` and `/api/health` execute as serverless Node.js functions.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Designed & Developed with ❤️ by <strong>Varun Joshi</strong></p>

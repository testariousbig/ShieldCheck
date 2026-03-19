# Shield🛡️Check 

> **Vulnerability Scanner for npm packages** - A modern, fast, and intuitive security analysis tool for JavaScript/TypeScript projects.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=flat&logo=vercel)](https://shield-check.vercel.app/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![API](https://img.shields.io/badge/OSV.dev-API_Integration-blue?style=flat)](https://osv.dev/)

ShieldCheck is a lightweight, frontend-only security tool designed to bridge the gap between development and offensive security. It allows developers and Pentesters to audit `package.json` files instantly without needing a local Node.js environment.

## ✨ Features

- 🔍 **Instant Analysis** - Paste your `package.json` and get immediate results.
- 🎯 **Advanced CVSS Scoring** - Detailed breakdown for CVSS v3.0, v3.1, and v4.0 with clear severity explanations.
- 🚀 **Zero Trust / Zero Setup** - Pure frontend execution. Your data stays in your browser; only package names and versions are sent to the OSV API.
- 📱 **Responsive Design** - Optimized for both desktop deep-dives and quick mobile checks.
- 🎨 **Cyberpunk UI** - Clean dark interface with neon accents for high readability.
- 📊 **Intelligent Grouping** - Collapsible interface to manage large projects with multiple vulnerabilities.

## 🛠️ Tech Stack & Architecture

- **Frontend:** React.js + Vite for a blazing fast developer experience.
- **Styling:** Tailwind CSS for a responsive, utility-first UI.
- **Security Engine:** Integrated with Google's **OSV (Open Source Vulnerabilities)** API.
- **Deployment:** CI/CD pipeline via **Vercel**.

## 🛡️ Pentesting Use Case

Unlike `npm audit`, which requires a local installation and environment setup, **ShieldCheck** is ideal for:
- **Shadow IT Discovery:** Quickly auditing publicly exposed `package.json` files found during web reconnaissance.
- **Fast Triage:** Assessing the risk of a project's dependencies on-the-fly without cloning repositories.

## 🚀 Getting Started

### Online Usage
1. Visit the [ShieldCheck Live App](https://shield-check.vercel.app/).
2. Paste your `package.json` content.
3. Click **ANALYZE**.
4. Review the detailed security report.

### Local Development
```bash
# Clone the repository
git clone [https://github.com/testariousbig/ShieldCheck.git](https://github.com/testariousbig/ShieldCheck.git)
cd ShieldCheck

# Install dependencies
npm install

# Start development server
npm run dev
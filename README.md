A modern full-stack project built with **Node.js/Express + MongoDB** for the backend, and **Vite + React + Tailwind CSS** for the frontend.  
Includes an **admin panel**, content management for **blogs, journals, projects, services**, visitor analytics, and media uploads via **Cloudinary**.

- **Backend**: Express, Mongoose, JWT, Multer + Cloudinary, Helmet, CORS, Rate Limit, Compression  
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Axios, Ant Design, Framer Motion  

---

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Endpoints (Overview)](#api-endpoints-overview)
- [Development Notes](#development-notes)
- [Deployment Notes](#deployment-notes)
- [License](#license)

---

## Features
- **Authentication**: JWT with httpOnly cookie flow  
- **Content Management**: CRUD for Blog, Journal, Project, Service  
- **Search & Visitor Tracking**: Logs based on IP and user-agent  
- **Media Uploads**: Cloudinary + Multer + Sharp pipeline  
- **Security**: Helmet, CORS whitelist, rate limiting  
- **Interface**: Public pages and admin dashboard  

---

## Project Structure
```text
backend/
  config/           # DB and Cloudinary configs
  controller/       # Business logic (auth, blog, journal, project, service, search, visits)
  middleware/       # Upload, token verification, error handling
  models/           # Mongoose models
  routes/           # REST API routes (mounted under /api)
  server.js         # Express app with global middleware
frontend/
  src/              # React source code (components, pages, context, hooks)
  index.html        # Vite entry point
  tailwind.config.js


⸻

Getting Started

Prerequisites: Node.js 18+, npm or pnpm, a MongoDB connection, and a Cloudinary account.
	1.	Install dependencies

# install separately in each package
cd backend && npm install && cd ../frontend && npm install

	2.	Set environment variables (see below) and start the backend

# backend
cd ../backend
npm run dev
# or production
npm start

	3.	Start the frontend

cd ../frontend
npm run dev

	•	Backend default port: 5000
	•	Frontend default: Vite dev server (e.g. 5173)

⸻

Environment Variables

Backend (.env)

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_ORIGIN=https://yourfrontend.com
EXTRA_ALLOWED_ORIGINS=https://admin.yoursite.com,https://staging.yoursite.com
BASE_URL=https://yourbackend.com
VERCEL_PREVIEW_ALLOWED=1

Frontend (.env)

VITE_API_BASE_URL=https://yourbackend.com/api


⸻

Scripts

Backend (backend/package.json)
	•	npm run dev: Development with Nodemon
	•	npm start: Run with Node

Frontend (frontend/package.json)
	•	npm run dev: Vite dev server
	•	npm run build: Production build
	•	npm run preview: Preview production build locally
	•	npm run lint: ESLint check

⸻

API Endpoints (Overview)

All routes are mounted under /api.
	•	GET /api/health → Health check
	•	/api/auth → Authentication
	•	/api/blogs → Blog CRUD
	•	/api/journals → Journal CRUD
	•	/api/projects → Project CRUD
	•	/api/services → Service CRUD
	•	/api/search → Search endpoints
	•	/api/visits → Visitor tracking

For authorization and data contracts, see backend/controller/ and backend/routes/.

⸻

Development Notes
	•	Axios client in frontend/src/api.js is preconfigured with withCredentials: true and Authorization header support.
	•	When uploading with FormData, do not set Content-Type manually; the browser defines the boundary.
	•	For state-changing requests, the x-csrf-token header (if present) is automatically included.

⸻

Deployment Notes
	•	When deploying the backend (Railway, Render, Fly, Heroku, etc.), set FRONTEND_ORIGIN and EXTRA_ALLOWED_ORIGINS correctly.
	•	When deploying the frontend (Vercel, Netlify, etc.), configure VITE_API_BASE_URL to point to the backend’s https://.../api.
	•	To allow Vercel previews, set VERCEL_PREVIEW_ALLOWED=1 in the backend .env.

⸻

License

This repository is distributed under the ISC License.

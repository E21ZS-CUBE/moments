# Our Moments - Full Stack Application

A beautiful, full-stack personal/romantic web application with a modern React frontend and Node.js backend.

## ✨ Features

### Frontend
- 🎵 **Music Control Widget** - Glassmorphism mini-player with play/pause, volume control
- 🧭 **Modern Navbar** - Glassmorphism design with smooth animations
- 📸 **Gallery** - Image upload and management with Cloudinary
- 📅 **Timeline** - Moments tracking with CRUD operations
- 💌 **Secret Letters** - Password-protected letters with typing animation
- 🎨 **Glassmorphism UI** - Purple/pink gradient theme

### Backend
- 🚀 **Node.js + Express** REST API
- 🍃 **MongoDB** database
- ☁️ **Cloudinary** image storage
- 🔒 **CORS** enabled

## 📁 Project Structure

```
/mnt/okcomputer/output/
├── app/                    # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Page Components
│   │   ├── services/       # API Services
│   │   └── ...
│   └── dist/               # Build output
│
├── backend/                # Node.js Backend
│   ├── src/
│   │   ├── models/         # MongoDB Models
│   │   ├── routes/         # API Routes
│   │   ├── config/         # Configuration
│   │   └── server.js       # Entry point
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# PORT=5000
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/our-moments
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

# Start the server
npm run dev
```

### 2. Frontend Setup

```bash
cd app

# Install dependencies (if needed)
npm install

# Create .env file
cp .env.example .env

# Edit .env with your API URL:
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev

# Build for production
npm run build
```

## 📡 API Endpoints

### Moments
- `GET /api/moments` - Get all moments
- `POST /api/moments` - Create moment (with image)
- `PUT /api/moments/:id` - Update moment
- `DELETE /api/moments/:id` - Delete moment

### Gallery
- `GET /api/gallery` - Get all images
- `POST /api/gallery` - Upload images
- `DELETE /api/gallery/:id` - Delete image

### Letters
- `GET /api/letters` - Get letter info
- `POST /api/letters/verify` - Verify password & get content
- `POST /api/letters` - Create letter

## 🎨 Design System

- **Colors**: Purple (#a855f7), Pink (#ec4899), Dark slate
- **Fonts**: Playfair Display (headings), Inter (body)
- **Effects**: Glassmorphism, subtle glows, smooth animations

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📝 Notes

- Images are uploaded to Cloudinary, not stored as base64
- Music state persists in localStorage
- All data is persisted in MongoDB
- Responsive design for mobile and desktop

# 🎧 Moodify AI — Emotion-Based Music Player

An interactive full-stack web application that uses computer vision and real-time facial expression recognition to detect user emotions and automatically play matching curated music.

![Moodify AI Banner](https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop)

---

## ✨ Features

- 🎥 **Real-time Facial Expression Recognition**: Uses Google MediaPipe Face Landmarker via webcam to detect blendshapes and emotions in real-time (*Happy 😄*, *Sad 😢*, *Surprised 😲*, *Neutral 😐*).
- 🎨 **Glassmorphic Music Player UI**:
  - **Dynamic Mood Accent Lighting**: Visual theme automatically shifts color scheme matching the active emotion.
  - **Vinyl Spin & Audio Visualizer**: Bouncing 4-bar equalizer animations and smooth rotating vinyl poster when tracks play.
  - **Comprehensive Playback Controls**: Track seek timeline with current/total duration, volume slider, mute toggle, shuffle, and repeat modes.
  - **Manual Mood Pills**: Quick-select pills to switch moods manually or explore track recommendations.
- 🔐 **User Authentication**: Register, Login, and Session persistence with JWT and HTTP-only cookie security.
- ☁️ **Full-Stack Song Management**: REST API backend with ID3 metadata parsing, MongoDB storage, and audio/artwork cloud uploads.
- 🛡️ **Offline Fallback Catalog**: High-quality built-in fallback music library so the app is instantly playable even without backend database connectivity.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Sass / SCSS (Glassmorphism & CSS Animations)
- **Computer Vision**: `@mediapipe/tasks-vision` (Face Landmarker)
- **Routing & HTTP**: React Router v7, Axios

### Backend
- **Runtime & Framework**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT), Cookie-Parser, bcrypt
- **File & Audio Processing**: Node-ID3 (metadata extraction), Multer, ImageKit / Cloud Storage

---

## 📁 Project Structure

```text
Facial Detection/
├── Backend/
│   ├── server.js               # Express server entrypoint
│   └── src/
│       ├── app.js              # Express app configuration & middleware
│       ├── config/             # Database connection setup
│       ├── controller/         # Auth & Song controllers
│       ├── middleware/         # File upload & Auth middlewares
│       ├── models/             # Mongoose User & Song schemas
│       ├── routes/             # API routing (/api/auth, /api/songs)
│       └── services/           # Storage cloud upload service
│
└── Frontend/
    ├── index.html              # HTML entrypoint
    ├── vite.config.js          # Vite configuration
    └── src/
        ├── App.jsx             # Top-level context providers & router
        ├── app.routes.jsx      # Application route definitions
        ├── features/
        │   ├── Expression/     # MediaPipe Face Landmarker & Webcam component
        │   ├── auth/           # User Auth context, hooks, and Login/Register pages
        │   ├── home/           # Music Player UI, song context, hooks, and SCSS styles
        │   └── shared/         # Global styles & button components
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)

---

### 1. Backend Setup

1. Navigate to the `Backend` folder:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `Backend` directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/moodify
   JWT_SECRET=your_jwt_secret_key
   IMAGEKIT_PUBLIC_KEY=your_public_key
   IMAGEKIT_PRIVATE_KEY=your_private_key
   IMAGEKIT_URL_ENDPOINT=your_url_endpoint
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   The backend server will run on `http://localhost:3000`.

---

### 2. Frontend Setup

1. Navigate to the `Frontend` folder:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in existing user |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `POST` | `/api/auth/logout` | Log out current user |

### Songs (`/api/songs`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/songs?mood={mood}` | Fetch song recommendation matching a specific mood |
| `POST` | `/api/songs` | Upload a new song with MP3 ID3 metadata extraction |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

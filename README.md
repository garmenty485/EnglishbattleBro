# English Battle Bro 🎮

## Background

This project was created by a complete beginner who:
1. Wanted to practice English vocabulary with English-to-English definition
2. Watched "MERN Stack Tutorial with Deployment – Beginner's Course" on YouTube
(https://www.youtube.com/watch?v=O3BUHwfHf84&t=4441s)
3. Utilized Cursor AI for coding assistance
4. Built the entire application from scratch
5. Successfully deployed it on Render

Try it now: [English Battle Bro](https://englishbattlebro.onrender.com/)
Author's profile: https://www.linkedin.com/in/chia-ming-hu-683382255/

## Features

- **Over 6000 Simple Words but most of them are basic**: Definitions are scraped from well-known English-to-English dictionaries
- **Easy to Play**: Play with your keyboard and it's like hangman 
- **Solo Practice Mode**: play at your own pace
- **Real-time Battle Mode**: Compete with other players in real-time
- **Google Account Integration**: Review words you've learned in login mode
- **Hint System**: Get letter hints and additional definitions

## Tech Stack (MERN)

### Frontend
- React.js with Vite
- Chakra UI
- Socket.io Client
- Google OAuth 2.0
- React Router DOM

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Socket.io
- RESTful APIs

### Other
- Socket.io

## Local Development

Steps:
1. Clone the repository
2. Install dependencies:
```bash 
npm install
cd frontend && npm install
```
3. Set up environment variables:
Backend .env
```
PORT=5000
MONGODB_URI=your_mongodb_uri
NODE_ENV=development
```
Frontend .env
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```
4. Run development servers:
```bash 
npm run dev
npm run dev:frontend
```

## Deployment

The application is deployed on Render:
- Build Command: `npm run build`
- Start Command: `npm start`
- Frontend: Static Site
- Backend: Web Service
- Database: MongoDB Atlas
- You can learn how to deploy on Render: https://www.youtube.com/watch?v=O3BUHwfHf84&t=4441s

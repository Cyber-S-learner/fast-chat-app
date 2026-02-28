# 🚀 Fast Chat

Fast Chat is a high-performance, real-time messaging application built with the **MERN stack**, designed for seamless communication. It features real-time interactions, image sharing, and a modern UI.

## ✨ Features

- **Real-time Messaging**: Instant message delivery using Socket.io.
- **User Authentication**: Secure signup and login with JWT-based authentication.
- **Image Sharing**: Support for sending images within chats, powered by Cloudinary.
- **Profile Management**: Customizable user profiles with profile picture uploads.
- **Global Search**: Find and start conversations with any registered user.
- **Smart Notifications**: Real-time unread message counts and typing indicators.
- **Presence Tracking**: See when your contacts are online or offline.
- **Modern UI**: A sleek, responsive design built with Tailwind CSS v4 and Lucide icons.

## 🛠️ Tech Stack

### Frontend
- **React 19**: Modern UI component architecture.
- **Vite**: Ultra-fast build tool and development server.
- **Redux Toolkit**: Centralized state management for users and chats.
- **Tailwind CSS v4**: Advanced utility-first styling.
- **Socket.io Client**: For real-time bidirectional communication.
- **Lucide React**: Beautifully designed icons.

### Backend
- **Node.js & Express 5**: Robust and scalable server-side framework.
- **MongoDB & Mongoose**: Flexible NoSQL database with schema modeling.
- **Socket.io Server**: WebSocket management for real-time events.
- **Cloudinary**: Cloud-based image management and storage.
- **Multer**: Middleware for handling `multipart/form-data` (image uploads).

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account (Atlas or local)
- Cloudinary account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/Cyber-S-learner/fast-chat-app.git
cd Fast-Chat
```

### 2. Install Dependencies
You can install dependencies for both client and server from the root directory:
```bash
npm run build
```

### 3. Environment Configuration

#### Backend (`server/.env`)
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (`client/.env`)
Create a `.env` file in the `client` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Running the Application

#### Development Mode
Run the backend:
```bash
cd server
npm run dev
```

Run the frontend:
```bash
cd client
npm run dev
```

#### Production Mode
Build the client and start the server:
```bash
npm run build
npm start
```

## 🚀 Deployment

The app is optimized for deployment on platforms like **Render**. 
- **Root Directory**: Set to current directory.
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

## 👤 Author
**Rishi**

## 📄 License
ISC

<div align="left">

# 💬 Fluxcie

### A Sophisticated Real-Time Communication Platform

_Empowering seamless connections through intelligent design and robust architecture_

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://www.mysql.com/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Architecture](#-architecture) • [API Documentation](#-api-documentation)

---

## 🌟 Overview

Fluxcie represents a modern approach to real-time communication, built with enterprise-grade technologies and architectural best practices. This full-stack application demonstrates proficiency in building scalable, secure, and user-centric platforms that prioritize both functionality and user experience.

The platform seamlessly integrates robust backend APIs with an elegant, responsive frontend, showcasing expertise in contemporary web development paradigms, state management, authentication systems, and real-time data handling.

---

## ✨ Features

### 🔐 **Authentication & Security**

- Token-based authentication with Laravel Sanctum
- Secure password hashing and validation
- Protected API endpoints with middleware
- CORS configuration for secure cross-origin requests

### 💬 **Real-Time Messaging**

- Instant message delivery with optimized polling
- Support for text, images, files, and voice messages
- Message reactions and threaded replies
- Pin important messages for quick access
- Soft delete with preservation of conversation context

### 🎙️ **Voice Communication**

- Browser-based audio recording with MediaRecorder API
- Waveform visualization during playback
- Variable playback speed (1x, 1.5x, 2x)
- Seek functionality for precise navigation

### 📁 **File Management**

- Secure file upload system with validation
- Support for images, documents, and audio files
- Profile picture upload and management
- Optimized storage with Laravel's filesystem abstraction

### 👥 **Social Networking**

- Comprehensive friend request system
- User search with real-time filtering
- Friend management and unfriend capabilities
- Privacy-focused user interactions

### 🎨 **User Experience**

- Glassmorphism design with aurora effects
- Smooth animations powered by Framer Motion
- Responsive layout across all device sizes
- Dark mode with customizable themes
- Toast notifications for real-time feedback
- Intuitive navigation and information architecture

---

## 🛠️ Tech Stack

<div align="left">

### Backend

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

**Framework:** Laravel 11  
**Authentication:** Sanctum (Token-based)  
**Database:** MySQL 8.0  
**ORM:** Eloquent  
**Storage:** Local Filesystem

### Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Framework:** React 18 + TypeScript  
**Build Tool:** Vite  
**Styling:** Tailwind CSS + shadcn/ui  
**Animations:** Framer Motion  
**Routing:** React Router v6  
**State Management:** Context API  
**HTTP Client:** Axios

</div>

---

## 📂 Architecture

```
Fluxcie/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── Api/     # RESTful API Controllers
│   │   ├── Models/          # Eloquent Models
│   │   └── Exceptions/      # Custom Exception Handlers
│   ├── database/
│   │   └── migrations/      # Database Schema
│   ├── routes/
│   │   └── api.php          # API Routes
│   └── storage/
│       └── app/public/      # File Storage
│
├── frontend/                # React Application
│   ├── src/
│   │   ├── components/      # Reusable Components
│   │   │   ├── chat/        # Chat-specific Components
│   │   │   └── ui/          # shadcn/ui Components
│   │   ├── context/         # React Context Providers
│   │   ├── pages/           # Route Components
│   │   ├── services/        # API Integration Layer
│   │   └── types/           # TypeScript Definitions
│   └── public/              # Static Assets
│
└── README.md                # Project Documentation
```

---

## 🚀 Installation

### Prerequisites

- **PHP** 8.2 or higher
- **Composer** (PHP dependency manager)
- **Node.js** 18+ and npm
- **MySQL** 8.0 or higher

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
composer install

# Configure environment
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
DB_DATABASE=fluxcie_chat
DB_USERNAME=root
DB_PASSWORD=

# Create database
mysql -u root -e "CREATE DATABASE fluxcie_chat;"

# Run migrations
php artisan migrate

# Create storage symlink
php artisan storage:link

# Start development server
php artisan serve
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint    | Description                         |
| ------ | ----------- | ----------------------------------- |
| POST   | `/register` | Create new user account             |
| POST   | `/login`    | Authenticate user and receive token |
| POST   | `/logout`   | Invalidate current session          |
| GET    | `/me`       | Retrieve authenticated user profile |

### Core Endpoints

| Method | Endpoint                       | Description                    | Auth Required |
| ------ | ------------------------------ | ------------------------------ | ------------- |
| GET    | `/conversations`               | Retrieve user conversations    | ✅            |
| POST   | `/conversations`               | Create new conversation        | ✅            |
| GET    | `/conversations/{id}/messages` | Fetch conversation messages    | ✅            |
| POST   | `/conversations/{id}/messages` | Send message (text/file/voice) | ✅            |
| GET    | `/friends`                     | Retrieve friends list          | ✅            |
| POST   | `/friends/request`             | Send friend request            | ✅            |
| GET    | `/users/search?query={q}`      | Search users by username       | ✅            |

---

## 🎯 Key Implementation Highlights

### Backend Architecture

- **RESTful API Design:** Consistent endpoint structure following REST principles
- **Eloquent Relationships:** Optimized database queries with eager loading
- **Token Authentication:** Stateless authentication with Laravel Sanctum
- **File Upload System:** Secure file handling with validation and storage abstraction
- **Error Handling:** Global exception handler providing clean JSON responses
- **Request Validation:** Server-side validation with detailed error messages

### Frontend Architecture

- **Component-Based Design:** Modular, reusable React components
- **Type Safety:** Comprehensive TypeScript implementation
- **Context API:** Centralized state management for auth and chat
- **Custom Hooks:** Reusable logic abstraction
- **API Service Layer:** Centralized HTTP client with interceptors
- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Performance Optimization:** Code splitting and lazy loading

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ CSRF protection
- ✅ SQL injection prevention via Eloquent ORM
- ✅ XSS protection through input sanitization
- ✅ File upload validation
- ✅ Rate limiting on authentication endpoints
- ✅ Token-based authentication with automatic expiration

---

## 🚧 Future Enhancements

- [ ] WebSocket integration (Laravel Echo + Pusher) for true real-time updates
- [ ] End-to-end message encryption
- [ ] Video/audio calling functionality
- [ ] Message editing and deletion for all users
- [ ] Advanced search with filters
- [ ] User presence indicators (typing, online/offline)
- [ ] Desktop notifications via Web Push API
- [ ] Progressive Web App (PWA) capabilities
- [ ] Message pagination for performance optimization

---

## 📝 Development Notes

### Database Schema

The application utilizes a normalized relational database schema with the following core tables:

- `users` - User accounts and profiles
- `conversations` - Chat conversations (DM and group)
- `messages` - Message content and metadata
- `friend_requests` - Friend request tracking
- `friendships` - Established friend connections

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Zoya Khan**  
Full-Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](your-linkedin-url)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](your-portfolio-url)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](your-github-url)

# XpertLive
XpertLive is a Real-Time Expert Session Booking Platform that allows users to discover experts, view available time slots, and book sessions seamlessly. The platform is designed to provide a smooth booking experience with real-time slot synchronization and double-booking prevention.
Built using React, Node.js, Express, MongoDB, and Socket.io.

---

# Features

## Expert Listing
- Display all experts
- Search experts by name
- Filter experts by category
- Pagination support
- Loading and error handling

## Expert Details
- View complete expert information
- Available slots grouped by date
- Real-time slot updates

## Booking System
- Book sessions with experts
- Form validation
- Prevent double booking
- Success confirmation after booking
- Disable already booked slots

## My Bookings
- View bookings using email
- Booking status support:
  - Pending
  - Confirmed
  - Completed

---

# Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- Socket.io Client

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io

---

# Real-Time Functionality

Socket.io is used for:
- Live slot updates
- Preventing multiple users from booking the same slot simultaneously

---

# API Endpoints

## Experts APIs

```bash
GET /experts
GET /experts/:id
```

## Booking APIs

```bash
POST /bookings
PATCH /bookings/:id/status
GET /bookings?email=
```

---

# Project Structure

```bash
xpertlive/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── config/
│   ├── socket/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.js
│
└── README.md
```

# Installation

## Clone Repository

```bash
git clone https://github.com/ayushikushwaha71-beep/xpertlive.git
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm start

#Deployment Link:
https://xpertlive.vercel.app/


# Author

Ayushi Kushwaha
```

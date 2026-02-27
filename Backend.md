# 🌍 Travel Partner — Backend
Production-Ready Scalable Backend for Travel Companion & Ride Sharing Platform

---

# 📌 Overview

Travel Partner is a platform that allows:

- 🧳 Users to find travel companions (Intercity & Local Visits)
- 🚗 Riders to offer rides
- 💬 Personal & Group Chat (Trip-based & Ride-based)
- 🧾 Bill generation (No payment gateway — direct payment to rider)
- ⭐ Rating & verification system

This backend is built with scalability, modularity, and production readiness in mind.

---

# 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Redis (Caching + Socket Scaling)
- Socket.io (Real-time Chat)
- JWT Authentication
- Docker
- Winston Logger
- Joi/Zod Validation
- Cloudinary (File Uploads)

---

# 🏗 System Architecture

Client (Next.js)
        |
REST API (Express)
        |
MongoDB (Primary DB)
        |
Socket.io Server
        |
Redis Adapter (Scaling)

---

# 📁 Project Structure

backend/
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── redis.js
│   │   ├── socket.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── trip.controller.js
│   │   ├── ride.controller.js
│   │   ├── booking.controller.js
│   │   ├── chat.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── trip.service.js
│   │   ├── ride.service.js
│   │   ├── booking.service.js
│   │   ├── chat.service.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Trip.js
│   │   ├── Ride.js
│   │   ├── Booking.js
│   │   ├── Chat.js
│   │   ├── Message.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── trip.routes.js
│   │   ├── ride.routes.js
│   │   ├── booking.routes.js
│   │   ├── chat.routes.js
│   │
│   ├── sockets/
│   │   └── chat.socket.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │
│   ├── utils/
│   │   ├── generateBill.js
│   │   ├── logger.js
│   │
│   └── app.js
│
├── server.js
├── Dockerfile
└── package.json

---

# 👤 User Roles

```js
role: {
  type: String,
  enum: ["user", "rider", "admin"],
  default: "user"
}
```

---

# 🗃 Database Models

## 1️⃣ User Model

```js
{
  _id,
  name,
  email,
  password,
  phone,
  role,
  profileImage,
  bio,
  rating: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  createdAt,
  updatedAt
}
```

---

## 2️⃣ Trip Model (Travel Companion)

```js
{
  creator: ObjectId(User),
  fromLocation,
  toLocation,
  date,
  transportMode,
  seatsAvailable,
  description,
  participants: [ObjectId(User)],
  chatId: ObjectId(Chat),
  status: ["open", "confirmed", "completed", "cancelled"]
}
```

---

## 3️⃣ Ride Model (Rider Only)

```js
{
  riderId: ObjectId(User),
  vehicleType,
  vehicleNumber,
  fromLocation,
  toLocation,
  date,
  availableSeats,
  pricePerKm,
  estimatedDistance,
  chatId: ObjectId(Chat),
  status: ["available", "booked", "completed"]
}
```

---

## 4️⃣ Booking Model

```js
{
  rideId: ObjectId(Ride),
  userId: ObjectId(User),
  seatsBooked,
  totalAmount,
  billGenerated: Boolean,
  status: ["pending", "accepted", "completed", "cancelled"]
}
```

---

## 5️⃣ Chat Model

Supports:
- Personal Chat
- Trip Group Chat
- Ride Group Chat

```js
{
  type: {
    type: String,
    enum: ["personal", "trip_group", "ride_group"]
  },
  participants: [ObjectId(User)],
  tripId: ObjectId(Trip),   // optional
  rideId: ObjectId(Ride),   // optional
  lastMessage: ObjectId(Message),
  createdAt,
  updatedAt
}
```

---

## 6️⃣ Message Model

```js
{
  chatId: ObjectId(Chat),
  sender: ObjectId(User),
  content: String,
  messageType: {
    type: String,
    enum: ["text", "image", "file"],
    default: "text"
  },
  readBy: [ObjectId(User)],
  createdAt
}
```

---

# 💬 Chat System

## Chat Types

1. Personal Chat
   - Created manually or after companion request
   - Type: "personal"

2. Trip Group Chat
   - Auto-created when trip confirmed
   - Type: "trip_group"

3. Ride Group Chat
   - Created when ride booking accepted
   - Type: "ride_group"

---

# 🔌 Socket.io Events

## Client → Server

- join_chat
- send_message
- typing
- mark_read

## Server → Client

- receive_message
- user_typing
- message_read

---

# 📡 Chat APIs

## Get Chats (Dashboard Dropdown)

GET /api/chats?type=personal  
GET /api/chats?type=group  
GET /api/chats?type=all  

## Get Messages

GET /api/chats/:chatId/messages  

## Create Personal Chat

POST /api/chats/personal  

Body:
```json
{
  "receiverId": "USER_ID"
}
```

---

# 🧾 Bill Generation (No Payment Gateway)

When ride booking is accepted:

```js
totalAmount = estimatedDistance * pricePerKm * seatsBooked;
```

- Bill stored in Booking
- Displayed in frontend
- User pays rider directly (UPI / Cash)

---

# 🔐 Security

- JWT Authentication (REST + Socket)
- Role-based authorization
- Rate limiting
- Request validation
- Global error handler
- Logger with Winston
- CORS protection

---

# ⚡ Performance Optimization

- MongoDB Indexing
- Pagination on messages
- Redis caching
- Redis Socket Adapter
- Horizontal scaling support

---

# 🧪 Production Readiness Checklist

- Helmet security
- Environment variables
- Dockerized setup
- Centralized logging
- Input validation
- Error handling
- API versioning
- CI/CD ready

---

# 📈 Scalability Plan

Phase 1:
- Single server deployment

Phase 2:
- Load balancer + Redis scaling

Phase 3:
- Microservices split:
  - Auth Service
  - Trip Service
  - Ride Service
  - Chat Service

---

# 🚀 Future Enhancements

- End-to-end encrypted chat
- Live GPS tracking
- AI-based companion matching
- Abuse detection
- Push notifications
- Emergency SOS system

---

# ✅ Features Summary

✔ Travel Companion System  
✔ Ride Booking System  
✔ Personal Chat  
✔ Trip Group Chat  
✔ Ride Group Chat  
✔ Bill Generation (No payment gateway)  
✔ Role-based Users (User / Rider / Admin)  
✔ Production-Ready Structure  
✔ Scalable Real-Time Architecture  

---
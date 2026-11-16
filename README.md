# Chat Backend

A chat backend built with Node.js, TypeScript, PostgreSQL (Sequelize ORM), and Firebase Firestore.

## Tech Stack

- **Node.js + TypeScript** - Runtime with strict typing
- **PostgreSQL + Sequelize** - Relational data (users, chats)
- **Firebase Firestore** - Real-time data (messages, read receipts)
- **Express.js** - Web framework
- **Joi** - Request validation

## Project Structure

```
src/
├── config/         # DB and Firebase setup
├── controllers/    # Route handlers
├── middleware/     # Express middlewares
├── models/         # Sequelize models
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript types
├── validators/     # Joi schemas
├── scripts/        # DB scripts
└── app.ts          # Entry point
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your PostgreSQL and Firebase credentials.

### 3. Setup PostgreSQL

```bash
createdb chat_db
npm run db:sync
```

### 4. Setup Firebase

1. Create project in Firebase Console
2. Go to Project Settings > Service Accounts
3. Generate private key (JSON)
4. Update `.env` with the file path

### 5. Run

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

## API Endpoints

### Create/Get Chat
```
POST /chat/create
Body: { "userAId": "uuid", "userBId": "uuid" }
```

### Send Message
```
POST /chat/:chatId/message/send
Body: { "senderId": "uuid", "text": "Hello" }
```

### Get Messages
```
GET /chat/:chatId/messages?limit=50
```

### Mark Read
```
POST /chat/:chatId/message/:messageId/read
Body: { "userId": "uuid" }
```

### Update Last Seen
```
POST /chat/:chatId/lastseen
Body: { "userId": "uuid", "messageId": "uuid" }
```

### List User Chats
```
GET /user/:userId/chats
```

## Data Architecture

**PostgreSQL:**
- `users` - User accounts
- `chats` - Chat metadata

**Firestore:**
- `messages/{chatId}/items/{messageId}` - Messages
- `lastSeen/{chatId_userId}` - Last seen tracking

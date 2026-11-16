# Chat Backend

A chat backend built with Node.js, TypeScript, PostgreSQL (Sequelize ORM), and Firebase Firestore.

## Tech Stack

- **Node.js + TypeScript** - Runtime with strict typing
- **PostgreSQL + Sequelize** - Relational data (users, chats, groups)
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

### 1:1 Chat APIs

#### Create/Get Chat
```
POST /chat/create
Body: { "userAId": "uuid", "userBId": "uuid" }
```

#### Send Message
```
POST /chat/:chatId/message/send
Body: { "senderId": "uuid", "text": "Hello" }
```

#### Get Messages
```
GET /chat/:chatId/messages?limit=50
```

#### Mark Read
```
POST /chat/:chatId/message/:messageId/read
Body: { "userId": "uuid" }
```

#### Update Last Seen
```
POST /chat/:chatId/lastseen
Body: { "userId": "uuid", "messageId": "uuid" }
```

#### Edit Message
```
PUT /chat/:chatId/message/:messageId/edit
Body: { "userId": "uuid", "text": "Updated text" }
```

#### Delete Message
```
DELETE /chat/:chatId/message/:messageId
Body: { "userId": "uuid" }
```

#### List User Chats
```
GET /user/:userId/chats
```

### Group Chat APIs

#### Create Group
```
POST /group/create
Body: { "name": "Group Name", "createdBy": "uuid", "members": ["uuid1", "uuid2"] }
```

#### Get Group
```
GET /group/:groupId
```

#### Add Member
```
POST /group/:groupId/member/add
Body: { "userId": "uuid", "memberId": "uuid" }
```

#### Remove Member
```
POST /group/:groupId/member/remove
Body: { "userId": "uuid", "memberId": "uuid" }
```

#### Send Group Message
```
POST /group/:groupId/message/send
Body: { "senderId": "uuid", "text": "Hello group" }
```

#### Get Group Messages
```
GET /group/:groupId/messages?limit=50
```

#### List User Groups
```
GET /user/:userId/groups
```

## Data Architecture

**PostgreSQL:**
- `users` - User accounts
- `chats` - 1:1 chat metadata
- `group_chats` - Group chat with members array

**Firestore:**
- `messages/{chatId}/items/{messageId}` - Messages (works for both 1:1 and group)
- `lastSeen/{chatId_userId}` - Last seen tracking

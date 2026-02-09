# Chat Database Implementation

## Overview
Chat messages are now stored in MongoDB database with full persistence. Messages survive server restarts and can be retrieved at any time.

## Database Schema

### Message Model (`Message.js`)

**Fields:**
- `text` - Message content (required)
- `senderId` - User ID who sent the message (ref: User)
- `senderName` - Name of sender
- `chatType` - 'private' or 'group' (enum)
- `recipientId` - For private chats (ref: User)
- `tripId` - For group chats (ref: Trip)
- `timestamp` - Message timestamp
- `isRead` - Read status for private messages
- `createdAt` / `updatedAt` - Auto timestamps

**Indexes:**
- Compound index on (senderId, recipientId, timestamp) for private chats
- Index on tripId for group chats
- Individual indexes on senderId, recipientId, timestamp

## API Endpoints

### GET `/api/messages/private/:userId1/:userId2`
Get all messages between two users (last 100)

### GET `/api/messages/group/:tripId`
Get all messages for a trip group chat (last 100)

### GET `/api/messages/user/:userId`
Get all chats for a user (both private and group)

### PUT `/api/messages/mark-read`
Mark messages as read
Body: `{ senderId, recipientId }`

### DELETE `/api/messages/:messageId`
Delete a specific message

## Backend Implementation

### Socket.IO Events

**Group Chat:**
1. `join_trip` - User joins a trip room
2. `send_trip_message` - Saves to DB then broadcasts to room
3. `receive_trip_message` - All room members receive

**Private Chat:**
1. `join_private` - User joins their private room
2. `send_private_message` - Saves to DB then sends to recipient
3. `receive_private_message` - Recipient receives
4. `message_sent` - Sender gets confirmation with DB ID

### Message Saving Flow

**When sending:**
1. Client emits message via Socket.IO
2. Server saves to MongoDB
3. Server broadcasts to recipients with DB `_id`
4. Message includes database ID for tracking

## Frontend Implementation

### Message Loading

**Group Chat:**
```javascript
loadGroupMessages(tripId)
- Fetches from /api/messages/group/:tripId
- Loads last 100 messages
- Called when opening a trip chat
```

**Private Chat:**
```javascript
loadPrivateMessages(userId1, userId2)
- Fetches from /api/messages/private/:userId1/:userId2
- Loads last 100 messages
- Called when opening a private chat
```

### Real-time Updates

Messages are:
1. **Loaded** from database when chat opens
2. **Received** in real-time via Socket.IO
3. **Stored** locally in React state
4. **Persisted** to database via Socket.IO events

## Features

✅ **Persistent Storage** - All messages saved to MongoDB
✅ **Chat History** - Load previous messages when opening chat
✅ **Real-time Updates** - Instant message delivery via Socket.IO
✅ **Message Tracking** - Each message has unique database ID
✅ **Read Status** - Track read/unread for private messages
✅ **Efficient Queries** - Indexed for fast retrieval
✅ **Message Limits** - Last 100 messages per chat (configurable)

## Database Queries

**Find private messages:**
```javascript
Message.find({
  chatType: 'private',
  $or: [
    { senderId: userId1, recipientId: userId2 },
    { senderId: userId2, recipientId: userId1 }
  ]
}).sort({ timestamp: 1 })
```

**Find group messages:**
```javascript
Message.find({
  chatType: 'group',
  tripId: tripId
}).sort({ timestamp: 1 })
```

## Testing

1. **Start server:** `node app.js` in server directory
2. **Send messages** - Use the chat interface
3. **Check MongoDB** - Messages should be in 'messages' collection
4. **Refresh page** - Messages should persist
5. **Open chat** - History loads automatically

## Future Enhancements

- [ ] Pagination for message history
- [ ] Message search functionality
- [ ] File/image attachments
- [ ] Message reactions
- [ ] Typing indicators
- [ ] Message editing
- [ ] Message deletion (user-initiated)
- [ ] End-to-end encryption
- [ ] Push notifications for new messages
- [ ] Online/offline status

# Chatline

Chatline is a real-time one-to-one messaging application built for authenticated conversations, media sharing, and live online presence.

## **Live Application**

[Open Chatline](https://chatline-xe3f.onrender.com)

## **Overview**

Chatline allows authenticated users to discover other users, start one-to-one conversations, send text messages, share images and videos, and see online status updates without refreshing the application.

The application uses a REST API for authentication checks, user and message retrieval, and message persistence. Socket.IO provides the real-time communication layer for new messages and presence updates.

## **Features**

- Clerk authentication
- User discovery and search
- One-to-one conversations
- Real-time message delivery
- Online and offline presence indicators
- Image and video messages
- Persistent message history
- Responsive chat interface
- Theme presets and wallpaper customization

## **Technology Stack**

- React and Vite for the frontend application
- Node.js and Express for the backend API
- MongoDB and Mongoose for users and messages
- Clerk for authentication and user identity
- Socket.IO for real-time messages and presence updates
- Multer for handling multipart media uploads
- ImageKit for image and video storage and delivery
- Zustand for frontend application state
- HeroUI, Tailwind CSS, and Lucide React for the interface
- Docker for production deployment

## **Architecture**

```text
React frontend
      |
      | REST API
      v
Express backend -------- MongoDB
      |
      | Socket.IO events
      v
Connected clients

Media files -------- ImageKit
Authentication ----- Clerk
```

The REST API remains responsible for loading and storing application data. Socket.IO is used for events that need to reach connected clients immediately.

## **Technology Decisions**

### **Node.js**

Node.js provides the server runtime for Chatline. Its event-driven, non-blocking model fits an application that handles HTTP requests, media uploads, database operations, and persistent Socket.IO connections at the same time.

### **Express**

Express is the HTTP framework for the backend. It provides the routing and middleware structure used by the authentication, user, conversation, message, upload, and webhook endpoints. Keeping these responsibilities in a single API layer gives the frontend one consistent interface for loading data and creating messages.

### **Multer**

Multer processes `multipart/form-data` requests from the message composer. It temporarily makes image and video files available to the backend so they can be validated and passed to ImageKit. The application stores the resulting media URL in the message instead of storing the uploaded file itself.

### **MongoDB**

MongoDB stores user profiles and messages. Chat messages are document-oriented records containing a sender, receiver, optional text, optional media references, and timestamps. MongoDB keeps this structure flexible while supporting frequent message creation and retrieval. Mongoose adds schemas and model-based database access.

### **Clerk**

Clerk handles authentication and identity management. This avoids implementing password storage, session handling, and account security manually. Clerk identifies the authenticated user, while MongoDB stores the application-specific profile used by Chatline.

### **Socket.IO**

Socket.IO provides bidirectional communication between the backend and connected clients. It is used for new-message delivery, online-user tracking, and disconnect handling.

Messages are saved to MongoDB first through the API. After a successful save, the backend emits the message to the recipient's active socket connection. This keeps MongoDB as the source of truth while allowing the interface to update immediately.

### **ImageKit**

ImageKit stores and delivers uploaded images and videos. Media files are kept outside MongoDB so the database can focus on structured message data and media URLs instead of large binary files. ImageKit provides a dedicated media delivery service, while Chatline stores the resulting media reference with the message.

### **Docker**

Docker packages the frontend build and backend runtime into a repeatable production image. The multi-stage Dockerfile keeps frontend build dependencies separate from the final runtime image, builds the React application once, and serves the generated frontend through the Express server alongside the API and Socket.IO connection.

## **Message Flow**

1. The frontend sends a message to the Express API.
2. The backend validates the authenticated sender and receiver.
3. The message is saved to MongoDB.
4. The backend checks whether the recipient has an active Socket.IO connection.
5. If the recipient is online, the saved message is emitted immediately.
6. If the recipient is offline, the message remains available through message history.
7. The receiving client updates without requiring a page refresh.

## **Presence Flow**

1. An authenticated client opens a Socket.IO connection.
2. The client sends its application user ID during connection.
3. The backend associates the user ID with the active socket.
4. The backend broadcasts the current online-user list.
5. Clients use that list to display online or offline status.
6. When a socket disconnects, the backend updates the list and broadcasts it again.

## **Project Structure**

```text
chatline/
├── frontend/
│   └── src/
│       ├── components/   Reusable interface components
│       ├── context/      Theme and wallpaper state
│       ├── hooks/        Shared React behavior
│       ├── lib/          API and utility functions
│       ├── pages/        Application views
│       └── store/        Authentication and chat state
├── backend/
│   └── src/
│       ├── controllers/  HTTP request handlers
│       ├── lib/          Database, Socket.IO, and service setup
│       ├── middleware/   Authentication and upload middleware
│       ├── models/       MongoDB schemas
│       ├── routes/       API route definitions
│       ├── seeds/        Demo user data
│       └── webhooks/     Clerk webhook handlers
└── Dockerfile            Production container definition
```

## **Deployment**

Chatline includes a multi-stage Docker build that:

1. Builds the React frontend.
2. Builds the backend.
3. Copies the frontend production bundle into the backend image.
4. Serves the application through Express.
5. Runs the API and Socket.IO server from the same application process.

The deployed application uses Clerk, MongoDB, and ImageKit as external services. Sensitive configuration is supplied through the deployment environment and is not stored in the repository.

## **Repository**

The root README documents the complete Chatline application. The README inside `frontend/` only describes the frontend package.

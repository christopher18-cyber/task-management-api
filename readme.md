# 📋 Task Management & Collaborative Kanban API

A production-grade, RESTful Task Management API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. Designed for multi-user collaboration, real-time-capable board workflows, custom columns, activity audit logging, and bulk drag-and-drop card reordering.

---

## 🚀 Features

- **Authentication & Authorization**: Secure JWT authentication, password hashing with `bcryptjs`, and protected route middleware.
- **Board & Member Management**: Create personal or team boards, manage collaborators, and restrict access based on roles/ownership.
- **Custom Columns**: Dynamically create, rename, reorder, and delete custom columns for flexible board workflows.
- **Card & Task Lifecycle**: Full CRUD operations for cards including priority levels (`Low`, `Medium`, `High`, `Urgent`), due dates, assignees, and descriptions.
- **Bulk Card Reordering**: Batch positional updates designed for drag-and-drop Kanban frontend interactions.
- **Activity Logging**: Automated audit trail tracking board creations, card updates, movement, and member activity.
- **Production Ready**: Security headers via `helmet`, rate limiting with `express-rate-limit`, structured logging using `winston`, and container/cloud deployment setup.

---

## 🛠️ Tech Stack & Tools

- **Runtime**: Node.js
- **Language**: TypeScript (executed with `tsx`)
- **Framework**: Express.js (v5)
- **Database**: MongoDB with Mongoose ORM
- **Security & Auth**: JSON Web Tokens (JWT), bcryptjs, Helmet, Express Rate Limit
- **Logger**: Winston
- **Deployment**: Deployed on **Render**

---

## 📂 Project Structure

```text
├── controllers/          # Business logic handlers
│   ├── authController.ts
│   ├── boardController.ts
│   ├── columnController.ts
│   ├── cardController.ts
│   └── activityController.ts
├── middleware/           # Express middleware (Auth, Validation, Rate Limiting)
│   └── authMiddleware.ts
├── models/               # Mongoose schemas & TypeScript interfaces
│   ├── User.ts
│   ├── Board.ts
│   ├── Column.ts
│   ├── Card.ts
│   └── ActivityLog.ts
├── routes/               # API endpoints definitions
├── utils/                # Helper modules (Winston Logger, Activity Logger)
│   ├── logger.ts
│   └── activityHelper.ts
├── server.ts             # Application entry point
├── package.json
└── tsconfig.json



Environment VariablesCreate a .env file in the root directory and add the following variables:Code snippet

NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret_key
MONGODB_URL=your_mongodb_atlas_connection_string

# Gmail OAuth Credentials (for email services)
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
GMAIL_SENDER=your_email@gmail.com

```

📖 API Endpoints Reference
🔐 Auth Routes (/api/auth)
POST /api/auth/register — Register a new user (Auth: No)

POST /api/auth/login — Authenticate user & get token (Auth: No)

GET /api/auth/me — Get current logged-in user details (Auth: Yes)

📌 Board Routes (/api/boards)
GET /api/boards — Get all boards for current user (Auth: Yes)

POST /api/boards — Create a new board (Auth: Yes)

GET /api/boards/:id — Get single board details (Auth: Yes)

PUT /api/boards/:id — Update board title or description (Auth: Yes)

DELETE /api/boards/:id — Delete board (Auth: Yes)

POST /api/boards/:id/members — Add a collaborator to board (Auth: Yes)

📊 Column Routes (/api/columns)
GET /api/columns/board/:boardId — Get all columns for a board (Auth: Yes)

POST /api/columns/create — Create a custom column (Auth: Yes)

PUT /api/columns/update/:id — Rename or reorder column (Auth: Yes)

DELETE /api/columns/delete/:id — Delete column & associated cards (Auth: Yes)

🃏 Card Routes (/api/cards)
GET /api/cards/board/:boardId — Get all cards on a board (Auth: Yes)

POST /api/cards — Create a new card (Auth: Yes)

PUT /api/cards/reorder — Bulk reorder cards (drag & drop) (Auth: Yes)

PUT /api/cards/:id — Update card details (Auth: Yes)

DELETE /api/cards/:id — Delete card (Auth: Yes)

📜 Activity Routes (/api/activities)
GET /api/activities/board/:boardId — Fetch audit logs for a board (Auth: Yes)

🏃 Getting Started Locally
Clone the repository:

Bash
git clone [https://github.com/your-username/task-management-api.git](https://github.com/your-username/task-management-api.git)
cd task-management-api
Install dependencies:

Bash
npm install
Start development server:

Bash
npm run dev
Production Start:

Bash
npm start
🚢 Deployment
This API is deployed on Render. When deploying to production:

Set NODE_ENV=production in the environment configuration.

Set Build Command: npm install

Set Start Command: npm start

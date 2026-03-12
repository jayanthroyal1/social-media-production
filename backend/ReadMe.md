# Folders
| File            | Responsibility            |
| --------------- | ------------------------- |
| server.js       | Bootstrapping (start app) |
| app.js          | Express config            |
| config/db.js    | Mongo connection          |
| config/redis.js | Redis connection          |
| routes          | Define endpoints          |
| controllers     | Business logic            |
| services        | Database logic            |
| middleware      | Auth / role / error       |
| utils           | JWT, helpers              |



| Feature     | Depends On     |
| ----------- | -------------- |
| Create Post | Logged-in user |
| Follow      | Logged-in user |
| Chat        | Logged-in user |
| Admin panel | Role system    |
| Super admin | Role system    |


🔐 bcrypt
👉 Used to securely hash and compare passwords before storing them in the database.

🔑 jsonwebtoken (JWT)
👉 Used to generate and verify authentication tokens for user login sessions.

🛡️ joi
👉 Used to validate API request data (body, params, query) to prevent invalid inputs.


# Access Tokens:
1️⃣ Access Token
Short lived (15 min)
Sent in Authorization header
Stateless
Used for protected routes

2️⃣ Refresh Token
Long lived (7 days)
Stored in Redis
Can be revoked
Used to generate new access token

Login
  ↓
Access Token (15m)
Refresh Token (7d stored in Redis)
  ↓
Access expires
  ↓
Call /refresh
  ↓
New Access Token

Without rotation:
If attacker steals refresh token,
They can keep using it until it expires.

With rotation:
Every refresh request:
Old refresh token is deleted
New refresh token is created
New one returned to user
So if attacker tries to reuse old token → it fails.

User sends:
refreshToken: oldToken

Server:
Validate oldToken
Delete oldToken
Generate newRefreshToken
Store newRefreshToken in Redis
Return newAccessToken + newRefreshToken

refreshToken → verify → delete old → generate new refresh → generate new access → store new refresh → return both

# Global Error Handling

Controller → throws error
       ↓
Express Error Middleware
       ↓
Formats response
       ↓
Logs error
       ↓
Sends structured JSON

# Helmet
By default, Express exposes:
X-Powered-By: Express
Missing security headers
Click jacking possible
XSS risks
Helmet fixes that.

🔥 What Helmet Adds Automatically
Hides Express signature
Sets X-Content-Type-Options
Prevents clickjacking
Adds CSP
Improves browser security
This is mandatory in production.

# Rate Limiting

Without rate limiting:

Attacker can:
Try 1 million passwords
Hammer your login route
Crash your server


# 🎯 Why RBAC?

Right now:
Any logged-in user can access protected routes.
But real apps need:
👤 Normal user
🛠 Admin
📦 Moderator
🏢 Super admin
We must control access based on role.
| Route           | Who Can Access |
| --------------- | -------------- |
| Create Post     | User           |
| Delete Any Post | Admin          |
| View Analytics  | Admin          |
| Manage Users    | Super Admin    |

# 🎯 Why RBAC?

Right now:
Any logged-in user can access protected routes.
But real apps need:
👤 Normal user
🛠 Admin
📦 Moderator
🏢 Super admin
We must control access based on role.
| Route           | Who Can Access |
| --------------- | -------------- |
| Create Post     | User           |
| Delete Any Post | Admin          |
| View Analytics  | Admin          |
| Manage Users    | Super Admin    |
Without RBAC → Security disaster.

# let's implement:

1️⃣ Add role field in User model
2️⃣ Store role inside JWT
3️⃣ Create authorize middleware
4️⃣ Protect routes with roles

# 🚀 STEP 8 — Pagination + Caching Strategy (Scalable Data Architecture)
But imagine:

1 million users
10 million posts
100k requests per minute
Without pagination and caching?

💀 Your server dies.

Let's implement:
1️⃣ Proper Pagination
2️⃣ Sorting
3️⃣ Redis Caching
4️⃣ Cache Invalidation Strategy
5️⃣ Clean Architecture Patter

# What is BullMQ:
BullMQ is a Node.js job queue library.
which provides: 
Queue
Worker
Scheduler
Retry logic
Delayed jobs
Job priority
Concurrency

BullMQ internally uses ioredis instead of redis client.
| Folder  | Purpose             |
| ------- | ------------------- |
| queues  | queue configuration |
| jobs    | job creation        |
| workers | job processing      |

1️⃣ Why We Cannot Store Images in MongoDB

Some beginners store images directly in MongoDB using Base64 or Buffer.
Example (bad idea):
MongoDB
 └ image: base64data

Problems:
Database becomes huge
Slow queries
Memory issues
Difficult CDN integration

Production systems store only:
imageUrl
Example document:
{
 "caption": "Sunset",
 "image": "https://res.cloudinary.com/.../image.jpg"
}

| Service              | Used By             |
| -------------------- | ------------------- |
| AWS S3               | Netflix             |
| Cloudinary           | Instagram-like apps |
| Google Cloud Storage | YouTube             |
| Azure Blob           | Microsoft apps      |
npm install multer cloudinary multer-storage-cloudinary
| Package                   | Purpose                     |
| ------------------------- | --------------------------- |
| multer                    | handles file uploads        |
| cloudinary                | image storage               |
| multer-storage-cloudinary | connect multer + cloudinary |

Architecture...
Client
 ↓
API (Express)
 ↓
Multer Middleware
 ↓
Cloudinary Upload
 ↓
MongoDB (store image URL)
 ↓
Response

# Full request flow:
Client uploads image
 ↓
Express route
 ↓
upload.single("image")
 ↓
Multer processes file
 ↓
Cloudinary uploads image
 ↓
req.file.path created
 ↓
Controller stores URL in MongoDB
 ↓
Cache invalidated
 ↓
Response sent
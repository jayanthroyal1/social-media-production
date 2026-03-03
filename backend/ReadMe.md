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
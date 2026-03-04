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
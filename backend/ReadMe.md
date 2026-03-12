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

# Add auto deployment.
Developer pushes code to main
        ↓
GitHub Actions
        ↓
Build Docker image
        ↓
Push to Docker Hub
        ↓
SSH into EC2 server
        ↓
Pull latest image
        ↓
Restart Docker containers

# Deployment Architecture
Server environment:
AWS EC2
 ├ Docker
 ├ Docker Compose
 └ Running containers

Containers:
 backend
 frontend
 redis

Images pulled from:
 Docker Hub

# Production Architecture
User Browser
      ↓
Internet
      ↓
Domain Name (DNS)
      ↓
AWS Route53 / Domain Provider
      ↓
Public IP → EC2 Server
      ↓
Nginx Reverse Proxy
      ↓
Docker Containers
   ├ frontend container
   ├ backend container
   └ redis container
      ↓
External services
   ├ MongoDB Atlas
   └ Cloudinary

# Deployment Pipeline
Developer pushes code
      ↓
GitHub Repository
      ↓
GitHub Actions
      ↓
Build Docker Images
      ↓
Push to Docker Hub
      ↓
SSH to EC2
      ↓
Pull new images
      ↓
Restart containers

# InfraStructure
| Component      | Purpose              |
| -------------- | -------------------- |
| Domain         | Public website name  |
| DNS            | Maps domain → server |
| EC2            | Compute server       |
| Elastic IP     | Static public IP     |
| Security Group | Firewall             |
| Docker         | Run application      |
| Nginx          | Reverse proxy        |
| SSL            | HTTPS security       |
| CI/CD          | Automated deployment |

NameCheap already give DNS but still we move DNS to AWS
| Reason            | Explanation               |
| ----------------- | ------------------------- |
| AWS Integration   | Works perfectly with EC2  |
| High Availability | AWS global DNS network    |
| Advanced routing  | Failover, latency routing |
| DevOps learning   | Industry standard         |
Service:

Amazon Route 53
Current situation:

jaynirvan.online
     ↓
Namecheap DNS

We will change it to:

jaynirvan.online
     ↓
Route53 Nameservers
     ↓
Route53 Hosted Zone
     ↓
DNS Records
     ↓
EC2 Elastic IP

AWS --> Route 53 --> Hosited Zone (Create it)
Hosted Zones are like DNS databse for a domain

ns-638.awsdns-15.net
ns-2010.awsdns-59.co.uk
ns-1266.awsdns-30.org
ns-151.awsdns-18.com


ns-638.awsdns-15.net. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400

# EC2
A virtual computer running in AWS data centers

# Architecture After EC2 is Created
User
 ↓
jaynirvan.online
 ↓
Route53 DNS
 ↓
EC2 Public IP
 ↓
Nginx Reverse Proxy
 ↓
Docker Containers
   ├ frontend
   ├ backend
   └ redis
   13.127.107.30 --> with Elastic IP 13.202.1.245

   Why Elastic Ip is Important bcoz if didn't apply the IP will change and DNS will break
Once Elastic Ip is created 
goto Route 53 --> select the hosited route --> create a record and add the name and elastic Ip 
Now If user enters IP traffic will go to

Browser
 ↓
Route53 DNS
 ↓
Elastic IP
 ↓
EC2 Server

# Nignx
 - it is a High Performance web server and reverse proxy
| Feature         | Explanation                          |
| --------------- | ------------------------------------ |
| Web Server      | Serve HTML/CSS/JS files              |
| Reverse Proxy   | Forward requests to backend services |
| Load Balancer   | Distribute traffic across servers    |
| SSL Termination | Handle HTTPS encryption              |
| Caching         | Cache responses                      |


without Reverse Proxy User ---> Backend Server

Problem :
1. Backend exposed directly
2. No SSL
3. No traffic routing
4. Hard to scale

with Nignx

User
|
Nignx
|
Backend
Benefit:
Backend Hidden, SSL, Routing (Different servers), Performance (Caching & comparession) 
User Browser
 ↓
jaynirvan.online
 ↓
Route53 DNS
 ↓
Elastic IP
 ↓
Nginx
 ↓
Docker Containers
   ├ frontend (React)
   ├ backend (Node API)
   └ redis

# Real Reverse Proxy Setup
jaynirvan.online
        ↓
Nginx
        ↓
Frontend (Docker container)

api.jaynirvan.online
        ↓
Nginx
        ↓
Backend API (Docker container)

# New Architeture
User Browser
 ↓
jaynirvan.online
 ↓
Nginx
 ↓
Frontend Container (React)

User API Request
 ↓
api.jaynirvan.online
 ↓
Nginx
 ↓
Backend Container (Node.js) 
So Nginx acts like a traffic controller.
main → production-ready code

develop → active development

feature/* → individual tasks/features

hotfix/* → urgent production fixes

git add .
git commit -m "Added login API"
git push -u origin feature/login-api

# docker-build.yml = Create images automatically in GitHub
# docker-compose.yml = Run containers locally or on server

| Feature              | docker-build.yml                       | docker-compose.yml                     |
| -------------------- | -------------------------------------- | -------------------------------------- |
| **Location**         | GitHub (.github/workflows)             | Local project folder                   |
| **Purpose**          | CI/CD automation → Build & Push images | Run containers together                |
| **Environment**      | GitHub cloud runner                    | Local PC, EC2, VPS                     |
| **Triggers**         | Push to main, workflow dispatch        | You manually run it                    |
| **Uses Docker Hub?** | Yes, pushes images                     | Optional, can use local images         |
| **Builds images?**   | ✔ Yes                                  | ✔ Yes (if build is defined)            |
| **Runs containers?** | ❌ No                                   | ✔ Yes                                  |
| **Best for**         | Deployment                             | Local development + production runtime |


--------------------------Redis Host and port-------------------------
| Environment                 | REDIS_HOST            |
| --------------------------- | --------------------- |
| Local PC                    | `localhost`           |
| Docker Compose              | `redis`               |
| Docker standalone container | container internal IP |
| Cloud VM / EC2              | public IP             |
| Redis Cloud                 | host from Dashboard   |


We have TWO compose modes:
🧑‍💻 Development Mode
build: ./backend
Uses local code.

🚀 Production Mode
image: jayanthroyal/social-backend:latest
Uses Docker Hub image.

| Development       | Production       |
| ----------------- | ---------------- |
| Uses `build:`     | Uses `image:`    |
| Local source code | Docker Hub image |
| Debug-friendly    | Stable release   |
| Rebuild often     | Pull only        |


For Development Mode
docker compose -f docker-compose.dev.yml up --build

For Production Mode
docker compose -f docker-compose.prod.yml up

# CI — Continuous Integration
Automatically:
Code pushed
↓
Build
↓
Run checks
↓
Produce artifact (Docker image)
Goal: Ensure code builds successfully every time

# CD — Continuous Delivery / Deployment
Automatically
Artifact built
↓
Deploy to server
↓
Run application

What This Configuration Does
1️⃣ First Server Block (Frontend)
jaynirvan.online
        ↓
Nginx
        ↓
localhost:3000
Meaning:
Your React/Vite frontend container will run on:
localhost:3000
Users access it via:

http://jaynirvan.online
2️⃣ Second Server Block (Backend)
api.jaynirvan.online
        ↓
Nginx
        ↓
localhost:5000
Meaning:
Your Node.js backend container will run on:
localhost:5000
Users access API via:
http://api.jaynirvan.online
Important Headers Explained
Preserve Host Header
proxy_set_header Host $host;

Keeps the original domain:
jaynirvan.online
Some frameworks require this.

Forward Client IP
proxy_set_header X-Real-IP $remote_addr;
Allows backend to know the real client IP.
Example use:
rate limiting
logging
security
Proxy Forward Chain
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
Tracks all proxy hops.

Example:
client → CDN → nginx → backend
Detect HTTP / HTTPS
proxy_set_header X-Forwarded-Proto $scheme;

Backend knows if request came via:
http
https

Important for OAuth redirects.
Apply Configuration
After saving the file run:
sudo nginx -t
This checks configuration syntax.

Expected output:
syntax is ok
test is successful

Then reload Nginx:
sudo systemctl reload nginx
What Will Happen Now
Right now containers are not running yet.

But routing is prepared:
jaynirvan.online
        ↓
Nginx
        ↓
localhost:3000 (future frontend container)

api.jaynirvan.online
        ↓
Nginx
        ↓
localhost:5000 (future backend container)

# For SSL 
Using Let's Encrypt
EC2 
  Nginx
  certbot
  Let's Encrypt CA

Flow
Certbot --> Let's Encrypt --> Verifies domain ownership ---> Issues SSL certificate
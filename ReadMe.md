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
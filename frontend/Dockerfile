#-----------Multi Stage Dockerfile = Build + Serve
# -----------------Stage 1: Build React App
FROM node:18-alpine As build
# Uses Node 18
# Alpine = lightweight Linux (small image)
#  AS build → names this stage “build”

# ✔ Sets the working directory inside the container
# ✔ All commands will now run inside /app
WORKDIR /app

# Copy package files
# ✔ Copies only package.json + package-lock.json
# ✔ Helps with caching (efficient rebuilds)
COPY package*.json ./

# Install dependencies
# ✔ Runs inside container, not on system
RUN npm install

# Copy all source files - ✔ Copies all your frontend source code into /app
COPY . .

# Build production file
# ✔ Generates production files
# ✔ Output created at: /app/dist
RUN npm run build

#----------Stage2: Serve with Nignx
# ✔ Uses Nginx (very fast web server)
# ✔ Alpine = lightweight
FROM nginx:stable-alpine

# Copy build files from stage 1
# ✔ Copies the built /app/dist folder
# ✔ Puts it into Nginx’s public folder:
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 - ✔ This is why your React app runs on port 80 in the container
# ✔ For container networking (Docker, Kubernetes, ECS)
EXPOSE 80

# Start Nginx
# ✔ Starts nginx in the foreground
# ✔ Required so Docker keeps the container running
CMD ["nginx", "-g", "daemon off;"]
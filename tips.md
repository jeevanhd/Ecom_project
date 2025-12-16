# Docker Tips

This file is a quick reference for running this project with Docker on **Windows**.

## Index:

- [Commands](#1-commands)
- [Notes](#2-notes)
- [Explanations of docker files](#3-line-by-line-explanations-docker-files)
- [Explanations of docker compose](#4-line-by-line-explanations-compose)

## 1) Commands

### A) Start Docker “server” (Docker Engine)

On Windows, the Docker Engine usually runs via **Docker Desktop**.

- Start Docker Desktop manually (Start Menu → Docker Desktop) and wait until it shows **Running**.
- Verify Docker Engine is up:

```bash
docker info
```

If Docker Engine is NOT running, you may see errors like:

```text
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

### B) Stop Docker “server” (Docker Engine)

- Quit Docker Desktop (tray icon → Quit) OR
- In PowerShell:

```powershell
Stop-Process -Name "Docker Desktop" -Force
```

Optional: stop WSL2 backend (can stop all WSL distros):

```powershell
wsl --shutdown
```

### C) Start the project (containers)

From the repo root:

```bash
docker compose up --build
```

Run in the background:

```bash
docker compose up --build -d
```

View logs:

```bash
docker compose logs -f
```

### D) Stop the project (containers)

Stop containers but keep them:

```bash
docker compose stop
```

Stop and remove containers + network:

```bash
docker compose down
```

Stop and remove containers + network + volumes (careful: deletes volume data):

```bash
docker compose down -v
```

### E) Useful troubleshooting

- Show running containers:

```bash
docker ps
```

- Show all containers (including stopped):

```bash
docker ps -a
```

- Rebuild without using cache (slow but helps when “stuck”):

```bash
docker compose build --no-cache
```

- Check your Compose file is valid:

```bash
docker compose config
```

## 2) Notes

### A) Difference between build, image, and container

- **Build**: the process of creating an **image** from a Dockerfile (e.g., `docker compose build`).
- **Image**: a read-only “template” (your code + runtime + dependencies + filesystem snapshot).
- **Container**: a running (or stopped) instance created from an image; it has a small writable layer on top.

Common mapping:

- Dockerfile → build → image
- image → run → container

### B) What is a volume in Docker?

Volumes (and bind mounts) are ways to store data **outside** the container’s writable layer.

- **Bind mount**: maps a host folder into the container.

  - Example in this project: mapping `Backend/src/Middlewares/uploads` into the backend container.
  - Benefit: uploaded files persist even if the container is recreated.

- **Named volume**: managed by Docker (not used in your compose right now).
  - Benefit: easy persistence without tying to a specific host path.

## 3) Line-by-line explanations (Docker files)

### A) Frontend Dockerfile (multi-stage build)

File: [`Frontend/Dockerfile`](./Frontend/Dockerfile)

- Line: `FROM node:18-alpine AS builder`

  - Meaning: use Node 18 on Alpine Linux to build the frontend; names this stage `builder`.

- Line: `WORKDIR /app`

  - Meaning: set the working directory inside the image.

- Line: `COPY package*.json ./`

  - Meaning: copy dependency manifests first to maximize build cache reuse.

- Line: `RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi`

  - Meaning: install dependencies; prefer `npm ci` when lockfile exists for reproducible builds.

- Line: `COPY . .`

  - Meaning: copy the rest of the frontend source into the build stage.

- Line: `ARG VITE_API_URL`

  - Meaning: declare a build-time variable you can pass in from Compose.

- Line: `ENV VITE_API_URL=${VITE_API_URL}`

  - Meaning: set an environment variable during build; Vite reads it and bakes it into the bundle.

- Line: `RUN npm run build`

  - Meaning: compile the production frontend assets into `dist/`.

- Line: `FROM nginx:stable-alpine AS production`

  - Meaning: use Nginx to serve the built static files.

- Line: `COPY --from=builder /app/dist /usr/share/nginx/html`

  - Meaning: copy the build output from the `builder` stage into Nginx’s web root.

- Line: `COPY nginx.conf /etc/nginx/conf.d/default.conf`

  - Meaning: install your Nginx configuration.

- Line: `EXPOSE 80`

  - Meaning: document that the container listens on port 80.

- Line: `STOPSIGNAL SIGTERM`

  - Meaning: when stopping the container, send SIGTERM so Nginx can shut down gracefully.

- Line: `CMD [ "nginx", "-g", "daemon off;" ]`
  - Meaning: start Nginx in the foreground (required so the container stays alive).

### B) Backend Dockerfile

File: [`Backend/Dockerfile`](./Backend/Dockerfile)

- Line: `FROM node:18-alpine`

  - Meaning: use Node 18 on Alpine Linux as the runtime image.

- Line: `WORKDIR /app`

  - Meaning: set working directory.

- Line: `COPY package*.json ./`

  - Meaning: copy dependency manifests first for caching.

- Line: `RUN npm ci --only=production`

  - Meaning: install only production dependencies (requires `package-lock.json` for best results).

- Line: `COPY . .`

  - Meaning: copy the backend source into the image.

- Line: `RUN mkdir -p src/Middlewares/uploads`

  - Meaning: ensure the uploads directory exists inside the image.

- Line: `ENV NODE_ENV=production`

  - Meaning: run the app in production mode.

- Line: `EXPOSE 8080`

  - Meaning: document backend listens on port 8080.

- Line: `CMD [ "node", "src/index.js" ]`
  - Meaning: start the Node backend server.

## 4) Line-by-line explanations (Compose)

### A) docker-compose.yml

- Line: `services:`

  - Meaning: defines the set of containers to run.

- Line: `backend:`

  - Meaning: service name for the backend.

- Lines under `build:`

  - Meaning: build an image from `./Backend/Dockerfile`.

- Line: `ports: - "8080:8080"`

  - Meaning: expose backend on `http://localhost:8080`.

- Lines under `environment:`

  - Meaning: pass environment variables into the backend container.
  - Note: if these aren’t set on your machine or in a `.env` file, Compose warns and uses blank values.

- Line: `volumes: - ./Backend/src/Middlewares/uploads:/app/src/Middlewares/uploads`

  - Meaning: bind mount uploads folder so files persist on your PC.

- Line: `restart: unless-stopped`

  - Meaning: auto-restart unless you explicitly stop it.

- Line: `frontend:`

  - Meaning: service name for the frontend.

- Lines under `build: ... args: VITE_API_URL: "http://localhost:8080"`

  - Meaning: bake the backend URL into the built frontend bundle.
  - Important: this URL is used by the _browser_, so it must be reachable from your host (usually `localhost`).

- Line: `ports: - "5173:80"`

  - Meaning: expose frontend at `http://localhost:5173` (maps host 5173 to container’s Nginx port 80).

- Line: `depends_on: - backend`
  - Meaning: start backend before frontend (start-order only; not a “health check”).

### B) docker-compose.frontend.yml

- Purpose: run only the frontend container (expects backend already running on `http://localhost:8080`).

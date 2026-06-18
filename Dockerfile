# syntax=docker/dockerfile:1
FROM node:20-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies based on the lockfile/manifest.
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

EXPOSE 3000

# Dev server by default; production image would `npm run build` + `npm start`.
CMD ["npm", "run", "dev"]

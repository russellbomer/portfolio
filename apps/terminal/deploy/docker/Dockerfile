# Terminal WebSocket Server Dockerfile
# Node.js server that manages WebSocket connections and spawns session containers

FROM node:20-alpine

# Install minimal dependencies
RUN apk add --no-cache \
    wget \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN adduser -D -u 1000 terminal

# Create app directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy TypeScript config and source code
COPY tsconfig.json ./
COPY server.ts ./
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Create data directory
RUN mkdir -p /app/data/quarry-output && chown -R terminal:terminal /app/data

# Switch to non-root user
USER terminal

# Expose port
EXPOSE 4001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:4001/health || exit 1

# Start server
CMD ["node", "dist/server.js"]

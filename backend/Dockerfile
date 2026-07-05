# Stage 1: Build & Dependencies
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy only package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies (faster and smaller image)
RUN npm ci --only=production

# Stage 2: Production Image (Multi-stage build for minimal size)
FROM node:18-alpine

WORKDIR /usr/src/app

# The "Why": We run our application as a non-root user to adhere to the Least Privilege Principle in containers.
RUN addgroup -S nodeuser && adduser -S nodeuser -G nodeuser

# Copy node_modules from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy application source code
COPY . .

# Change ownership to the non-root user
RUN chown -R nodeuser:nodeuser /usr/src/app

# Switch to the non-root user
USER nodeuser

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]

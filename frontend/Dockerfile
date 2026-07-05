# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx (Highly Optimized)
FROM nginx:alpine

# The "Why": We copy the compiled static assets from the builder stage into Nginx's serving directory.
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# The "Why": We overwrite the default Nginx config to ensure React Router works correctly (fallback to index.html).
RUN echo -e 'server {\n\
    listen 80;\n\
    location / {\n\
    root   /usr/share/nginx/html;\n\
    index  index.html index.htm;\n\
    try_files $uri $uri/ /index.html;\n\
    }\n\
    }' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
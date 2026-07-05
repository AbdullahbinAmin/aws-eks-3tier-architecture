# EKS User Directory - Frontend

This is the React (Vite) frontend for the 3-tier User Directory application, designed to be deployed on AWS EKS with an Ingress Controller.

## Features
* **Vite & React 18:** Blazing fast development environment and component-driven architecture.
* **Premium UI:** Custom Vanilla CSS implementing modern glassmorphism, dark mode, and micro-animations.
* **Microservice Integration:** Fully decoupled and communicates with the backend Node.js microservice via REST API.

## Local Development
To run the frontend locally:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will typically be available at `http://localhost:5173`.*

## Architecture Note
In production (AWS EKS), this frontend will be containerized and served via an Ingress Controller (with SSL via Let's Encrypt), communicating securely with the backend microservice inside the cluster.

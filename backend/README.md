# EKS User Directory - Backend Microservice

This is the Node.js backend microservice for the 3-tier User Directory application, designed to be deployed on AWS EKS (Elastic Kubernetes Service).

## Technologies Used
* **Node.js & Express.js:** Lightweight and fast web framework.
* **MySQL2 (Promise):** Asynchronous database driver for connecting to the database.
* **Docker:** Multi-stage Dockerfile adhering to the Principle of Least Privilege (running as a non-root user).

## Local Development
To run this microservice locally:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   node server.js
   ```
   *Note: Ensure you have a local MySQL instance running or configure the `DB_HOST`, `DB_USER`, and `DB_PASSWORD` environment variables.*

## Kubernetes Deployment (AWS EKS)
This service is designed to run in a Private Subnet within an AWS EKS cluster. It includes a `/health` endpoint specifically for Kubernetes Liveness and Readiness probes.

# Phase 4: Containerization & AWS ECR

With our workstation ready, we needed to package our Backend (Node.js) and Frontend (React/Nginx) code into Docker containers and push them to a private AWS repository.

## 1. Creating Elastic Container Registry (ECR) Repositories
1. Opened the AWS Console and navigated to **Elastic Container Registry**.
2. Created two private repositories:
   - `backend-microservice`
   - `frontend-microservice`

## 2. Dockerizing the Applications
We uploaded our code files to the Ubuntu server and built the images using the Docker CLI.

### Authenticate Docker with AWS
```bash
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 857184531197.dkr.ecr.eu-north-1.amazonaws.com
```

### Build & Push Backend
```bash
cd backend
docker build -t backend-microservice .
docker tag backend-microservice:latest 857184531197.dkr.ecr.eu-north-1.amazonaws.com/backend-microservice:latest
docker push 857184531197.dkr.ecr.eu-north-1.amazonaws.com/backend-microservice:latest
```

### Build & Push Frontend
```bash
cd frontend
docker build -t frontend-microservice .
docker tag frontend-microservice:latest 857184531197.dkr.ecr.eu-north-1.amazonaws.com/frontend-microservice:latest
docker push 857184531197.dkr.ecr.eu-north-1.amazonaws.com/frontend-microservice:latest
```

*Note: The Frontend Dockerfile utilized a multi-stage build. It first compiled the React app using Node.js, and then copied the static `dist/` files into a lightweight `nginx:alpine` container to serve them.*

---
*Next Step: [Deploying the EKS Cluster](05-eks-cluster.md)*

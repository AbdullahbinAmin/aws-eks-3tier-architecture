# How to Explain This Project in an Interview

When an interviewer asks: *"Can you walk me through your recent DevOps project?"*, you want to sound confident, structured, and focused on **problem-solving**. 

Here is a step-by-step, easy-to-understand script you can use to explain your entire 3-Tier EKS architecture.

---

## 1. The Introduction (The "Elevator Pitch")
"Recently, I architected and deployed a production-grade 3-Tier Web Application on Amazon Web Services. I used Docker to containerize a React frontend and a Node.js backend, and then deployed the entire stack onto a highly-available Amazon EKS (Kubernetes) cluster. I also configured a custom domain and secured the application with an SSL certificate for HTTPS traffic."

## 2. Phase 1: Security & Networking Foundation
"Before deploying any servers, I focused on building a secure network and security structure.
- I designed and deployed a custom VPC named `three-tier-vpc` with public subnets spread across three Availability Zones for high availability, along with custom route tables and an Internet Gateway.
- I followed the **Principle of Least Privilege** by creating specific AWS IAM Roles: `eks-cluster-role` for the EKS control plane to manage AWS resources, and `eks-node-role` for EKS worker nodes to join the cluster and pull from ECR.
- Instead of using my local computer, I provisioned an **Ubuntu EC2 instance** named `three-tier-workstation` within our custom VPC to act as a secure DevOps Workstation (Jumpbox). I protected it with a custom security group `three-tier-workstation-sg` and installed all my tools like Docker, AWS CLI, and `kubectl`."

## 3. Phase 2: Containerization
"Next, I containerized the application. 
- For the backend, I wrote a Dockerfile for the Node.js API.
- For the frontend, I used a **Multi-Stage Dockerfile**. First, it built the React app using Node.js, and then it copied the static files into a lightweight **Nginx** server. 
- Once the images were built, I pushed them securely to **Amazon ECR (Elastic Container Registry)** under the repositories `backend-microservice` and `frontend-microservice`."

## 4. Phase 3: The EKS Cluster & Challenges
"Then came the infrastructure. I deployed an EKS cluster (`my-eks-cluster`) and node group (`eks-small-nodegroup`), but I ran into a major networking challenge. 

**The Challenge:** I initially tried to use Free Tier `t3.micro` instances for my worker nodes. However, I discovered that AWS has strict 'ENI limits'. A `t3.micro` only allows 4 pods, which wasn't enough space for my application pods to run alongside the default Kubernetes system pods. 
**The Solution:** I upgraded my Node Group to use `t3.small` instances which allow up to 11 pods. Additionally, to avoid `kubectl` timing out over port 443, I applied a networking shortcut by sharing the workstation's `three-tier-workstation-sg` and the VPC's `default` security group with the EKS Control Plane."

## 5. Phase 4: Kubernetes Deployment (The 3 Tiers)
"With the cluster running, I deployed the three tiers using Kubernetes YAML manifests:
1. **The Data Tier:** I deployed a MySQL database as a **StatefulSet**. Because AWS EBS volumes can be tricky to provision on EKS clusters without OIDC drivers, I engineered a solution using a `hostPath` volume. This forced the database to use the local SSD physically attached to the EC2 worker node.
2. **The Logic Tier:** I deployed the Node.js backend as a `Deployment` and exposed it internally using a `ClusterIP` service.
3. **The Presentation Tier:** I deployed the React frontend. To expose it to the internet, I used a `LoadBalancer` service, which automatically provisioned an **AWS Classic Load Balancer**. I also configured Nginx to act as a **Reverse Proxy** so that frontend API calls were correctly routed to the internal backend service."

## 6. Phase 5: CI/CD Automation
"Manually deploying code isn't scalable, so I built a fully automated CI/CD pipeline using **AWS CodePipeline** and **AWS CodeBuild**.
- I integrated the pipeline directly with my GitHub repository.
- I wrote a `buildspec.yml` file that triggers on every push to the `main` branch. 
- The pipeline spins up a temporary Ubuntu environment, builds my Docker images, pushes them to Amazon ECR, authenticates with my EKS cluster using an IAM Access Entry, and automatically deploys the updated pods using zero-downtime Kubernetes rollouts."

## 7. The Conclusion
"Overall, this project gave me massive hands-on experience with custom VPC design, Kubernetes networking, AWS IAM Identity mismatches, Docker multi-stage builds, CI/CD automation, and DNS propagation troubleshooting. It perfectly mimics a real-world enterprise deployment."

---
*Return to: [Main README](../README.md)*

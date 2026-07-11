# Phase 2: VPC & Networking Configuration

Before launching EC2 instances or an EKS Cluster, it is critical to understand the networking foundation. For this project, we utilized the **Default VPC** provided by AWS, which is pre-configured for high availability.

## 1. The Default VPC
AWS accounts come with a Default VPC in every region (e.g., `eu-north-1` Stockholm). 
- It includes an **Internet Gateway (IGW)** attached by default, allowing resources to communicate with the public internet.
- It includes a default Route Table routing `0.0.0.0/0` traffic to the IGW.

## 2. Subnets
The Default VPC in `eu-north-1` contains 3 **Public Subnets** (one in each Availability Zone: `eu-north-1a`, `eu-north-1b`, `eu-north-1c`).
- Because these subnets are public, any EC2 instance (like our Ubuntu Workstation or EKS Worker Nodes) launched into them can be assigned an Auto-Assign Public IP address.
- This allowed us to bypass the need for an expensive NAT Gateway, which is typically required if worker nodes are placed in Private Subnets.

## 3. Security Groups
Security Groups act as virtual firewalls for instances.
- **EKS Security Groups:** Kubernetes automatically generated and managed the Security Groups for the Cluster Control Plane and the Worker Nodes.
- **Load Balancer Security Group:** Automatically created by the Kubernetes Cloud Controller to allow incoming HTTPS (443) and HTTP (80) traffic from the internet (`0.0.0.0/0`).
- **Workstation Security Group:** We manually allowed SSH (Port 22) inbound traffic from our IP address to access the MobaXterm Ubuntu server.

---
*Next Step: [IAM Roles & Policies Configuration](03-iam-roles.md)*

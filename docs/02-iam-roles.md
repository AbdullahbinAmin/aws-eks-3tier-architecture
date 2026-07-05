# Phase 2: IAM Roles & Policies Configuration

EKS and EC2 require specific roles to interact with each other and other AWS services (like ECR and Elastic Load Balancing).

## 1. EKS Cluster Role
This role allows the Kubernetes control plane to manage resources (like Load Balancers) on your behalf.
- **Role Name:** `eks-cluster-role`
- **Trusted Entity:** `eks.amazonaws.com`
- **Attached Policies:**
  - `AmazonEKSClusterPolicy`

## 2. EKS Node Group Role
This role allows the EC2 worker nodes within the EKS cluster to join the cluster and pull Docker images from ECR.
- **Role Name:** `eks-node-role`
- **Trusted Entity:** `ec2.amazonaws.com`
- **Attached Policies:**
  - `AmazonEKSWorkerNodePolicy`
  - `AmazonEKS_CNI_Policy`
  - `AmazonEC2ContainerRegistryReadOnly`

## 3. EC2 Workstation Role
To securely allow our Ubuntu workstation to execute `eksctl` commands and push images to ECR without hardcoding AWS Access Keys, we attached an IAM role directly to the EC2 instance.
- **Role Name:** `EC2-ECR-Push-Role`
- **Trusted Entity:** `ec2.amazonaws.com`
- **Attached Policies:**
  - `AmazonEC2ContainerRegistryPowerUser` (To push images to ECR)
  - `AdministratorAccess` (Attached later to overcome `eksctl` node group creation limitations).

---
*Next Step: [Provisioning the Workstation (EC2)](03-ec2-workstation.md)*

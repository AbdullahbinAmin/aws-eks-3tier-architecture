# Phase 2: IAM Roles & Policies Configuration

EKS and EC2 require specific roles to interact with each other and other AWS services. Here is the exact step-by-step process used to create these roles in the AWS Console.

## 1. EKS Cluster Role
This role allows the Kubernetes control plane to manage AWS resources (like Load Balancers) on your behalf.

**How to Create:**
1. Open the AWS Console and go to **IAM** -> **Roles** -> **Create role**.
2. **Trusted entity type:** Select `AWS service`.
3. **Use case:** Select `EKS` from the dropdown, then select `EKS - Cluster`. Click Next.
4. **Permissions:** The policy `AmazonEKSClusterPolicy` will be automatically attached. Click Next.
5. **Role name:** Enter `eks-cluster-role`.
6. Click **Create role**.

## 2. EKS Node Group Role
This role allows the EC2 worker nodes within the EKS cluster to join the cluster and pull Docker images from ECR.

**How to Create:**
1. Go to **IAM** -> **Roles** -> **Create role**.
2. **Trusted entity type:** Select `AWS service`.
3. **Use case:** Select `EC2`. Click Next.
4. **Permissions:** Search for and select the following three policies by checking their boxes:
   - `AmazonEKSWorkerNodePolicy`
   - `AmazonEKS_CNI_Policy`
   - `AmazonEC2ContainerRegistryReadOnly`
5. Click Next.
6. **Role name:** Enter `eks-node-role`.
7. Click **Create role**.

## 3. EC2 Workstation Role
To securely allow our Ubuntu workstation to execute `eksctl` commands and push images to ECR without hardcoding AWS Access Keys, we attached an IAM role directly to the EC2 instance.

**How to Create:**
1. Go to **IAM** -> **Roles** -> **Create role**.
2. **Trusted entity type:** Select `AWS service`.
3. **Use case:** Select `EC2`. Click Next.
4. **Permissions:** Search for and select:
   - `AmazonEC2ContainerRegistryPowerUser` (To push images to ECR)
   - `AdministratorAccess` (Attached later to overcome `eksctl` Node Group creation permission limits).
5. Click Next.
6. **Role name:** Enter `EC2-ECR-Push-Role`.
7. Click **Create role**.

---
*Next Step: [Provisioning the Workstation (EC2)](04-ec2-workstation.md)*

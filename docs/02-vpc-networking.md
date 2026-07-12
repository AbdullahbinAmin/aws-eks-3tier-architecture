# Phase 2: VPC & Custom Networking Configuration

Before launching EC2 instances or an EKS Cluster, we must build a secure, isolated network foundation. Instead of using the default VPC, we designed and deployed a custom VPC from scratch to enforce high availability and proper traffic routing.

## 1. Creating the Custom VPC
1. Open the AWS Console and navigate to the **VPC Dashboard**.
2. Click **Your VPCs** on the left menu, then click **Create VPC**.
3. Configure the following settings:
   - **Resources to create:** Select **VPC only** (to configure everything manually for maximum learning and control).
   - **Name tag:** `three-tier-vpc`
   - **IPv4 CIDR block:** Manual input -> `10.0.0.0/16`
   - **IPv6 CIDR block:** No IPv6 CIDR block
   - **Tenancy:** Default
4. Click **Create VPC**.

## 2. Creating the Public Subnets
To run a high-availability EKS cluster, we must provision subnets across at least two (ideally three) different Availability Zones.
1. Click **Subnets** on the left menu, then click **Create subnet**.
2. **VPC ID:** Select `three-tier-vpc`.
3. Add the following three subnets one by one:
   - **Subnet 1:**
     - Subnet name: `three-tier-pub-subnet-1`
     - Availability Zone: `eu-north-1a` (Stockholm Zone A)
     - IPv4 CIDR block: `10.0.1.0/24`
   - **Subnet 2:**
     - Subnet name: `three-tier-pub-subnet-2`
     - Availability Zone: `eu-north-1b` (Stockholm Zone B)
     - IPv4 CIDR block: `10.0.2.0/24`
   - **Subnet 3:**
     - Subnet name: `three-tier-pub-subnet-3`
     - Availability Zone: `eu-north-1c` (Stockholm Zone C)
     - IPv4 CIDR block: `10.0.3.0/24`
4. Click **Create subnet**.

### 🚨 Critical Configuration: Auto-Assign Public IPs
By default, custom subnets do not assign public IPs. We must enable this so our Workstation and EKS Nodes are accessible:
1. Select `three-tier-pub-subnet-1` from the list.
2. Click **Actions** -> **Edit subnet settings**.
3. Check the box for **Enable auto-assign public IPv4 address**.
4. Click Save.
5. **Repeat these steps** for `three-tier-pub-subnet-2` and `three-tier-pub-subnet-3`.

### 🏷️ Critical Subnet Tags for Kubernetes Load Balancers
EKS requires specific tags to discover public subnets for external load balancers.
1. For each of the three subnets, click on the **Tags** tab and click **Manage tags**.
2. Add the following tag:
   - **Key:** `kubernetes.io/role/elb`
   - **Value:** `1`
3. Click Save rules.

## 3. Provisioning the Internet Gateway (IGW)
An IGW connects our VPC to the public internet.
1. Click **Internet Gateways** on the left menu, then click **Create internet gateway**.
2. **Name tag:** `three-tier-igw`
3. Click **Create internet gateway**.
4. Once created, click **Actions** -> **Attach to VPC**.
5. Select `three-tier-vpc` from the dropdown and click **Attach internet gateway**.

## 4. Designing the Route Table
To direct outbound traffic to the internet, we must configure a Route Table.
1. Click **Route Tables** on the left menu, then click **Create route table**.
2. Configure settings:
   - **Name tag:** `three-tier-public-rt`
   - **VPC:** `three-tier-vpc`
3. Click **Create route table**.
4. Select `three-tier-public-rt` and go to the **Routes** tab, then click **Edit routes**.
5. Click **Add route**:
   - **Destination:** `0.0.0.0/0` (All outbound traffic)
   - **Target:** Select **Internet Gateway**, then select `three-tier-igw`.
6. Click **Save changes**.

### Subnet Associations
We must associate our subnets with this route table so they inherit the routing rule:
1. Select `three-tier-public-rt`, go to the **Subnet associations** tab, and click **Edit subnet associations**.
2. Check the boxes for `three-tier-pub-subnet-1`, `three-tier-pub-subnet-2`, and `three-tier-pub-subnet-3`.
3. Click **Save associations**.

Our custom VPC network infrastructure is now fully provisioned and securely configured!

---
*Next Step: [IAM Roles & Policies Configuration](03-iam-roles.md)*

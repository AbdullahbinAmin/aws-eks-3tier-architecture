# Phase 7: Deploying the EKS Cluster

This phase was the most complex part of the architecture, requiring us to connect our Kubernetes Control Plane to our custom VPC networking and establish secure communications between our nodes, cluster, and workstation.

## 1. Creating the Cluster (AWS Console)
1. Open the AWS Console and navigate to **Elastic Kubernetes Service** -> **Clusters** -> **Add cluster** -> **Create**.
2. **Configure cluster settings:**
   - **Name:** `my-eks-cluster`
   - **Kubernetes version:** Select default (e.g., `1.30`)
   - **Cluster service role:** Select `eks-cluster-role` (which we created in Phase 3).
3. Click Next.
4. **Specify networking (Networking settings):**
   - **VPC:** Select `three-tier-vpc` from the dropdown.
   - **Subnets:** Select all three custom public subnets (`three-tier-pub-subnet-1`, `three-tier-pub-subnet-2`, and `three-tier-pub-subnet-3`).
   - **Cluster endpoint access:** Ensure **Public** (or Public and Private) is selected.
5. **Security Groups (The Shortcut):**
   - Under the **Additional security groups** dropdown, select:
     - `three-tier-workstation-sg` (your Ubuntu Workstation's security group).
     - `default` (the default security group for `three-tier-vpc`).
   - *(Note: This is a clever shortcut! By doing this, we force the EKS Control Plane to share the exact same firewall rules as our workstation and node groups. This completely prevents the dreaded `kubectl i/o timeout` error without needing to manually write complex bi-directional rules later!)*
6. **Select Add-ons:**
   - Leave only the 3 essential default add-ons selected: **CoreDNS**, **kube-proxy**, and **Amazon VPC CNI**.
   - Unselect everything else to keep the cluster lightweight and avoid Free Tier charges.
7. Click Next, keep default logging, click Next, review, and click **Create**.
8. Wait ~15 minutes for the cluster control plane to provision.

## 2. The `t3.micro` Pod Limit Challenge
When creating a Node Group, we initially wanted to use `t3.micro` (Free Tier). However, AWS hardcodes Elastic Network Interface (ENI) limits. A `t3.micro` allows a maximum of exactly **4 pods**. Since Kubernetes uses fundamental system pods (`aws-node`, `kube-proxy`), we had 0 slots left for our application.
**Solution:** We upgraded the Node Group to use a `t3.small` instance (allows 11 pods).

## 3. Creating the Node Group (AWS Console)
Instead of using `eksctl`, we created the node group directly in the AWS Console:
1. In your EKS Cluster dashboard (`my-eks-cluster`), go to the **Compute** tab.
2. Click **Add Node Group**.
3. Configure settings:
   - **Name:** `eks-small-nodegroup`
   - **Node IAM Role:** Select `eks-node-role` (created in Phase 3).
4. Click Next.
5. **Set compute and scaling configuration:**
   - **AMI type:** Amazon Linux 2 (AL2_x86_64)
   - **Capacity type:** On-Demand
   - **Instance types:** `t3.small`
   - **Disk size:** 20 GiB (default)
   - **Scaling:** Minimum: 1, Maximum: 1, Desired: 1.
6. Click Next.
7. **Configure networking:**
   - **Subnets:** Select public subnets (`three-tier-pub-subnet-1`, `three-tier-pub-subnet-2`, `three-tier-pub-subnet-3`).
   - **Configure SSH access to nodes:** (Optional, keep disabled).
8. Click Next, review, and click **Create**.

## 4. Connecting the Workstation & Fixing Security Groups
We updated our Ubuntu workstation `kubeconfig` to communicate with the cluster.
1. Connect to your `three-tier-workstation` via MobaXterm.
2. Run the update config command:
   ```bash
   aws eks update-kubeconfig --region eu-north-1 --name my-eks-cluster
   ```

### 🚨 Troubleshooting: Security Groups & `i/o timeout`
When creating Node Groups manually from the console, the Nodes and the EKS Cluster might not have permission to talk to each other, resulting in nodes not joining, or `kubectl` timing out (`dial tcp ...:443: i/o timeout`).

**The Fix (Bi-Directional Security Group Rules):**
If you did not apply "The Shortcut" during step 1:
1. Open the AWS Console and go to **EC2** -> **Security Groups**.
2. Find the **Cluster Security Group** (its description usually says *EKS created security group applied to ENI...*).
3. Find the **Node Security Group** (the one attached to your `t3.small` worker nodes).

**Rule 1: Allow Cluster to talk to Nodes**
- Edit the Inbound rules of the **Node Security Group**.
- Add Rule: **Type:** `All Traffic` | **Source:** Select the *Cluster Security Group*.

**Rule 2: Allow Nodes & Workstation to talk to Cluster**
- Edit the Inbound rules of the **Cluster Security Group**.
- Add Rule: **Type:** `HTTPS (443)` | **Source:** Select the *Node Security Group*.
- Add Rule: **Type:** `HTTPS (443)` | **Source:** Select the *three-tier-workstation-sg*.

Save all rules. Run `kubectl get nodes` again, and your nodes will instantly show up in the `Ready` state!

### 🚨 Troubleshooting 2: The `provide credentials` Error
If you run `kubectl get nodes` and receive an error saying `the server has asked for the client to provide credentials`, this is an AWS IAM Identity mismatch.

By default, an EKS Cluster only allows the exact AWS User who created it to access the cluster. If you created the cluster in the AWS Console using your `devops-engineer` IAM user, but your Ubuntu server is trying to access it using its attached EC2 IAM Role, the cluster will reject the connection because it doesn't recognize the EC2 Role!

**The Fix:**
You must configure your Ubuntu server's AWS CLI to authenticate as the `devops-engineer` user.
1. In your MobaXterm terminal, run:
   ```bash
   aws configure
   ```
2. Enter your `devops-engineer` **AWS Access Key ID**.
3. Enter your `devops-engineer` **AWS Secret Access Key**.
4. Default region name: `eu-north-1`
5. Default output format: `json`

Run `aws eks update-kubeconfig --region eu-north-1 --name my-eks-cluster` again, then run `kubectl get nodes`. You will now be successfully authenticated!

---
*Next Step: [Applying Kubernetes Manifests](08-kubernetes-deployment.md)*

# Phase 7: Deploying the EKS Cluster

This phase was the most complex part of the architecture, requiring us to overcome AWS Free Tier networking limitations and strict Security Group firewalls.

## 1. Creating the Cluster (AWS Console)
1. Navigated to **Elastic Kubernetes Service** -> Add cluster -> Create.
2. **Name:** `my-eks-cluster`
3. **Role:** Selected the `eks-cluster-role`.
4. **Networking:** Kept the default VPC but ensured **Public Access** was enabled.
5. **Security Groups (The Shortcut):** We explicitly selected our Ubuntu Workstation's Security Group (`eks-server-sg`) and the Default VPC Security Group under the *Additional security groups* dropdown. 
   *(Note: This is a clever shortcut! By doing this, we forced the EKS Control Plane to share the exact same firewall rules as our workstation and node groups. This completely prevents the dreaded `kubectl i/o timeout` error without needing to manually write bi-directional rules later!)*
6. **Add-ons:** Left only the 3 essential default add-ons selected (**CoreDNS**, **kube-proxy**, and **Amazon VPC CNI**) and unselected everything else to keep the cluster lightweight and avoid Free Tier charges.
7. Waited ~15 minutes for the cluster control plane to provision.

## 2. The `t3.micro` Pod Limit Challenge
When creating a Node Group, we initially wanted to use `t3.micro` (Free Tier). However, AWS hardcodes Elastic Network Interface (ENI) limits. A `t3.micro` allows a maximum of exactly **4 pods**. Since Kubernetes uses fundamental system pods (`aws-node`, `kube-proxy`), we had 0 slots left for our application.
**Solution:** We upgraded the Node Group to use a `t3.small` instance (allows 11 pods).

## 3. Creating the Node Group (AWS Console)
Instead of using `eksctl`, we created the node group directly in the AWS Console:
1. In your EKS Cluster dashboard, go to the **Compute** tab.
2. Click **Add Node Group**.
3. **Name:** `eks-small-nodegroup`
4. **IAM Role:** Select `eks-node-role`.
5. **Compute Configuration:** Select `t3.small`.
6. **Scaling:** Minimum: 1, Maximum: 1, Desired: 1.
7. **Networking:** Ensure the subnets match your VPC and click Create.

## 4. Connecting the Workstation & Fixing Security Groups
We updated our Ubuntu workstation `kubeconfig` to communicate with the cluster:
```bash
aws eks update-kubeconfig --region eu-north-1 --name my-eks-cluster
```

### 🚨 Troubleshooting: Security Groups & `i/o timeout`
When creating Node Groups manually from the console, the Nodes and the EKS Cluster might not have permission to talk to each other, resulting in nodes not joining, or `kubectl` timing out (`dial tcp ...:443: i/o timeout`).

**The Fix (Bi-Directional Security Group Rules):**
1. Open the AWS Console and go to **EC2** -> **Security Groups**.
2. Find the **Cluster Security Group** (its description usually says *EKS created security group applied to ENI...*).
3. Find the **Node Security Group** (the one attached to your `t3.small` worker nodes).

**Rule 1: Allow Cluster to talk to Nodes**
- Edit the Inbound rules of the **Node Security Group**.
- Add Rule: **Type:** `All Traffic` | **Source:** Select the *Cluster Security Group*.

**Rule 2: Allow Nodes & Workstation to talk to Cluster**
- Edit the Inbound rules of the **Cluster Security Group**.
- Add Rule: **Type:** `HTTPS (443)` | **Source:** Select the *Node Security Group*.
- Add Rule: **Type:** `HTTPS (443)` | **Source:** Select the *Workstation Security Group* (or `0.0.0.0/0` to let your terminal's `kubectl` connect without timing out).

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

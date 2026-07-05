# Phase 5: Deploying the EKS Cluster

This phase was the most complex part of the architecture, requiring us to overcome AWS Free Tier networking limitations and strict Security Group firewalls.

## 1. Creating the Cluster (AWS Console)
1. Navigated to **Elastic Kubernetes Service** -> Add cluster -> Create.
2. **Name:** `my-eks-cluster`
3. **Role:** Selected the `eks-cluster-role`.
4. **Networking:** Kept the default VPC but ensured **Public Access** was enabled.
5. Waited ~15 minutes for the cluster control plane to provision.

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

### 🚨 Troubleshooting: The `kubectl` Timeout Error
If you run `kubectl get nodes` and receive an `i/o timeout` error (e.g., `dial tcp ...:443: i/o timeout`), it means your Ubuntu Workstation is being blocked by the EKS Cluster's firewall!

**The Fix:**
1. Open the AWS Console and go to **EC2** -> **Security Groups**.
2. Find the Security Group created for your EKS Cluster (the description will say something like *EKS created security group applied to ENI that is attached to EKS Control Plane node*).
3. Select it and click **Edit inbound rules**.
4. Add a new rule:
   - **Type:** `HTTPS` (Port `443`)
   - **Source:** Custom -> Select the Security Group of your Ubuntu Workstation (or `0.0.0.0/0` for universal access).
5. Save the rule.

Run `kubectl get nodes` again, and the error will instantly disappear, showing your `t3.small` node in the `Ready` state!

---
*Next Step: [Applying Kubernetes Manifests](06-kubernetes-deployment.md)*

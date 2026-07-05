# Phase 5: Deploying the EKS Cluster

This phase was the most complex part of the architecture, requiring us to overcome several AWS Free Tier networking limitations.

## 1. Creating the Cluster (AWS Console)
1. Navigated to **Elastic Kubernetes Service** -> Add cluster -> Create.
2. **Name:** `my-eks-cluster`
3. **Role:** Selected the `eks-cluster-role` created in Phase 2.
4. **Networking:** Kept the default VPC but ensured **Public Access** was enabled.
5. Waited ~15 minutes for the cluster control plane to provision.

## 2. Connecting the Workstation to the Cluster
We updated our Ubuntu `kubeconfig` file to allow `kubectl` to communicate with the new cluster:
```bash
aws eks update-kubeconfig --region eu-north-1 --name my-eks-cluster
```

## 3. The `t3.micro` Pod Limit Challenge
Initially, we attempted to create a Node Group using AWS Free Tier `t3.micro` instances via the AWS Console.

**The Problem:**
AWS hardcodes Elastic Network Interface (ENI) limits based on instance sizes. A `t3.micro` instance is restricted to a maximum of exactly **4 pods**. Since Kubernetes requires fundamental system pods (like `aws-node` and `kube-proxy`) just to run, we were left with 0 available pod slots for our actual application.

**The Solution:**
We abandoned the `t3.micro` Console approach and instead used a slightly larger `t3.small` instance (which allows up to 11 pods).

Because the AWS Console enforces strict subnet and VPC requirements that were out of sync, we used the `eksctl` command-line tool from our Ubuntu server to seamlessly create the `t3.small` Node Group.

### Creating the Node Group via `eksctl`
```bash
eksctl create nodegroup \
  --cluster my-eks-cluster \
  --region eu-north-1 \
  --name eks-small-nodegroup \
  --node-type t3.small \
  --nodes 1 \
  --nodes-min 1 \
  --nodes-max 1
```

Once the node group successfully attached to the cluster, we verified its capacity:
```bash
kubectl get nodes
```

---
*Next Step: [Applying Kubernetes Manifests](06-kubernetes-deployment.md)*

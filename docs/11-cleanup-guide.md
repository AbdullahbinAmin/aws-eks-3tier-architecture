# Phase 11: Tearing Down & Cost Prevention

AWS resources are billed by the hour. To avoid unexpected charges after completing this project, you must tear down all provisioned resources. 

Follow this exact step-by-step deletion checklist in order.

---

## 🚨 STEP 1: Delete Kubernetes Services First!
Before deleting your EKS Cluster, you **MUST** delete your Kubernetes deployments and services. 
*Why?* If you delete the cluster first, AWS will lose track of the automatically provisioned **Classic Load Balancer (ELB)**, leaving it running in your account and billing you indefinitely.

1. Connect to your `three-tier-workstation` EC2 instance via MobaXterm.
2. Navigate to your project folder:
   ```bash
   cd ~/aws-eks-3tier-architecture
   ```
3. Run the delete command:
   ```bash
   kubectl delete -f k8s/
   ```
   *(This will delete the deployments, services, and the statefulset, automatically triggering AWS to delete your Classic Load Balancer).*
4. Verify the Load Balancer is gone:
   ```bash
   kubectl get svc
   ```
   *(Ensure only the default `kubernetes` service remains).*

---

## STEP 2: Delete EKS Node Group
1. Open the AWS Console and navigate to **Elastic Kubernetes Service** -> **Clusters** -> `my-eks-cluster`.
2. Go to the **Compute** tab.
3. Under **Node Groups**, select `eks-small-nodegroup` and click **Delete**.
4. Type `eks-small-nodegroup` in the confirmation box and click **Delete**.
5. Wait 5-10 minutes for the nodes to terminate.

---

## STEP 3: Delete EKS Cluster
1. Navigate back to EKS -> **Clusters**.
2. Select `my-eks-cluster` and click **Delete**.
3. Type `my-eks-cluster` in the confirmation box and click **Delete**.
4. Wait 10-15 minutes for the cluster control plane to tear down.

---

## STEP 4: Terminate EC2 Workstation
1. Navigate to the **EC2 Dashboard** -> **Instances**.
2. Select `three-tier-workstation`.
3. Click **Instance state** -> **Terminate instance**.
4. Click **Terminate** to confirm.

---

## STEP 5: Delete ACM Certificate
1. Navigate to **AWS Certificate Manager (ACM)** -> **List certificates**.
2. Select the certificate you created for your custom domain (e.g., `learning.dynv6.net`).
3. Click **Delete** and confirm.

---

## STEP 6: Delete ECR Repositories
1. Navigate to **Elastic Container Registry (ECR)** -> **Repositories**.
2. Select `backend-microservice` and click **Delete**. Type `delete` to confirm.
3. Select `frontend-microservice` and click **Delete**. Type `delete` to confirm.

---

## STEP 7: Delete CodePipeline & CodeBuild
1. Navigate to **CodePipeline** -> **Pipelines**.
2. Select `3tier-eks-pipeline` and click **Delete**. Type `delete` to confirm.
3. Navigate to **CodeBuild** -> **Build projects**.
4. Select `eks-build-project` and click **Delete**. Type `delete` to confirm.

---

## STEP 8: Delete Custom VPC
One of the best benefits of a custom VPC is that deleting it automatically deletes all subnets, route tables, internet gateways, and security groups associated with it!
1. Navigate to **VPC** -> **Your VPCs**.
2. Select `three-tier-vpc`.
3. Click **Actions** -> **Delete VPC**.
4. Review the list of associated resources (AWS will list all subnets, route tables, IGWs, and local SGs that will be deleted).
5. Click **Delete VPC** to confirm.

---

## STEP 9: Clean Up IAM Roles
1. Navigate to **IAM** -> **Roles**.
2. Search for and delete the following roles:
   - `eks-cluster-role`
   - `eks-node-role`
   - `EC2-ECR-Push-Role`
   - Any CodeBuild/CodePipeline roles generated during Phase 10 (e.g., `codebuild-eks-build-project-service-role`).

Your AWS account is now completely clean and safe from any cost overusage!

---
*Next Step: [The Interview Guide (End-to-End Flow)](12-interview-guide.md)*

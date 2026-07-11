# Phase 8: Automating CI/CD with AWS CodePipeline

Deploying infrastructure manually is a great learning experience, but in a true enterprise environment, deployments must be automated. We implemented a continuous integration and continuous deployment (CI/CD) pipeline using AWS CodePipeline.

Whenever a developer pushes code to the `main` branch of our GitHub repository, this pipeline automatically builds the Docker images, pushes them to Amazon ECR, and deploys the new images to our Amazon EKS cluster with zero downtime.

## 1. The `buildspec.yml` File
The heart of our automation is the `buildspec.yml` file located in the root of our repository. AWS CodeBuild uses this file to execute the pipeline. It performs the following steps:
- **Install Phase:** Downloads and configures the `kubectl` CLI tool.
- **Pre-Build Phase:** Authenticates with Amazon ECR using the AWS CLI and extracts the Git commit hash to use as a unique Docker image tag.
- **Build Phase:** Builds both the `frontend` and `backend` Docker images using their respective Dockerfiles.
- **Post-Build Phase:** 
  1. Pushes the images to ECR.
  2. Updates the `kubeconfig` to authenticate with our EKS cluster.
  3. Uses `sed` to dynamically replace the `latest` tag in our Kubernetes YAML files with the new commit hash.
  4. Runs `kubectl apply -f k8s/` to deploy the fresh code.

## 2. Setting Up AWS CodePipeline
To create the pipeline in the AWS Console, follow these exact steps:

### Step A: Connect to GitHub
1. Navigate to **CodePipeline** in the AWS Console and click **Create pipeline**.
2. **Name:** `3tier-eks-pipeline`
3. Select **New service role** (CodePipeline will auto-generate an IAM role for you).
4. **Source Provider:** Choose **GitHub (Version 2)**.
5. Click **Connect to GitHub**. This will open a popup asking you to authorize AWS Connector in your GitHub account. Select your `aws-eks-3tier-architecture` repository and click Install.
6. Select your repository name and the `main` branch. 
7. Make sure **Start the pipeline on source code change** is checked.

### Step B: Configure CodeBuild
1. **Build Provider:** Select **AWS CodeBuild**.
2. Click **Create project** (This opens a new popup window).
3. **Project Name:** `eks-build-project`
4. **Environment Image:** Managed Image -> Ubuntu -> Standard -> `aws/codebuild/standard:7.0`.
5. **Privileged:** 🚨 Check the box for **Enable this flag if you want to build Docker images**.
6. **Service Role:** Select **New service role** (Take note of the name, e.g., `codebuild-eks-build-project-service-role`).
7. **Buildspec:** Select "Use a buildspec file".
8. Click **Continue to CodePipeline** at the bottom of the popup.

### Step C: Skip Deploy Stage
1. When asked for a Deploy Provider, click **Skip deploy stage**.
*(Why? Because CodeBuild runs our `kubectl apply` commands in its post-build phase, acting as both our Builder and Deployer!)*
2. Review and click **Create pipeline**. 

The pipeline will immediately run and **fail**. Do not panic! It failed because the CodeBuild Service Role doesn't have permissions to access ECR or EKS yet.

## 3. Configuring Permissions (The Fix)
For CodeBuild to push images and run `kubectl`, we must give it IAM permissions and EKS permissions.

### A. AWS IAM Permissions
1. Go to the **IAM** dashboard in the AWS Console.
2. Click **Roles** and search for the role CodeBuild just created (e.g., `codebuild-eks-build-project-service-role`).
3. Click it, select **Add permissions** -> **Attach policies**.
4. Search for and attach: **`AmazonEC2ContainerRegistryFullAccess`**.

### B. EKS Cluster Authentication
By default, your EKS cluster will reject CodeBuild because it does not know who the CodeBuild IAM role is. We must create an **Access Entry** in EKS.
1. Copy the full **ARN** of your CodeBuild IAM Role (e.g., `arn:aws:iam::857184531197:role/service-role/codebuild-eks-build-project-service-role`).
2. Go to the **EKS Dashboard** -> **Clusters** -> `my-eks-cluster`.
3. Click the **Access** tab.
4. Under **IAM Access Entries**, click **Create access entry**.
5. **IAM principal ARN:** Paste your CodeBuild Role ARN.
6. Click Next. 
7. **Access policies:** Select `AmazonEKSClusterAdminPolicy` and `AmazonEKSAdminPolicy`.
8. Click Next and Create.

## 4. Trigger the Automation!
Now that the permissions are fixed, go back to your CodePipeline and click **Release change**!

The pipeline will successfully pull your code, build the Docker images, push them to ECR, authenticate with your EKS cluster, and deploy your new frontend and backend pods automatically!

Whenever you make a change in your local VS Code and run `git push`, this entire process will trigger with zero manual intervention.

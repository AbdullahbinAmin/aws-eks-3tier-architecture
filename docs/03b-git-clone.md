# Phase 3b: Cloning the Repository to the Server

Before we can build our Docker images, we need to get our application code onto the Ubuntu Workstation. We do this by cloning our GitHub repository directly to the server.

## 1. Generating a GitHub Personal Access Token (PAT)
If your repository is private, or if you plan to push changes from the server, you must use a Personal Access Token instead of a password.
1. Go to your GitHub **Settings** -> **Developer settings** -> **Personal access tokens** -> **Tokens (classic)**.
2. Click **Generate new token (classic)**.
3. Check the `repo` scope box.
4. Generate the token and copy it.

## 2. Cloning the Code
Connect to your Ubuntu server via MobaXterm and run the following command to download the code:

```bash
# Clone the repository (Replace YOUR_USERNAME if necessary)
git clone https://github.com/AbdullahbinAmin/aws-eks-3tier-architecture.git

# When prompted, enter your GitHub Username.
# For the password, paste the Personal Access Token (PAT) you generated above.

# Navigate into the project folder
cd aws-eks-3tier-architecture
```

## 3. Managing Code Updates
As you continue working on this project, you might edit code locally on your Windows machine (VS Code) and push it to GitHub. 

To bring those new updates to your Ubuntu server, you do not need to clone the repository again! Simply run a git pull:

```bash
# Make sure you are inside the project folder
cd ~/aws-eks-3tier-architecture

# Pull the latest changes from GitHub
git pull origin main
```
Now that all the files (`frontend/`, `backend/`, `k8s/`) are successfully on the Ubuntu server, we are ready to build the Docker images!

---
*Next Step: [Containerization & AWS ECR](04-docker-ecr.md)*

# Phase 3: Provisioning the Workstation (EC2)

Instead of installing AWS tools on a local Windows machine, we provisioned an Ubuntu Server on AWS to act as our centralized "Jumpbox" or DevOps Workstation. We accessed this workstation using **MobaXterm**.

## 1. Launching the EC2 Instance
1. **AMI:** Ubuntu Server 22.04 LTS
2. **Instance Type:** `t2.micro` (Free Tier eligible)
3. **Key Pair:** Created and downloaded a `.pem` file for SSH access via MobaXterm.
4. **IAM Role:** Attached the `EC2-ECR-Push-Role` created in Phase 2.

## 2. Installing Dependencies
Once connected via SSH in MobaXterm, we ran the following commands to install required tools:

### Install Docker
```bash
sudo apt update
sudo apt install -y docker.io
sudo usermod -aG docker ubuntu
# (Required a session restart for the group change to take effect)
```

### Install AWS CLI v2
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install unzip
unzip awscliv2.zip
sudo ./aws/install
```

### Install kubectl
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### Install eksctl
```bash
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
```

---
*Next Step: [Cloning the Repository to the Server](03b-git-clone.md)*

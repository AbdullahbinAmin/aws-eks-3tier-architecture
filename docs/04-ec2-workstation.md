# Phase 4: Provisioning the Workstation (EC2)

Instead of installing AWS tools on a local Windows machine, we provisioned an Ubuntu Server on AWS to act as our centralized "Jumpbox" or DevOps Workstation. We accessed this workstation using **MobaXterm**.

## 1. Launching the EC2 Instance
1. Open the AWS Console and go to **EC2** -> **Instances** -> **Launch instances**.
2. **Name tag:** `three-tier-workstation`
3. **Application and OS Images (AMI):** Ubuntu Server 22.04 LTS (HVM), SSD Volume Type
4. **Instance Type:** `t2.micro` (Free Tier eligible)
5. **Key Pair (login):** Create a new key pair:
   - **Key pair name:** `three-tier-key`
   - **Key pair type:** RSA
   - **Private key file format:** `.pem` (Download this key file; you will need it to login via MobaXterm).
6. **Network Settings:** Click **Edit** (top right of Network settings box):
   - **VPC:** Select your custom `three-tier-vpc`.
   - **Subnet:** Select `three-tier-pub-subnet-1` (Availability Zone: `eu-north-1a`).
   - **Auto-assign public IP:** Ensure this is set to **Enable**.
   - **Firewall (Security Groups):** Select **Create security group**.
     - **Security group name:** `three-tier-workstation-sg`
     - **Description:** `Security Group for 3-Tier Workstation EC2 instance`
     - **Inbound Security Group Rules:**
       - **Type:** `ssh` | **Port range:** `22` | **Source type:** `My IP` (or `Anywhere 0.0.0.0/0` if you plan to access it from multiple locations).
7. **Configure Storage:** Keep the default 8 GiB gp2/gp3 root volume.
8. **Advanced Details:**
   - **IAM instance profile:** Select `EC2-ECR-Push-Role` (which we created in Phase 3).
9. Click **Launch instance**.

## 2. Installing Dependencies
Once connected via SSH in MobaXterm, we ran the following commands to install required tools:

### Install Docker
```bash
sudo apt update
sudo apt install -y docker.io
sudo usermod -aG docker ubuntu
# (Required a session restart or logging out and logging back in for the group change to take effect)
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
*Next Step: [Cloning the Repository to the Server](05-git-clone.md)*

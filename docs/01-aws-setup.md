# Phase 1: AWS Account & Initial User Setup

Before deploying any infrastructure, the foundation of AWS security requires setting up an administrative IAM user instead of using the Root account.

## 1. Create the AWS Account
- Sign up for an AWS Account (or use an AWS Academy/Free Tier account).
- Secure the Root User with MFA (Multi-Factor Authentication).

## 2. Create the `devops-engineer` User
We created a dedicated IAM User to handle all deployment tasks.

1. Navigate to **IAM** -> **Users** -> **Add users**.
2. **User details:**
   - User name: `devops-engineer`
   - Provide user access to the AWS Management Console.
   - Choose a custom password.
3. **Permissions:**
   - *Note: In a strict production environment, we adhere to the principle of least privilege. However, for the scope of this project and to prevent blockers during the EKS & ACM setup phases, we granted full administrative access.*
   - Attach policies directly: `AdministratorAccess`
4. **Access Keys:**
   - Generate an **Access Key ID** and **Secret Access Key** for CLI access later.

---
*Next Step: [Configuring IAM Roles & Policies](02-iam-roles.md)*

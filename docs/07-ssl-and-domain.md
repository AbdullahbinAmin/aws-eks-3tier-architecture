# Phase 7: SSL Offloading & Custom Domain

To make the application production-ready, we mapped a free custom domain (`learning.dynv6.net`) to our Load Balancer and secured it with HTTPS.

## 1. Requesting the SSL Certificate
We utilized **AWS Certificate Manager (ACM)** to generate a free public certificate.
1. Opened ACM in the AWS Console.
2. Fixed an IAM restriction by ensuring the `devops-engineer` user had `AWSCertificateManagerFullAccess` attached.
3. Requested a certificate for `learning.dynv6.net` using **DNS Validation**.
4. Extracted the resulting `CNAME Name` and `CNAME Value` to prove ownership.

## 2. Configuring dynv6.com DNS
We accessed our dashboard at `dynv6.com` to configure the routing.
1. **Validation Record:** Added a `CNAME` record matching the values provided by ACM to instantly validate our domain ownership.
2. **Routing Record:** Because `dynv6.com` does not permit `CNAME` or `ALIAS` records at the root zone apex, we pinged our AWS Load Balancer to extract its underlying IPv4 address (`13.48.161.136`). We inputted this IP directly into the dynv6 `Status` tab.

## 3. Enabling HTTPS on Kubernetes
With the certificate successfully `Issued`, we modified our `frontend.yaml` Service to instruct the AWS Load Balancer to terminate SSL traffic.

We added three specific AWS annotations to the `LoadBalancer` metadata:
```yaml
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:eu-north-1:857184531197:certificate/c6976e26-4eaa-4374-98ef-2a0aadc9aad1"
    service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443"
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: "http"
```

Finally, we added port `443` to the service specification, routing traffic securely to the internal Nginx `80` port.
```bash
kubectl apply -f frontend.yaml
```

**Result:** The application is now fully accessible at `https://learning.dynv6.net` with a Secure Padlock!

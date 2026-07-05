# Phase 6: Kubernetes Deployment

With our worker node running, we deployed the three tiers of our application using YAML manifests.

## 1. Data Tier: MySQL StatefulSet
Databases require stable network identities and persistent storage. We used a Kubernetes `StatefulSet`.

**Storage Challenge:**
AWS EBS (Elastic Block Store) Volumes require a specific EBS CSI Driver addon to be installed on the cluster, which often fails on basic Free Tier clusters without proper IAM OIDC provider setups.

**The Solution:**
We modified the `mysql.yaml` to completely bypass AWS EBS network drives. Instead, we used a `hostPath` volume. This instructed Kubernetes to utilize the ultra-fast local SSD hard drive physically attached to our `t3.small` EC2 worker node.

```bash
kubectl apply -f mysql.yaml
```

Once the pod was `Running`, we populated it with our backend SQL schema:
```bash
kubectl exec -i mysql-0 -- mysql -uroot -prootpassword < backend/init.sql
```

## 2. Logic Tier: Node.js Backend
We deployed the backend API using a `Deployment` and exposed it internally to the cluster using a `ClusterIP` Service on port `5000`.

The backend dynamically connected to the database using Kubernetes environment variables defined in `backend.yaml`:
- `DB_HOST`: "mysql"
- `DB_USER`: "root"
- `DB_PASSWORD`: "rootpassword"

```bash
kubectl apply -f backend.yaml
```

## 3. Presentation Tier: React/Nginx Frontend
We deployed the frontend using a `Deployment`. Because we needed this application to be accessible from the public internet, we exposed it using a `LoadBalancer` Service.

```bash
kubectl apply -f frontend.yaml
```

Kubernetes automatically communicated with AWS to provision a **Classic Load Balancer (ELB)**. We retrieved the public URL by running:
```bash
kubectl get svc frontend
```
*(Output: `ab4f44f9b...eu-north-1.elb.amazonaws.com`)*

---
*Next Step: [SSL Offloading & Custom Domain](07-ssl-and-domain.md)*

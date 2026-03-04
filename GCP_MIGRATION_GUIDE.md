# GCP Migration & Deployment Guide

## Overview
This guide covers migrating your Klatchup backend from Firebase-only to full Google Cloud Platform (GCP) services, giving you more flexibility and scalability.

---

## Why GCP?

### Benefits of GCP Migration
- **More Control**: Direct access to compute resources
- **Better Scaling**: Auto-scaling with Cloud Run or App Engine
- **Cost Optimization**: More granular billing and resource management
- **Additional Services**: Access to BigQuery, Cloud SQL, Cloud Tasks
- **Hybrid Approach**: Use Firebase for mobile features + GCP for heavy backend work

---

## Architecture Options

### Option 1: Firebase Functions (Current)
**Best for**: Small to medium apps with moderate traffic

```
Mobile App → Firebase Functions → Firestore/Realtime DB
```

**Pros:**
- Easy to deploy
- Integrated with Firebase
- Good for real-time features

**Cons:**
- Limited execution time (9 min max)
- Cold starts can be slow
- Less control over infrastructure

### Option 2: Cloud Run + Firebase (Recommended)
**Best for**: Apps with high traffic or longer processing needs

```
Mobile App → Cloud Run → Firestore/Realtime DB/Firebase Auth
```

**Pros:**
- Faster cold starts
- More control
- Better for scaling
- Can use Docker containers
- Up to 60 min execution time

**Cons:**
- Slightly more complex setup
- Need to manage container images

### Option 3: App Engine + Firebase
**Best for**: Traditional web apps with mobile component

```
Mobile App → App Engine → Firestore/Realtime DB/Firebase Auth
```

**Pros:**
- Zero-config scaling
- Integrated with GCP
- Good for traditional web apps

**Cons:**
- More expensive at small scale
- Less flexible than Cloud Run

---

## Migration Path: Firebase Functions → Cloud Run

### Step 1: Prepare Your Backend

The current Firebase Functions backend can be migrated to Cloud Run with minimal changes.

#### 1.1: Create Dockerfile

Create `firebase-backend/Dockerfile`:

```dockerfile
# Use Node.js 18 base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Expose port 8080 (Cloud Run default)
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "lib/index.js"]
```

#### 1.2: Update Backend for Cloud Run

Modify `firebase-backend/src/index.ts`:

```typescript
import * as admin from 'firebase-admin';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    type: err.type || 'ERROR',
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
import authRoutes from './api/auth';
import profileRoutes from './api/profiles';
import checkInRoutes from './api/checkIn';
import locationRoutes from './api/location';

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/checkin', checkInRoutes);
app.use('/location', locationRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found', type: 'NOT_FOUND' });
});

// Start server (for Cloud Run)
const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Also export for Firebase Functions (backward compatibility)
import * as functions from 'firebase-functions';
export const api = functions
  .region('us-central1')
  .https.onRequest(app);

export default app;
```

#### 1.3: Create .dockerignore

Create `firebase-backend/.dockerignore`:

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.*
*.md
.DS_Store
lib/
serviceAccountKey.json
```

### Step 2: Deploy to Cloud Run

#### 2.1: Build and Push Container

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
export REGION="us-central1"

# Build container
cd firebase-backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/klatchup-api

# Or build locally and push
docker build -t gcr.io/$PROJECT_ID/klatchup-api .
docker push gcr.io/$PROJECT_ID/klatchup-api
```

#### 2.2: Deploy to Cloud Run

```bash
gcloud run deploy klatchup-api \
  --image gcr.io/$PROJECT_ID/klatchup-api \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "FIREBASE_PROJECT_ID=$PROJECT_ID" \
  --set-env-vars "NODE_ENV=production" \
  --memory 512Mi \
  --timeout 60s \
  --min-instances 0 \
  --max-instances 10
```

#### 2.3: Get Service URL

```bash
gcloud run services describe klatchup-api \
  --platform managed \
  --region $REGION \
  --format 'value(status.url)'
```

### Step 3: Update Mobile App Configuration

Update `src/services/apiConfig.ts`:

```typescript
export const API_CONFIG = {
  firebase: {
    baseURL: 'https://klatchup-api-xxxxx-uc.a.run.app', // Your Cloud Run URL
    name: 'Cloud Run',
    status: 'ACTIVE - Scalable backend',
  },
  aws: {
    baseURL: 'https://xxxxxxx.execute-api.us-east-1.amazonaws.com/dev',
    name: 'AWS Lambda',
    status: 'BACKUP - Available if needed',
  },
};
```

---

## Advanced GCP Features

### 1. Cloud Tasks (Background Jobs)

For long-running or scheduled tasks:

```bash
# Enable Cloud Tasks
gcloud services enable cloudtasks.googleapis.com

# Create a queue
gcloud tasks queues create default-queue \
  --location=$REGION
```

Add to your backend:

```typescript
import { CloudTasksClient } from '@google-cloud/tasks';

const tasksClient = new CloudTasksClient();

async function enqueueTask(data: any) {
  const project = process.env.FIREBASE_PROJECT_ID;
  const queue = 'default-queue';
  const location = 'us-central1';
  const parent = tasksClient.queuePath(project, location, queue);

  const task = {
    httpRequest: {
      httpMethod: 'POST',
      url: 'https://your-cloud-run-url/tasks/process',
      body: Buffer.from(JSON.stringify(data)).toString('base64'),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  const [response] = await tasksClient.createTask({ parent, task });
  return response;
}
```

### 2. Cloud Storage (Enhanced File Storage)

```bash
# Create a bucket
gsutil mb gs://$PROJECT_ID-uploads
```

In your code:

```typescript
import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucket = storage.bucket(`${process.env.FIREBASE_PROJECT_ID}-uploads`);

// Upload file
async function uploadFile(file: Buffer, filename: string) {
  const blob = bucket.file(filename);
  await blob.save(file, {
    metadata: { contentType: 'image/jpeg' },
  });
  
  // Make public (optional)
  await blob.makePublic();
  
  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
}
```

### 3. Cloud Scheduler (Cron Jobs)

```bash
# Enable Cloud Scheduler
gcloud services enable cloudscheduler.googleapis.com

# Create a scheduled job
gcloud scheduler jobs create http cleanup-job \
  --schedule="0 2 * * *" \
  --time-zone="America/New_York" \
  --uri="https://your-cloud-run-url/tasks/cleanup" \
  --http-method=POST
```

### 4. Cloud Monitoring & Logging

```bash
# Enable monitoring
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
```

Add structured logging:

```typescript
import { Logging } from '@google-cloud/logging';

const logging = new Logging();
const log = logging.log('klatchup-api');

function logInfo(message: string, data?: any) {
  const entry = log.entry(
    { resource: { type: 'global' } },
    { message, ...data, severity: 'INFO' }
  );
  log.write(entry);
}
```

### 5. Cloud SQL (Relational Database)

For more complex queries or relational data:

```bash
# Create Cloud SQL instance
gcloud sql instances create klatchup-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=$REGION
```

---

## Deployment Automation

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches:
      - main
    paths:
      - 'firebase-backend/**'

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  REGION: us-central1
  SERVICE_NAME: klatchup-api

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}
      
      - name: Configure Docker
        run: gcloud auth configure-docker
      
      - name: Build image
        run: |
          cd firebase-backend
          docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME .
      
      - name: Push image
        run: docker push gcr.io/$PROJECT_ID/$SERVICE_NAME
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy $SERVICE_NAME \
            --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
            --platform managed \
            --region $REGION \
            --allow-unauthenticated
```

---

## Cost Optimization

### Cloud Run Cost Tips

1. **Set min instances to 0** for development
2. **Use concurrency** to handle multiple requests per instance
3. **Optimize container size** to reduce cold start time
4. **Set appropriate memory** (256Mi - 512Mi for most cases)
5. **Use CPU throttling** when not handling requests

### Monitoring Costs

```bash
# Check current billing
gcloud billing accounts list

# View Cloud Run metrics
gcloud run services describe klatchup-api \
  --platform managed \
  --region $REGION \
  --format="value(status.traffic)"
```

---

## Security Best Practices

### 1. Service Account Permissions

Create a dedicated service account:

```bash
gcloud iam service-accounts create klatchup-api \
  --display-name="Klatchup API Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:klatchup-api@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/datastore.user"
```

### 2. Secret Management

Use Secret Manager instead of environment variables:

```bash
# Enable Secret Manager
gcloud services enable secretmanager.googleapis.com

# Create secret
echo -n "your-api-key" | gcloud secrets create google-places-key --data-file=-

# Grant access
gcloud secrets add-iam-policy-binding google-places-key \
  --member="serviceAccount:klatchup-api@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Hybrid Approach (Recommended)

Use both Firebase Functions and Cloud Run:

- **Firebase Functions**: Real-time triggers, simple APIs
- **Cloud Run**: Heavy processing, long-running tasks

```
Mobile App
    ↓
    ├─→ Firebase Functions (auth, real-time)
    └─→ Cloud Run (API, processing)
            ↓
    Firebase Services (Firestore, Storage, Auth)
```

---

## Troubleshooting

### Issue: Container fails to start
**Check logs:**
```bash
gcloud run services logs read klatchup-api --limit=50
```

### Issue: Cold starts too slow
**Solutions:**
1. Reduce container size
2. Set min-instances > 0 (costs more)
3. Use smaller base images
4. Optimize dependencies

### Issue: Permission denied
**Check service account:**
```bash
gcloud run services describe klatchup-api \
  --format="value(spec.template.spec.serviceAccountName)"
```

---

## Next Steps

1. ✅ Deploy to Cloud Run
2. ⬜ Set up Cloud Monitoring
3. ⬜ Configure Cloud Scheduler for cron jobs
4. ⬜ Implement Cloud Tasks for background processing
5. ⬜ Set up CI/CD pipeline
6. ⬜ Configure load testing
7. ⬜ Set up staging environment

---

**Reference:**
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [GCP Best Practices](https://cloud.google.com/architecture/framework)

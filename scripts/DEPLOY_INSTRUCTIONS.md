/**
 * Deploy configuration helper for Google Cloud Run
 * Save this file as scripts/deploy-info.txt or similar.
 * These are the commands you should run in your terminal.
 */

/*
1. AUTHENTICATE (if not already):
   gcloud auth login

2. SET PROJECT:
   gcloud config set project [YOUR_PROJECT_ID]

3. ENABLE SERVICES:
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com firestore.googleapis.com storage.googleapis.com

4. DEPLOY:
   gcloud run deploy compromiso-diario `
     --source . `
     --platform managed `
     --region southamerica-east1 `
     --allow-unauthenticated `
     --set-env-vars="NODE_ENV=production,GOOGLE_CLOUD_STORAGE_BUCKET=[YOUR_BUCKET_NAME]"

Note: Replace [YOUR_PROJECT_ID] and [YOUR_BUCKET_NAME] with your actual data.
*/

# ============================================================
# FinancePilot — Full GCP Project Setup Script
# Project: auditflow-492115
# Region: asia-southeast1
# ============================================================

$PROJECT_ID = "auditflow-492115"
$REGION = "asia-southeast1"
$REPO_NAME = "financepilot"
$SA_NAME = "financepilot-agent"
$SA_EMAIL = "$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " FinancePilot GCP Setup" -ForegroundColor Cyan
Write-Host " Project: $PROJECT_ID" -ForegroundColor Cyan
Write-Host " Region:  $REGION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# ── Step 1: Set active project ────────────────────────────────
Write-Host "[1/9] Setting active GCP project..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# ── Step 2: Enable required APIs ──────────────────────────────
Write-Host "`n[2/9] Enabling GCP APIs..." -ForegroundColor Yellow
$apis = @(
    "run.googleapis.com",
    "pubsub.googleapis.com",
    "redis.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "secretmanager.googleapis.com",
    "iam.googleapis.com",
    "compute.googleapis.com",
    "vpcaccess.googleapis.com"
)
foreach ($api in $apis) {
    Write-Host "  Enabling $api..." -ForegroundColor Gray
    gcloud services enable $api --quiet
}

# ── Step 3: Create Artifact Registry ─────────────────────────
Write-Host "`n[3/9] Creating Artifact Registry repository..." -ForegroundColor Yellow
gcloud artifacts repositories create $REPO_NAME `
    --repository-format=docker `
    --location=$REGION `
    --description="FinancePilot container images" `
    --quiet 2>$null
if ($LASTEXITCODE -eq 0) { Write-Host "  Created: $REPO_NAME" -ForegroundColor Green }
else { Write-Host "  Repository already exists (OK)" -ForegroundColor Gray }

# ── Step 4: Create Pub/Sub Topics + Subscriptions ─────────────
Write-Host "`n[4/9] Creating Pub/Sub topics and subscriptions..." -ForegroundColor Yellow

# Dead Letter Queue first
Write-Host "  Creating DLQ topic..." -ForegroundColor Gray
gcloud pubsub topics create financepilot-dlq --quiet 2>$null
gcloud pubsub subscriptions create financepilot-dlq-sub `
    --topic=financepilot-dlq `
    --message-retention-duration=7d `
    --quiet 2>$null

$topics = @(
    "finance-invoice",
    "finance-reconcile",
    "finance-tax",
    "finance-forecast",
    "finance-report",
    "finance-alert",
    "finance-results"
)

foreach ($topic in $topics) {
    Write-Host "  Creating topic: $topic" -ForegroundColor Gray
    gcloud pubsub topics create $topic `
        --message-retention-duration=24h `
        --quiet 2>$null

    Write-Host "  Creating subscription: $topic-sub" -ForegroundColor Gray
    gcloud pubsub subscriptions create "$topic-sub" `
        --topic=$topic `
        --ack-deadline=600 `
        --message-retention-duration=24h `
        --dead-letter-topic=financepilot-dlq `
        --max-delivery-attempts=5 `
        --min-retry-delay=10s `
        --max-retry-delay=600s `
        --quiet 2>$null
}

# ── Step 5: Create Service Account + IAM ──────────────────────
Write-Host "`n[5/9] Creating service account and IAM bindings..." -ForegroundColor Yellow
gcloud iam service-accounts create $SA_NAME `
    --display-name="FinancePilot Agent Service Account" `
    --quiet 2>$null

$roles = @(
    "roles/pubsub.editor",
    "roles/secretmanager.secretAccessor",
    "roles/redis.editor",
    "roles/run.invoker",
    "roles/cloudbuild.builds.editor",
    "roles/artifactregistry.reader",
    "roles/logging.logWriter"
)

foreach ($role in $roles) {
    Write-Host "  Binding: $role" -ForegroundColor Gray
    gcloud projects add-iam-policy-binding $PROJECT_ID `
        --member="serviceAccount:$SA_EMAIL" `
        --role=$role `
        --quiet 2>$null | Out-Null
}

# Grant Cloud Build SA permission to deploy to Cloud Run
$PROJECT_NUMBER = (gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
$CB_SA = "${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

Write-Host "  Granting Cloud Build SA Cloud Run admin..." -ForegroundColor Gray
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$CB_SA" `
    --role="roles/run.admin" `
    --quiet 2>$null | Out-Null

gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$CB_SA" `
    --role="roles/iam.serviceAccountUser" `
    --quiet 2>$null | Out-Null

gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$CB_SA" `
    --role="roles/artifactregistry.writer" `
    --quiet 2>$null | Out-Null

# ── Step 6: Create Secret Manager secrets (placeholders) ──────
Write-Host "`n[6/9] Creating Secret Manager secrets..." -ForegroundColor Yellow
$secrets = @("supabase-url", "supabase-service-key", "gemini-api-key")

foreach ($secret in $secrets) {
    Write-Host "  Creating secret: $secret" -ForegroundColor Gray
    gcloud secrets create $secret --replication-policy="automatic" --quiet 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "    Secret already exists (OK)" -ForegroundColor Gray
    }
}

# ── Step 7: Configure Docker for Artifact Registry ────────────
Write-Host "`n[7/9] Configuring Docker authentication..." -ForegroundColor Yellow
gcloud auth configure-docker "$REGION-docker.pkg.dev" --quiet

# ── Step 8: Create VPC Connector (for Redis Memorystore) ──────
Write-Host "`n[8/9] Creating VPC connector for Memorystore access..." -ForegroundColor Yellow
gcloud compute networks vpc-access connectors create financepilot-vpc `
    --region=$REGION `
    --range="10.8.0.0/28" `
    --quiet 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  VPC connector already exists or skipped (OK)" -ForegroundColor Gray
}

# ── Step 9: Summary ──────────────────────────────────────────
Write-Host "`n========================================" -ForegroundColor Green
Write-Host " GCP Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Project:           $PROJECT_ID" -ForegroundColor White
Write-Host "Region:            $REGION" -ForegroundColor White
Write-Host "Artifact Registry: $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME" -ForegroundColor White
Write-Host "Service Account:   $SA_EMAIL" -ForegroundColor White
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Add secret values:" -ForegroundColor White
Write-Host "     echo 'YOUR_URL' | gcloud secrets versions add supabase-url --data-file=-" -ForegroundColor Gray
Write-Host "     echo 'YOUR_KEY' | gcloud secrets versions add supabase-service-key --data-file=-" -ForegroundColor Gray  
Write-Host "     echo 'YOUR_KEY' | gcloud secrets versions add gemini-api-key --data-file=-" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Build & deploy:" -ForegroundColor White
Write-Host "     gcloud builds submit --config=cloudbuild.yaml" -ForegroundColor Gray
Write-Host ""

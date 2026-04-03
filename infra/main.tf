# ============================================================
# FinancePilot - Terraform Infrastructure
# Google Cloud: Cloud Run, Pub/Sub, Redis, Artifact Registry
# ============================================================

terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "asia-southeast1"
}

variable "supabase_url" {
  description = "Supabase project URL"
  type        = string
  sensitive   = true
}

variable "supabase_service_key" {
  description = "Supabase service role key"
  type        = string
  sensitive   = true
}

variable "gemini_api_key" {
  description = "Google Gemini API Key"
  type        = string
  sensitive   = true
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ============================================================
# APIs
# ============================================================
resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "pubsub.googleapis.com",
    "redis.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "secretmanager.googleapis.com",
  ])
  service            = each.value
  disable_on_destroy = false
}

# ============================================================
# ARTIFACT REGISTRY
# ============================================================
resource "google_artifact_registry_repository" "financepilot" {
  location      = var.region
  repository_id = "financepilot"
  format        = "DOCKER"
  description   = "FinancePilot container images"
  depends_on    = [google_project_service.apis]
}

# ============================================================
# REDIS (Memorystore)
# ============================================================
resource "google_redis_instance" "cache" {
  name               = "financepilot-cache"
  tier               = "BASIC"
  memory_size_gb     = 1
  region             = var.region
  redis_version      = "REDIS_7_0"
  display_name       = "FinancePilot Session Cache"
  depends_on         = [google_project_service.apis]
}

# ============================================================
# PUB/SUB TOPICS
# ============================================================
locals {
  pubsub_topics = [
    "finance.invoice",
    "finance.reconcile",
    "finance.tax",
    "finance.forecast",
    "finance.report",
    "finance.alert",
    "finance.results",
  ]
}

resource "google_pubsub_topic" "agent_topics" {
  for_each = toset(local.pubsub_topics)
  name     = replace(each.value, ".", "-")
  depends_on = [google_project_service.apis]

  message_retention_duration = "86400s" # 24h
}

resource "google_pubsub_subscription" "agent_subs" {
  for_each = toset(local.pubsub_topics)
  name     = "${replace(each.value, ".", "-")}-sub"
  topic    = google_pubsub_topic.agent_topics[each.key].id

  ack_deadline_seconds       = 600  # 10min for long agent tasks
  message_retention_duration = "86400s"
  retain_acked_messages      = false

  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }

  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.dlq.id
    max_delivery_attempts = 5
  }
}

resource "google_pubsub_topic" "dlq" {
  name       = "financepilot-dlq"
  depends_on = [google_project_service.apis]
}

resource "google_pubsub_subscription" "dlq_sub" {
  name     = "financepilot-dlq-sub"
  topic    = google_pubsub_topic.dlq.id
  message_retention_duration = "604800s" # 7 days
}

# ============================================================
# SECRET MANAGER
# ============================================================
resource "google_secret_manager_secret" "supabase_url" {
  secret_id = "supabase-url"
  replication { auto {} }
  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "supabase_url" {
  secret      = google_secret_manager_secret.supabase_url.id
  secret_data = var.supabase_url
}

resource "google_secret_manager_secret" "supabase_key" {
  secret_id = "supabase-service-key"
  replication { auto {} }
  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "supabase_key" {
  secret      = google_secret_manager_secret.supabase_key.id
  secret_data = var.supabase_service_key
}

resource "google_secret_manager_secret" "gemini_key" {
  secret_id = "gemini-api-key"
  replication { auto {} }
  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "gemini_key" {
  secret      = google_secret_manager_secret.gemini_key.id
  secret_data = var.gemini_api_key
}

# ============================================================
# SERVICE ACCOUNT for Cloud Run
# ============================================================
resource "google_service_account" "financepilot" {
  account_id   = "financepilot-agent"
  display_name = "FinancePilot Agent Service Account"
}

resource "google_project_iam_member" "pubsub" {
  project = var.project_id
  role    = "roles/pubsub.editor"
  member  = "serviceAccount:${google_service_account.financepilot.email}"
}

resource "google_project_iam_member" "secrets" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.financepilot.email}"
}

resource "google_project_iam_member" "redis" {
  project = var.project_id
  role    = "roles/redis.editor"
  member  = "serviceAccount:${google_service_account.financepilot.email}"
}

# ============================================================
# CLOUD RUN SERVICES
# ============================================================
locals {
  services = {
    orchestrator   = { port = 8080, min = 1, max = 10 }
    invoice-parser = { port = 8080, min = 0, max = 5 }
    reconciliation = { port = 8080, min = 0, max = 5 }
    tax-compliance = { port = 8080, min = 0, max = 3 }
    forecast       = { port = 8080, min = 0, max = 3 }
    report         = { port = 8080, min = 0, max = 3 }
    alert          = { port = 8080, min = 0, max = 5 }
  }
}

resource "google_cloud_run_v2_service" "services" {
  for_each = local.services
  name     = "financepilot-${each.key}"
  location = var.region

  template {
    service_account = google_service_account.financepilot.email

    scaling {
      min_instance_count = each.value.min
      max_instance_count = each.value.max
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/financepilot/${each.key}:latest"

      ports {
        container_port = each.value.port
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }
      env {
        name = "SUPABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.supabase_url.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "SUPABASE_SERVICE_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.supabase_key.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "GEMINI_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.gemini_key.secret_id
            version = "latest"
          }
        }
      }
      env {
        name  = "REDIS_HOST"
        value = google_redis_instance.cache.host
      }
    }
  }

  depends_on = [google_project_service.apis]
}

# Make orchestrator publicly accessible
resource "google_cloud_run_v2_service_iam_member" "orchestrator_public" {
  name     = google_cloud_run_v2_service.services["orchestrator"].name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# ============================================================
# OUTPUTS
# ============================================================
output "orchestrator_url" {
  value = google_cloud_run_v2_service.services["orchestrator"].uri
}

output "redis_host" {
  value = google_redis_instance.cache.host
}

output "pubsub_topics" {
  value = [for t in google_pubsub_topic.agent_topics : t.name]
}

# orchestrator/pubsub_client.py — Pub/Sub publish/subscribe helpers
import os
import json
from google.cloud import pubsub_v1
from typing import Callable, Optional

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from shared.logging_utils import get_logger

logger = get_logger("orchestrator.pubsub")

PROJECT_ID = os.environ.get("GCP_PROJECT_ID", "")

# All FinancePilot Pub/Sub topics
TOPICS = {
    "invoice": "finance.invoice",
    "reconcile": "finance.reconcile",
    "tax": "finance.tax",
    "forecast": "finance.forecast",
    "report": "finance.report",
    "alert": "finance.alert",
    "results": "finance.results",
    "dead_letter": "finance.dead-letter",
}


def get_publisher() -> pubsub_v1.PublisherClient:
    return pubsub_v1.PublisherClient()


def publish(topic_key: str, data: dict, publisher: Optional[pubsub_v1.PublisherClient] = None):
    """Publish a message to a named topic."""
    publisher = publisher or get_publisher()
    topic_name = TOPICS.get(topic_key, topic_key)
    topic_path = publisher.topic_path(PROJECT_ID, topic_name)
    payload = json.dumps(data, default=str).encode("utf-8")
    future = publisher.publish(topic_path, payload)
    msg_id = future.result()
    logger.info(f"Published to {topic_name}: {msg_id}")
    return msg_id


def subscribe_sync(topic_key: str, callback: Callable):
    """Create a synchronous pull subscriber."""
    subscriber = pubsub_v1.SubscriberClient()
    topic_name = TOPICS.get(topic_key, topic_key)
    sub_path = subscriber.subscription_path(PROJECT_ID, f"{topic_name}-sub")

    def wrapped_callback(message):
        message.ack()
        data = json.loads(message.data.decode("utf-8"))
        callback(data)

    streaming = subscriber.subscribe(sub_path, callback=wrapped_callback)
    logger.info(f"Subscribed to {sub_path}")
    return streaming


def create_topics_if_needed():
    """Create all FinancePilot Pub/Sub topics (idempotent)."""
    publisher = get_publisher()
    for key, topic_name in TOPICS.items():
        topic_path = publisher.topic_path(PROJECT_ID, topic_name)
        try:
            publisher.create_topic(request={"name": topic_path})
            logger.info(f"Created topic: {topic_path}")
        except Exception:
            logger.info(f"Topic exists: {topic_path}")

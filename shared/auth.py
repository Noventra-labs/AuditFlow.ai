# shared/auth.py — Firebase JWT verification for API Gateway
import os
from typing import Optional, Dict, Any
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer(auto_error=False)

# Lazy-loaded Firebase Admin
_firebase_app = None


def _init_firebase():
    global _firebase_app
    if _firebase_app is None:
        import firebase_admin
        from firebase_admin import credentials

        cred_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT")
        if cred_path and os.path.isfile(cred_path):
            cred = credentials.Certificate(cred_path)
        else:
            cred = credentials.ApplicationDefault()
        _firebase_app = firebase_admin.initialize_app(cred)
    return _firebase_app


async def verify_firebase_token(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security),
) -> Dict[str, Any]:
    """
    Verify Firebase JWT from Authorization header.
    Returns decoded token payload with uid and company_id.
    """
    if credentials is None:
        raise HTTPException(status_code=401, detail="Missing authorization token")

    try:
        _init_firebase()
        from firebase_admin import auth

        decoded = auth.verify_id_token(credentials.credentials)
        return {
            "uid": decoded["uid"],
            "email": decoded.get("email"),
            "company_id": decoded.get("company_id", decoded.get("uid")),
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


async def verify_token_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security),
) -> Optional[Dict[str, Any]]:
    """Optional auth — returns None if no token provided."""
    if credentials is None:
        return None
    return await verify_firebase_token(credentials)

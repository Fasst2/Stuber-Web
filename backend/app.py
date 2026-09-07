from __future__ import annotations

import os
import re
import time
from collections import defaultdict, deque

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

from email_service import send_project_email


load_dotenv()


app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 64 * 1024  # 64 KB


# ============================================================
# CONFIGURACIÓN
# ============================================================

DEFAULT_ORIGINS = (
    "http://127.0.0.1:5500,"
    "http://localhost:5500"
)

ALLOWED_ORIGINS = {
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        DEFAULT_ORIGINS
    ).split(",")
    if origin.strip()
}

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": list(ALLOWED_ORIGINS)
        }
    }
)


# ============================================================
# RATE LIMIT SIMPLE
# ============================================================

RATE_WINDOW_SECONDS = 60
RATE_LIMIT = 8
_requests: dict[str, deque[float]] = defaultdict(deque)


def is_rate_limited(ip: str) -> bool:
    now = time.monotonic()
    bucket = _requests[ip]

    while bucket and now - bucket[0] > RATE_WINDOW_SECONDS:
        bucket.popleft()

    if len(bucket) >= RATE_LIMIT:
        return True

    bucket.append(now)
    return False


# ============================================================
# VALIDACIÓN
# ============================================================

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

FIELD_LIMITS = {
    "fullName": 120,
    "email": 254,
    "whatsapp": 40,
    "company": 160,
    "projectName": 160,
    "projectDescription": 5000,
    "existingWebsite": 500,
    "references": 3000,
    "otherFeatures": 2000,
    "additionalDetails": 5000,
    "websiteType": 80,
    "budget": 80,
    "deadline": 80,
    "hostingStatus": 100,
    "source": 80,
    "contentStatus": 100,
}


def clean_string(value, field: str = "") -> str:
    value = "" if value is None else str(value).strip()

    limit = FIELD_LIMITS.get(field)

    if limit and len(value) > limit:
        raise ValueError(
            f"El campo '{field}' supera el límite permitido."
        )

    return value


def validate_payload(data: dict) -> dict:
    cleaned = {}

    for field in FIELD_LIMITS:
        cleaned[field] = clean_string(
            data.get(field, ""),
            field
        )

    required = [
        "fullName",
        "email",
        "projectName",
        "projectDescription",
        "websiteType",
        "budget",
        "deadline",
        "hostingStatus",
        "contentStatus",
        "references",
        "otherFeatures",
        "additionalDetails",
        "source",
    ]

    missing = [
        field
        for field in required
        if not cleaned[field]
    ]

    if missing:
        raise ValueError(
            "Faltan campos obligatorios."
        )

    if not EMAIL_RE.fullmatch(cleaned["email"]):
        raise ValueError(
            "El correo electrónico no es válido."
        )

    if data.get("consent") not in (True, "true", "Sí", "on", 1):
        raise ValueError(
            "Es necesario aceptar el consentimiento."
        )

    if cleaned["existingWebsite"]:
        if not cleaned["existingWebsite"].startswith(
            ("http://", "https://")
        ):
            raise ValueError(
                "La URL existente no es válida."
            )

    for field in ("style", "features"):
        value = data.get(field, [])

        if not isinstance(value, list):
            raise ValueError(
                f"El campo '{field}' debe ser una lista."
            )

        cleaned[field] = [
            clean_string(item)[:120]
            for item in value[:20]
        ]

    return cleaned


# ============================================================
# HEADERS DE SEGURIDAD
# ============================================================

@app.after_request
def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = (
        "camera=(), microphone=(), geolocation=()"
    )
    return response


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def home():
    return jsonify({
        "success": True,
        "service": "STUBER.WEB API",
        "status": "online"
    })


@app.get("/api/health")
def health():
    return jsonify({
        "success": True,
        "status": "online",
        "message": "STUBER.WEB API funcionando correctamente."
    })


# ============================================================
# CONTACTO / PROYECTOS
# ============================================================

@app.post("/api/contact")
def contact():
    client_ip = request.headers.get(
        "X-Forwarded-For",
        request.remote_addr or "unknown"
    ).split(",")[0].strip()

    if is_rate_limited(client_ip):
        return jsonify({
            "success": False,
            "message": "Demasiadas solicitudes. Intentá nuevamente en unos minutos."
        }), 429

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "El cuerpo de la solicitud no es válido."
        }), 400

    # Honeypot: los bots suelen completar este campo oculto.
    if data.get("botcheck"):
        return jsonify({
            "success": False,
            "message": "Solicitud rechazada."
        }), 400

    try:
        cleaned = validate_payload(data)
        send_project_email({
            **cleaned,
            "consent": True,
        })

        return jsonify({
            "success": True,
            "message": "Proyecto recibido correctamente."
        }), 200

    except ValueError as error:
        return jsonify({
            "success": False,
            "message": str(error)
        }), 400

    except Exception as error:
        app.logger.exception(
            "Error procesando /api/contact: %s",
            error
        )

        return jsonify({
            "success": False,
            "message": "No se pudo procesar el proyecto. Intentá nuevamente."
        }), 500


# ============================================================
# ERRORES
# ============================================================

@app.errorhandler(404)
def not_found(_error):
    return jsonify({
        "success": False,
        "message": "Endpoint no encontrado."
    }), 404


@app.errorhandler(413)
def request_too_large(_error):
    return jsonify({
        "success": False,
        "message": "La solicitud es demasiado grande."
    }), 413


@app.errorhandler(500)
def internal_error(_error):
    return jsonify({
        "success": False,
        "message": "Error interno del servidor."
    }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )

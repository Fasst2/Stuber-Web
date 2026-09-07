import os
import smtplib

from email.message import EmailMessage
from dotenv import load_dotenv


load_dotenv()


SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587

GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
GMAIL_DESTINATION = os.getenv("GMAIL_DESTINATION")


def send_project_email(data):

    if not GMAIL_USER:
        raise RuntimeError("Falta GMAIL_USER en .env")

    if not GMAIL_APP_PASSWORD:
        raise RuntimeError("Falta GMAIL_APP_PASSWORD en .env")

    if not GMAIL_DESTINATION:
        raise RuntimeError("Falta GMAIL_DESTINATION en .env")


    style = data.get("style", [])
    features = data.get("features", [])


    if isinstance(style, list):
        style_text = ", ".join(style) if style else "No especificado"
    else:
        style_text = str(style)


    if isinstance(features, list):
        features_text = ", ".join(features) if features else "Ninguna especificada"
    else:
        features_text = str(features)


    body = f"""
NUEVA SOLICITUD DE PROYECTO
STUBER.WEB
========================================


DATOS DEL CLIENTE
----------------------------------------

Nombre:
{data.get("fullName", "No especificado")}

Email:
{data.get("email", "No especificado")}

WhatsApp:
{data.get("whatsapp", "No especificado")}

Empresa / emprendimiento:
{data.get("company", "No especificado")}


PROYECTO
----------------------------------------

Nombre del proyecto:
{data.get("projectName", "No especificado")}

Tipo de web:
{data.get("websiteType", "No especificado")}

Descripción:

{data.get("projectDescription", "No especificado")}


WEB ACTUAL
----------------------------------------

{data.get("existingWebsite", "No tiene / no especificado")}


DISEÑO Y CONTENIDO
----------------------------------------

Estilo:
{style_text}

Referencias:
{data.get("references", "No especificado")}

Estado del contenido:
{data.get("contentStatus", "No especificado")}


FUNCIONALIDADES
----------------------------------------

{features_text}


OTRAS FUNCIONALIDADES
----------------------------------------

{data.get("otherFeatures", "Ninguna")}


PRESUPUESTO Y PLAZOS
----------------------------------------

Presupuesto:
{data.get("budget", "No especificado")}

Plazo:
{data.get("deadline", "No especificado")}

Dominio / hosting:
{data.get("hostingStatus", "No especificado")}


DETALLES FINALES
----------------------------------------

{data.get("additionalDetails", "Ninguno")}


ORIGEN
----------------------------------------

Conoció STUBER.WEB mediante:
{data.get("source", "No especificado")}


========================================
Solicitud recibida desde STUBER.WEB
========================================
"""


    message = EmailMessage()

    message["Subject"] = (
        f"Nuevo proyecto — "
        f"{data.get('projectName', 'Sin nombre')}"
    )

    message["From"] = GMAIL_USER
    message["To"] = GMAIL_DESTINATION

    message["Reply-To"] = data.get(
        "email",
        GMAIL_USER
    )

    message.set_content(body)


    with smtplib.SMTP(
        SMTP_HOST,
        SMTP_PORT
    ) as smtp:

        smtp.starttls()

        smtp.login(
            GMAIL_USER,
            GMAIL_APP_PASSWORD
        )

        smtp.send_message(message)
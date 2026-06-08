from fastapi import APIRouter, Depends, HTTPException
from app.models import ContactMessage, ContactResponse
from app.services.profile_service import ProfileService
from app.services.email_service import EmailService
from app.deps import get_service, get_email_service

router = APIRouter()


@router.post("/contact", response_model=ContactResponse)
def send_contact(
    msg: ContactMessage,
    svc: ProfileService   = Depends(get_service),
    email: EmailService   = Depends(get_email_service),
) -> ContactResponse:
    contact_to = svc.get_contact_email()
    if not contact_to:
        raise HTTPException(status_code=503, detail="Contact not configured")

    body = (
        f"New message from bathaee.de contact form\n"
        f"{'-' * 48}\n"
        f"From:    {msg.email}\n"
        f"Subject: {msg.subject}\n\n"
        f"{msg.message}\n"
    )

    ok = email.send(
        to=contact_to,
        subject=f"[bathaee.de] {msg.subject}",
        body=body,
        reply_to=str(msg.email),
    )

    if not ok:
        raise HTTPException(status_code=500, detail="Failed to send message")

    return ContactResponse(success=True, detail="Message sent — we'll be in touch soon.")

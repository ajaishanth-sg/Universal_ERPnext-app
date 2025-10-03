import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
from typing import List
import logging
from datetime import datetime

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "your-email@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "your-app-password")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@universererp.com")

# Base URL for approval links
BASE_URL = os.getenv("BASE_URL", "http://localhost:5176")

def create_approval_email_html(
    approver_name: str,
    reference_title: str,
    approval_type: str,
    approval_url: str,
    rejection_url: str,
    description: str = None
) -> str:
    """Create HTML email template for approval requests"""

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Approval Request - UniverserERP</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button-container {{ text-align: center; margin: 30px 0; }}
            .approve-btn {{ background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 0 10px; }}
            .reject-btn {{ background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 0 10px; }}
            .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
            .warning {{ background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 UniverserERP</h1>
                <h2>Approval Request</h2>
            </div>

            <div class="content">
                <h3>Hello {approver_name},</h3>

                <p>You have a new approval request that requires your attention:</p>

                <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
                    <h4 style="margin-top: 0; color: #667eea;">{reference_title}</h4>
                    <p><strong>Type:</strong> {approval_type.replace('_', ' ').title()}</p>
                    {f"<p><strong>Description:</strong> {description}</p>" if description else ""}
                </div>

                <div class="warning">
                    <strong>⚠️ Security Notice:</strong> This approval link will expire in 7 days for security reasons.
                </div>

                <div class="button-container">
                    <a href="{approval_url}" class="approve-btn">✅ Approve</a>
                    <a href="{rejection_url}" class="reject-btn">❌ Reject</a>
                </div>

                <p style="text-align: center; margin: 30px 0;">
                    <small>Or copy and paste these links into your browser:</small><br>
                    <strong>Approve:</strong> <a href="{approval_url}" style="word-break: break-all;">{approval_url}</a><br>
                    <strong>Reject:</strong> <a href="{rejection_url}" style="word-break: break-all;">{rejection_url}</a>
                </p>

                <p>
                    <strong>What happens next?</strong><br>
                    • Clicking "Approve" will immediately process the approval<br>
                    • Clicking "Reject" will mark the request as rejected<br>
                    • No login required - this is a secure one-click process<br>
                    • The requester will be automatically notified of your decision
                </p>
            </div>

            <div class="footer">
                <p>
                    This email was sent by UniverserERP system.<br>
                    If you did not expect this email, please contact your system administrator.<br>
                    Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                </p>
            </div>
        </div>
    </body>
    </html>
    """

    return html

def create_capital_call_alert_html(
    investor_name: str,
    fund_name: str,
    call_number: str,
    called_amount: float,
    due_date: str,
    purpose: str,
    description: str = None
) -> str:
    """Create HTML email template for capital call alerts"""

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Capital Call Notice - {fund_name}</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .amount {{ font-size: 24px; font-weight: bold; color: #667eea; text-align: center; margin: 20px 0; }}
            .due-date {{ background: #e3f2fd; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
            .urgent {{ background: #ffebee; border: 1px solid #f44336; padding: 15px; border-radius: 5px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💰 Capital Call Notice</h1>
                <h2>{fund_name}</h2>
            </div>

            <div class="content">
                <h3>Dear {investor_name},</h3>

                <p>This is an official capital call notice for your investment in <strong>{fund_name}</strong>.</p>

                <div class="amount">
                    Capital Called: ${called_amount:,.2f}
                </div>

                <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h4 style="margin-top: 0; color: #667eea;">Call Details</h4>
                    <p><strong>Call Number:</strong> {call_number}</p>
                    <p><strong>Due Date:</strong> {due_date}</p>
                    <p><strong>Purpose:</strong> {purpose}</p>
                    {"<p><strong>Description:</strong> " + str(description) + "</p>" if description else ""}
                </div>

                <div class="due-date">
                    <strong>⚠️ Payment Due:</strong> {due_date}<br>
                    <small>Please ensure payment is made by this date to avoid penalties</small>
                </div>

                <div class="urgent">
                    <strong>Important:</strong> This is a time-sensitive capital call. Late payments may result in penalties as outlined in the fund's Limited Partnership Agreement.
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{BASE_URL}/investor/payments" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        📋 View Payment Instructions
                    </a>
                </div>

                <p>
                    <strong>Payment Instructions:</strong><br>
                    Please reference the capital call number <strong>{call_number}</strong> in your payment.<br>
                    Wire instructions and payment details are available in your investor portal.
                </p>

                <p>
                    If you have any questions about this capital call, please contact your investor relations representative immediately.
                </p>
            </div>

            <div class="footer">
                <p>
                    This capital call notice was generated by UniverserERP Investment Management System.<br>
                    Please treat this as an official legal document.<br>
                    Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                </p>
            </div>
        </div>
    </body>
    </html>
    """

    return html

async def send_approval_email(
    requester_email: str,
    approver_email: str,
    approver_name: str,
    reference_title: str,
    approval_type: str,
    approval_id: str,
    approval_token: str,
    description: str = None
):
    """Send approval email with secure one-click links"""
    try:
        # Create approval and rejection URLs (direct API endpoints)
        approval_url = f"{BASE_URL}/api/email-approvals/approve/{approval_token}"
        rejection_url = f"{BASE_URL}/api/email-approvals/reject/{approval_token}"

        # Create HTML email
        html_content = create_approval_email_html(
            approver_name=approver_name,
            reference_title=reference_title,
            approval_type=approval_type,
            approval_url=approval_url,
            rejection_url=rejection_url,
            description=description
        )

        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Approval Request: {reference_title}"
        msg['From'] = FROM_EMAIL
        msg['To'] = approver_email

        # Add HTML content
        msg.attach(MIMEText(html_content, 'html'))

        # Send email (implement actual SMTP sending)
        print(f"Sending approval email to {approver_email}")
        print(f"Approval URL: {approval_url}")
        print(f"Rejection URL: {rejection_url}")

        # TODO: Implement actual SMTP sending
        # await send_smtp_email(msg)

        return True

    except Exception as e:
        logging.error(f"Failed to send approval email: {str(e)}")
        return False

async def send_capital_call_alerts(capital_call: dict, investor_emails: List[str]):
    """Send capital call alerts to all investors"""
    try:
        for email in investor_emails:
            # Find investor details
            investor_name = "Valued Investor"  # Get from investor data

            html_content = create_capital_call_alert_html(
                investor_name=investor_name,
                fund_name=capital_call["fund_name"],
                call_number=capital_call["call_number"],
                called_amount=capital_call["called_amount"],
                due_date=capital_call["due_date"],
                purpose=capital_call["purpose"],
                description=capital_call.get("description")
            )

            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f"Capital Call Notice - {capital_call['fund_name']} ({capital_call['call_number']})"
            msg['From'] = FROM_EMAIL
            msg['To'] = email

            # Add HTML content
            msg.attach(MIMEText(html_content, 'html'))

            # Send email
            print(f"Sending capital call alert to {email}")
            print(f"Fund: {capital_call['fund_name']}")
            print(f"Amount: ${capital_call['called_amount']}")

            # TODO: Implement actual SMTP sending
            # await send_smtp_email(msg)

        return True

    except Exception as e:
        logging.error(f"Failed to send capital call alerts: {str(e)}")
        return False

async def send_smtp_email(msg: MIMEMultipart):
    """Send email via SMTP (implement with actual credentials)"""
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)

        text = msg.as_string()
        server.sendmail(FROM_EMAIL, msg['To'], text)
        server.quit()

        print(f"Email sent successfully to {msg['To']}")
        return True

    except Exception as e:
        logging.error(f"Failed to send email: {str(e)}")
        return False

# Email templates for different scenarios
EMAIL_TEMPLATES = {
    "approval_request": create_approval_email_html,
    "capital_call": create_capital_call_alert_html,
    "payment_reminder": None,  # Can add more templates as needed
    "fund_update": None
}
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

def create_maintenance_alert_html(
    recipient_name: str,
    asset_name: str,
    alert_type: str,
    severity: str,
    title: str,
    description: str,
    predicted_date: str,
    recommended_action: str,
    estimated_cost: float = None
) -> str:
    """Create HTML email template for maintenance alerts"""

    # Color coding based on severity
    severity_colors = {
        'low': '#28a745',
        'medium': '#ffc107',
        'high': '#fd7e14',
        'critical': '#dc3545'
    }

    severity_color = severity_colors.get(severity.lower(), '#6c757d')

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Maintenance Alert - {asset_name}</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .alert-card {{ background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 5px solid {severity_color}; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
            .severity-badge {{ display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 12px; text-transform: uppercase; background: {severity_color}; color: white; }}
            .action-button {{ background: {severity_color}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 20px 0; }}
            .cost-info {{ background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }}
            .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
            .urgent {{ background: #ffebee; border: 1px solid #f44336; padding: 15px; border-radius: 5px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔧 UniverserERP</h1>
                <h2>Predictive Maintenance Alert</h2>
            </div>

            <div class="content">
                <h3>Hello {recipient_name},</h3>

                <p>Our predictive maintenance system has detected an issue that requires your attention:</p>

                <div class="alert-card">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 15px;">
                        <h4 style="margin: 0; color: #667eea;">{title}</h4>
                        <span class="severity-badge">{severity.upper()}</span>
                    </div>

                    <p><strong>Asset:</strong> {asset_name}</p>
                    <p><strong>Alert Type:</strong> {alert_type.replace('_', ' ').title()}</p>
                    <p><strong>Description:</strong> {description}</p>
                    <p><strong>Predicted Date:</strong> {predicted_date}</p>

                    {f"<div class='cost-info'><strong>Estimated Cost:</strong> ${estimated_cost:,.2f}</div>" if estimated_cost else ""}

                    <p><strong>Recommended Action:</strong> {recommended_action}</p>
                </div>

                {f'<div class="urgent"><strong>🚨 Critical Alert:</strong> This maintenance should be addressed immediately to prevent asset failure and ensure operational safety.</div>' if severity.lower() == 'critical' else ''}

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{BASE_URL}/maintenance/alerts" class="action-button">
                        📋 View All Maintenance Alerts
                    </a>
                </div>

                <p>
                    <strong>Why This Alert?</strong><br>
                    Our AI-powered predictive maintenance system analyzes various factors including:
                    • Asset usage patterns and mileage<br>
                    • Historical maintenance data<br>
                    • Asset age and condition<br>
                    • Scheduled maintenance requirements
                </p>

                <p>
                    <strong>Next Steps:</strong><br>
                    1. Review the recommended action above<br>
                    2. Schedule maintenance if needed<br>
                    3. Update the alert status once resolved<br>
                    4. Monitor asset performance regularly
                </p>
            </div>

            <div class="footer">
                <p>
                    This maintenance alert was generated by UniverserERP Predictive Maintenance System.<br>
                    For questions, please contact your fleet manager or maintenance team.<br>
                    Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                </p>
            </div>
        </div>
    </body>
    </html>
    """

    return html

async def send_maintenance_alert_email(
    recipient_email: str,
    recipient_name: str = "Fleet Manager",
    alert: 'PredictiveMaintenanceAlert' = None,
    asset_name: str = None,
    alert_type: str = None,
    severity: str = None,
    title: str = None,
    description: str = None,
    predicted_date: str = None,
    recommended_action: str = None,
    estimated_cost: float = None
):
    """Send maintenance alert email"""
    try:
        # If alert object is provided, extract data from it
        if alert:
            asset_name = alert.assetName
            alert_type = alert.alertType
            severity = alert.severity
            title = alert.title
            description = alert.description
            predicted_date = alert.predictedFailureDate
            recommended_action = alert.recommendedAction
            estimated_cost = alert.estimatedCost

        # Create HTML email
        html_content = create_maintenance_alert_html(
            recipient_name=recipient_name,
            asset_name=asset_name,
            alert_type=alert_type,
            severity=severity,
            title=title,
            description=description,
            predicted_date=predicted_date,
            recommended_action=recommended_action,
            estimated_cost=estimated_cost
        )

        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"🚨 Maintenance Alert: {title}"
        msg['From'] = FROM_EMAIL
        msg['To'] = recipient_email

        # Add HTML content
        msg.attach(MIMEText(html_content, 'html'))

        # Send email (implement actual SMTP sending)
        print(f"Sending maintenance alert email to {recipient_email}")
        print(f"Alert: {title}")
        print(f"Asset: {asset_name}")
        print(f"Severity: {severity}")

        # TODO: Implement actual SMTP sending
        # await send_smtp_email(msg)

        return True

    except Exception as e:
        logging.error(f"Failed to send maintenance alert email: {str(e)}")
        return False

def create_payroll_journal_notification_html(
    recipient_name: str,
    batch_number: str,
    total_amount: float,
    total_entries: int,
    period_name: str,
    posted_by: str,
    journal_entries: List[dict] = None
) -> str:
    """Create HTML email template for payroll journal notifications"""

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payroll Journal Posted - {batch_number}</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .summary-card {{ background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #28a745; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
            .amount {{ font-size: 24px; font-weight: bold; color: #28a745; text-align: center; margin: 20px 0; }}
            .detail-table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            .detail-table th, .detail-table td {{ padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }}
            .detail-table th {{ background-color: #f8f9fa; font-weight: bold; }}
            .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
            .success {{ background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💰 UniverserERP</h1>
                <h2>Payroll Journal Posted</h2>
            </div>

            <div class="content">
                <h3>Hello {recipient_name},</h3>

                <p>Great news! The payroll journal has been successfully posted to the accounting system.</p>

                <div class="success">
                    <strong>✅ Journal Posting Complete</strong><br>
                    All payroll entries have been processed and posted to the general ledger.
                </div>

                <div class="summary-card">
                    <h4 style="margin-top: 0; color: #667eea;">Posting Summary</h4>
                    <table class="detail-table">
                        <tr>
                            <th>Batch Number:</th>
                            <td>{batch_number}</td>
                        </tr>
                        <tr>
                            <th>Payroll Period:</th>
                            <td>{period_name}</td>
                        </tr>
                        <tr>
                            <th>Total Entries:</th>
                            <td>{total_entries}</td>
                        </tr>
                        <tr>
                            <th>Posted By:</th>
                            <td>{posted_by}</td>
                        </tr>
                    </table>
                </div>

                <div class="amount">
                    Total Payroll Amount: ${total_amount:,.2f}
                </div>

                {f'''
                <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h4 style="margin-top: 0; color: #667eea;">Journal Entries Created</h4>
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>Entry #</th>
                                <th>Description</th>
                                <th>Debit</th>
                                <th>Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                ''' + ''.join(f'''
                            <tr>
                                <td>{entry.get('entryNumber', 'N/A')}</td>
                                <td>{entry.get('description', 'N/A')}</td>
                                <td>${entry.get('totalDebit', 0):,.2f}</td>
                                <td>${entry.get('totalCredit', 0):,.2f}</td>
                            </tr>
                ''' for entry in (journal_entries or [])) + '''
                        </tbody>
                    </table>
                </div>
                ''' if journal_entries else ''}

                <p>
                    <strong>What happens next?</strong><br>
                    • Journal entries are now part of the general ledger<br>
                    • Payroll expenses have been recorded in the appropriate accounts<br>
                    • Tax liabilities have been updated<br>
                    • Financial reports will reflect these transactions<br>
                    • Employee payments should be processed according to schedule
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{BASE_URL}/accounting/journals" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        📊 View Journal Entries
                    </a>
                </div>

                <p>
                    <strong>Need Help?</strong><br>
                    If you notice any discrepancies or need to make adjustments, please contact the accounting team immediately.
                </p>
            </div>

            <div class="footer">
                <p>
                    This payroll journal notification was generated by UniverserERP Accounting System.<br>
                    For questions, please contact your accounting department.<br>
                    Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                </p>
            </div>
        </div>
    </body>
    </html>
    """

    return html

async def send_payroll_journal_notification(
    recipient_email: str,
    recipient_name: str = "Accounting Team",
    batch: 'PayrollJournalBatch' = None,
    journal_entries: List[dict] = None,
    batch_number: str = None,
    total_amount: float = None,
    total_entries: int = None,
    period_name: str = None,
    posted_by: str = None
):
    """Send payroll journal notification email"""
    try:
        # If batch object is provided, extract data from it
        if batch:
            batch_number = batch.batchNumber
            total_amount = batch.totalAmount
            total_entries = batch.totalEntries
            period_name = batch.payrollPeriodId
            posted_by = batch.createdBy

        # Create HTML email
        html_content = create_payroll_journal_notification_html(
            recipient_name=recipient_name,
            batch_number=batch_number,
            total_amount=total_amount,
            total_entries=total_entries,
            period_name=period_name,
            posted_by=posted_by,
            journal_entries=journal_entries
        )

        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"✅ Payroll Journal Posted - {batch_number}"
        msg['From'] = FROM_EMAIL
        msg['To'] = recipient_email

        # Add HTML content
        msg.attach(MIMEText(html_content, 'html'))

        # Send email (implement actual SMTP sending)
        print(f"Sending payroll journal notification to {recipient_email}")
        print(f"Batch: {batch_number}")
        print(f"Amount: ${total_amount}")

        # TODO: Implement actual SMTP sending
        # await send_smtp_email(msg)

        return True

    except Exception as e:
        logging.error(f"Failed to send payroll journal notification: {str(e)}")
        return False

# Email templates for different scenarios
EMAIL_TEMPLATES = {
    "approval_request": create_approval_email_html,
    "capital_call": create_capital_call_alert_html,
    "maintenance_alert": create_maintenance_alert_html,
    "payroll_journal": create_payroll_journal_notification_html,
    "payment_reminder": None,  # Can add more templates as needed
    "fund_update": None
}
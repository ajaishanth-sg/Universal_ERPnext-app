from fastapi import APIRouter
from database import db
from datetime import datetime, timedelta
from bson import ObjectId

router = APIRouter()

# Collections
sales_collection = db.sales_invoices
purchase_collection = db.purchase_invoices
accounts_payable_collection = db.accounts_payable
accounts_receivable_collection = db.accounts_receivable
spv_company_collection = db.spv_companies
racing_payment_collection = db.racing_payments
team_member_collection = db.team_members
inventory_collection = db.inventory

@router.get("/accounting")
async def get_accounting_dashboard():
    # Get total revenue from sales invoices
    sales_pipeline = [
        {"$match": {"status": "Submitted"}},
        {"$group": {"_id": None, "total": {"$sum": "$grandTotal"}}}
    ]
    sales_result = await sales_collection.aggregate(sales_pipeline).to_list(length=1)
    total_revenue = sales_result[0]["total"] if sales_result else 0

    # Get total expenses from purchase invoices
    purchase_pipeline = [
        {"$match": {"status": "Submitted"}},
        {"$group": {"_id": None, "total": {"$sum": "$grandTotal"}}}
    ]
    purchase_result = await purchase_collection.aggregate(purchase_pipeline).to_list(length=1)
    total_expenses = purchase_result[0]["total"] if purchase_result else 0

    net_profit = total_revenue - total_expenses

    # Get outstanding invoices from accounts payable
    payable_pipeline = [
        {"$group": {"_id": None, "total": {"$sum": "$outstandingAmount"}}}
    ]
    payable_result = await accounts_payable_collection.aggregate(payable_pipeline).to_list(length=1)
    outstanding_invoices = payable_result[0]["total"] if payable_result else 0

    # Get monthly data for charts (last 6 months)
    six_months_ago = datetime.now() - timedelta(days=180)
    monthly_sales = await sales_collection.aggregate([
        {"$match": {"date": {"$gte": six_months_ago.isoformat()}}},
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m", "date": {"$dateFromString": {"dateString": "$date"}}}},
            "total": {"$sum": "$grandTotal"}
        }},
        {"$sort": {"_id": 1}}
    ]).to_list(length=None)

    monthly_purchases = await purchase_collection.aggregate([
        {"$match": {"date": {"$gte": six_months_ago.isoformat()}}},
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m", "date": {"$dateFromString": {"dateString": "$date"}}}},
            "total": {"$sum": "$grandTotal"}
        }},
        {"$sort": {"_id": 1}}
    ]).to_list(length=None)

    # Accounts receivable aging
    receivable_aging = await accounts_receivable_collection.aggregate([
        {"$group": {
            "_id": "$age",
            "total": {"$sum": "$outstandingAmount"}
        }}
    ]).to_list(length=None)

    # Accounts payable aging
    payable_aging = await accounts_payable_collection.aggregate([
        {"$group": {
            "_id": "$age",
            "total": {"$sum": "$outstandingAmount"}
        }}
    ]).to_list(length=None)

    return {
        "stats": {
            "totalRevenue": total_revenue,
            "totalExpenses": total_expenses,
            "netProfit": net_profit,
            "outstandingInvoices": outstanding_invoices
        },
        "charts": {
            "monthlySales": monthly_sales,
            "monthlyPurchases": monthly_purchases,
            "receivableAging": receivable_aging,
            "payableAging": payable_aging
        }
    }

@router.get("/financial")
async def get_financial_dashboard():
    # Financial stats
    # Total assets - this would need a proper assets calculation
    total_assets = 0  # Placeholder

    # Monthly revenue
    current_month = datetime.now().replace(day=1)
    monthly_revenue_pipeline = [
        {"$match": {
            "status": "Submitted",
            "date": {"$gte": current_month.isoformat()}
        }},
        {"$group": {"_id": None, "total": {"$sum": "$grandTotal"}}}
    ]
    revenue_result = await sales_collection.aggregate(monthly_revenue_pipeline).to_list(length=1)
    monthly_revenue = revenue_result[0]["total"] if revenue_result else 0

    # Outstanding payments
    outstanding_payments = await accounts_payable_collection.aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$outstandingAmount"}}}
    ]).to_list(length=1)
    outstanding_payments_total = outstanding_payments[0]["total"] if outstanding_payments else 0

    # Bank accounts count (placeholder)
    bank_accounts_count = 0  # Would need bank accounts collection

    # Recent transactions (last 10)
    recent_sales = await sales_collection.find(
        {"status": "Submitted"}
    ).sort("date", -1).limit(5).to_list(length=None)

    recent_purchases = await purchase_collection.find(
        {"status": "Submitted"}
    ).sort("date", -1).limit(5).to_list(length=None)

    # Combine and sort
    recent_transactions = []
    for sale in recent_sales:
        recent_transactions.append({
            "id": str(sale["_id"]),
            "type": "payment",
            "description": f"Sale to {sale.get('customer', 'Customer')}",
            "amount": sale["grandTotal"],
            "date": sale["date"],
            "status": "completed",
            "account": "Sales"
        })

    for purchase in recent_purchases:
        recent_transactions.append({
            "id": str(purchase["_id"]),
            "type": "transfer",
            "description": f"Purchase from {purchase.get('supplier', 'Supplier')}",
            "amount": purchase["grandTotal"],
            "date": purchase["date"],
            "status": "completed",
            "account": "Purchases"
        })

    recent_transactions.sort(key=lambda x: x["date"], reverse=True)
    recent_transactions = recent_transactions[:10]

    return {
        "stats": {
            "totalAssets": total_assets,
            "monthlyRevenue": monthly_revenue,
            "outstandingPayments": outstanding_payments_total,
            "bankAccounts": bank_accounts_count
        },
        "recentTransactions": recent_transactions,
        "bankAccounts": []  # Placeholder
    }

@router.get("/operations")
async def get_operations_dashboard():
    # SPV Companies count
    spv_count = await spv_company_collection.count_documents({})

    # Racing events count (from racing payments or separate collection)
    racing_count = await racing_payment_collection.count_documents({})

    # Active consultants (from team members)
    consultant_count = await team_member_collection.count_documents({"status": "Active"})

    # Service providers (placeholder)
    service_providers_count = 0  # Would need service providers collection

    # Get SPV companies
    spv_companies = await spv_company_collection.find().limit(10).to_list(length=None)
    for company in spv_companies:
        company["_id"] = str(company["_id"])

    # Get racing events (placeholder - using racing payments)
    racing_events = await racing_payment_collection.find().limit(10).to_list(length=None)
    for event in racing_events:
        event["_id"] = str(event["_id"])

    # Get consultants
    consultants = await team_member_collection.find({"status": "Active"}).limit(10).to_list(length=None)
    for consultant in consultants:
        consultant["_id"] = str(consultant["_id"])

    return {
        "stats": {
            "spvCompanies": spv_count,
            "racingEvents": racing_count,
            "activeConsultants": consultant_count,
            "serviceProviders": service_providers_count
        },
        "spvCompanies": spv_companies,
        "racingEvents": racing_events,
        "consultants": consultants
    }
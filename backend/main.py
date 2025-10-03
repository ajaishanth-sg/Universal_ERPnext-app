from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import os
import random

from routes.abroad_staff_router import router as abroad_staff_router
from routes.accounts_payable_router import router as accounts_payable_router
from routes.accounts_receivable_router import router as accounts_receivable_router
from routes.dashboard_router import router as dashboard_router
from routes.debit_card_router import router as debit_card_router
from routes.driver_router import router as driver_router
from routes.housing_router import router as housing_router
from routes.inventory_router import router as inventory_router
from routes.maintenance_request_router import router as maintenance_request_router
from routes.maintenance_schedule_router import router as maintenance_schedule_router
from routes.maintenance_scheduling_router import router as maintenance_scheduling_router
from routes.purchase_invoice_router import router as purchase_invoice_router
from routes.racing_payment_router import router as racing_payment_router
from routes.sales_invoice_router import router as sales_invoice_router
from routes.shipment_router import router as shipment_router
from routes.spv_company_router import router as spv_company_router
from routes.spv_expenditure_router import router as spv_expenditure_router
from routes.team_member_router import router as team_member_router
from routes.travel_trip_router import router as travel_trip_router
from routes.vehicle_router import router as vehicle_router
from routes.email_approval_router import router as email_approval_router
from routes.capital_call_router import router as capital_call_router
from routes.maintenance_alert_router import router as maintenance_alert_router
from routes.payroll_router import router as payroll_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(abroad_staff_router, prefix="/api/abroad-staff", tags=["abroad_staff"])
app.include_router(accounts_payable_router, prefix="/api/accounts-payable", tags=["accounts_payable"])
app.include_router(accounts_receivable_router, prefix="/api/accounts-receivable", tags=["accounts_receivable"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(debit_card_router, prefix="/api/debit-cards", tags=["debit_cards"])
app.include_router(driver_router, prefix="/api/drivers", tags=["drivers"])
app.include_router(housing_router, prefix="/api/housing", tags=["housing"])
app.include_router(inventory_router, prefix="/api/inventory", tags=["inventory"])
app.include_router(maintenance_request_router, prefix="/api/maintenance-requests", tags=["maintenance_requests"])
app.include_router(maintenance_schedule_router, prefix="/api/maintenance-schedules", tags=["maintenance_schedules"])
app.include_router(maintenance_scheduling_router, prefix="/api/maintenanceschedulingcar", tags=["maintenance_scheduling"])
app.include_router(purchase_invoice_router, prefix="/api/purchase-invoices", tags=["purchase_invoices"])
app.include_router(racing_payment_router, prefix="/api/racing-payments", tags=["racing_payments"])
app.include_router(sales_invoice_router, prefix="/api/sales-invoices", tags=["sales_invoices"])
app.include_router(shipment_router, prefix="/api/shipments", tags=["shipments"])
app.include_router(spv_company_router, prefix="/api/spv-companies", tags=["spv_companies"])
app.include_router(spv_expenditure_router, prefix="/api/spv-expenditures", tags=["spv_expenditures"])
app.include_router(team_member_router, prefix="/api/team-members", tags=["team_members"])
app.include_router(travel_trip_router, prefix="/api/travel-trips", tags=["travel_trips"])
app.include_router(vehicle_router, prefix="/api/vehicles", tags=["vehicles"])
app.include_router(email_approval_router, prefix="/api/email-approvals", tags=["email_approvals"])
app.include_router(capital_call_router, prefix="/api/capital-calls", tags=["capital_calls"])
app.include_router(maintenance_alert_router, prefix="/api/maintenance-alerts", tags=["maintenance_alerts"])
app.include_router(payroll_router, prefix="/api/payroll", tags=["payroll"])

@app.get("/weather")
async def get_weather(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    asl: float = Query(..., description="Altitude above sea level")
):
    # Mock weather data in Meteoblue format
    temperatures = [22, 24, 26, 25, 23, 21, 20]
    conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Sunny", "Clear", "Sunny"]

    return {
        "data_day": {
            "temperature_mean": [random.choice(temperatures)],
            "weather": [random.choice(conditions)]
        }
    }

@app.get("/")
async def root():
    return {"message": "Backend is running"}

@app.get("/api/test")
async def test():
    return {"message": "API is working"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
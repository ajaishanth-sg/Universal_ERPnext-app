import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import logging
from models.predictive_maintenance import PredictiveMaintenanceAlert, MaintenancePrediction, AssetHealthScore
from models.vehicle import Vehicle
from models.maintenance_schedule import MaintenanceSchedule
from email_service import send_maintenance_alert_email

logger = logging.getLogger(__name__)

class MaintenanceAlertService:
    def __init__(self):
        self.alert_thresholds = {
            'vehicle_mileage': {
                'warning': 5000,  # 5,000 km before due
                'critical': 1000  # 1,000 km before due
            },
            'time_based': {
                'warning': 7,  # 7 days before due
                'critical': 1  # 1 day before due
            }
        }

    async def analyze_vehicle_maintenance(self, vehicles: List[Vehicle], schedules: List[MaintenanceSchedule]) -> List[PredictiveMaintenanceAlert]:
        """Analyze vehicles and generate predictive maintenance alerts"""
        alerts = []

        for vehicle in vehicles:
            # Check mileage-based alerts
            if vehicle.mileage and vehicle.nextPM:
                mileage_alerts = await self._check_mileage_based_alerts(vehicle)
                alerts.extend(mileage_alerts)

            # Check time-based alerts
            time_alerts = await self._check_time_based_alerts(vehicle, schedules)
            alerts.extend(time_alerts)

            # Check condition-based alerts (based on vehicle age, usage patterns)
            condition_alerts = await self._check_condition_based_alerts(vehicle)
            alerts.extend(condition_alerts)

        return alerts

    async def _check_mileage_based_alerts(self, vehicle: Vehicle) -> List[PredictiveMaintenanceAlert]:
        """Check for mileage-based maintenance alerts"""
        alerts = []

        try:
            current_mileage = float(vehicle.mileage) if vehicle.mileage else 0
            next_maintenance_mileage = float(vehicle.nextPM) if vehicle.nextPM else 0

            if next_maintenance_mileage > 0:
                remaining_km = next_maintenance_mileage - current_mileage

                if remaining_km <= self.alert_thresholds['vehicle_mileage']['critical']:
                    alert = PredictiveMaintenanceAlert(
                        assetId=vehicle.id or '',
                        assetType='vehicle',
                        assetName=f"{vehicle.make} {vehicle.model} ({vehicle.plate})",
                        alertType='mileage_based',
                        severity='critical',
                        title='Critical Maintenance Due Soon',
                        description=f'Vehicle {vehicle.plate} is due for maintenance in {remaining_km:.0f} km',
                        predictedFailureDate=datetime.now().strftime('%Y-%m-%d'),
                        confidence=95.0,
                        recommendedAction='Schedule immediate maintenance appointment',
                        estimatedCost=500.0  # Default estimate
                    )
                    alerts.append(alert)

                elif remaining_km <= self.alert_thresholds['vehicle_mileage']['warning']:
                    alert = PredictiveMaintenanceAlert(
                        assetId=vehicle.id or '',
                        assetType='vehicle',
                        assetName=f"{vehicle.make} {vehicle.model} ({vehicle.plate})",
                        alertType='mileage_based',
                        severity='high',
                        title='Maintenance Due Soon',
                        description=f'Vehicle {vehicle.plate} will need maintenance in {remaining_km:.0f} km',
                        predictedFailureDate=(datetime.now() + timedelta(days=int(remaining_km / 50))).strftime('%Y-%m-%d'),  # Assuming 50km/day average
                        confidence=85.0,
                        recommendedAction='Schedule maintenance appointment within 2 weeks',
                        estimatedCost=500.0
                    )
                    alerts.append(alert)

        except (ValueError, TypeError) as e:
            logger.error(f"Error checking mileage alerts for vehicle {vehicle.id}: {str(e)}")

        return alerts

    async def _check_time_based_alerts(self, vehicle: Vehicle, schedules: List[MaintenanceSchedule]) -> List[PredictiveMaintenanceAlert]:
        """Check for time-based maintenance alerts"""
        alerts = []

        # Filter schedules for this vehicle
        vehicle_schedules = [s for s in schedules if s.property == vehicle.plate]

        for schedule in vehicle_schedules:
            try:
                next_due = datetime.strptime(schedule.nextDue, '%Y-%m-%d')
                now = datetime.now()
                days_until_due = (next_due - now).days

                if days_until_due <= self.alert_thresholds['time_based']['critical']:
                    alert = PredictiveMaintenanceAlert(
                        assetId=vehicle.id or '',
                        assetType='vehicle',
                        assetName=f"{vehicle.make} {vehicle.model} ({vehicle.plate})",
                        alertType='time_based',
                        severity='critical',
                        title=f'Critical: {schedule.task} Due',
                        description=f'Scheduled {schedule.task} for {vehicle.plate} is overdue or due today',
                        predictedFailureDate=schedule.nextDue,
                        confidence=90.0,
                        recommendedAction=f'Complete {schedule.task} immediately',
                        estimatedCost=float(schedule.cost) if schedule.cost else 300.0
                    )
                    alerts.append(alert)

                elif days_until_due <= self.alert_thresholds['time_based']['warning']:
                    alert = PredictiveMaintenanceAlert(
                        assetId=vehicle.id or '',
                        assetType='vehicle',
                        assetName=f"{vehicle.make} {vehicle.model} ({vehicle.plate})",
                        alertType='time_based',
                        severity='medium',
                        title=f'{schedule.task} Due Soon',
                        description=f'Scheduled {schedule.task} for {vehicle.plate} is due in {days_until_due} days',
                        predictedFailureDate=schedule.nextDue,
                        confidence=80.0,
                        recommendedAction=f'Schedule {schedule.task} appointment',
                        estimatedCost=float(schedule.cost) if schedule.cost else 300.0
                    )
                    alerts.append(alert)

            except (ValueError, TypeError) as e:
                logger.error(f"Error checking time alerts for vehicle {vehicle.id}: {str(e)}")

        return alerts

    async def _check_condition_based_alerts(self, vehicle: Vehicle) -> List[PredictiveMaintenanceAlert]:
        """Check for condition-based alerts based on vehicle age and usage"""
        alerts = []

        try:
            # Check vehicle age (assuming purchase date indicates age)
            if vehicle.purchaseDate:
                purchase_date = datetime.strptime(vehicle.purchaseDate, '%Y-%m-%d')
                vehicle_age_years = (datetime.now() - purchase_date).days / 365

                # Alert for older vehicles that might need more frequent maintenance
                if vehicle_age_years > 5:
                    alert = PredictiveMaintenanceAlert(
                        assetId=vehicle.id or '',
                        assetType='vehicle',
                        assetName=f"{vehicle.make} {vehicle.model} ({vehicle.plate})",
                        alertType='condition_based',
                        severity='medium',
                        title='Aging Vehicle Maintenance Check',
                        description=f'Vehicle is {vehicle_age_years:.1f} years old and may need additional maintenance',
                        predictedFailureDate=(datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
                        confidence=70.0,
                        recommendedAction='Schedule comprehensive vehicle inspection',
                        estimatedCost=800.0
                    )
                    alerts.append(alert)

        except (ValueError, TypeError) as e:
            logger.error(f"Error checking condition alerts for vehicle {vehicle.id}: {str(e)}")

        return alerts

    async def calculate_asset_health_score(self, vehicle: Vehicle) -> AssetHealthScore:
        """Calculate overall health score for a vehicle"""
        score = 100.0
        components = {}
        recommendations = []

        try:
            # Mileage score (lower mileage = higher score)
            if vehicle.mileage:
                mileage = float(vehicle.mileage)
                if mileage > 200000:
                    score -= 30
                    components['mileage'] = 40
                    recommendations.append('High mileage - consider major service')
                elif mileage > 100000:
                    score -= 15
                    components['mileage'] = 70
                    recommendations.append('Medium mileage - schedule maintenance')
                else:
                    components['mileage'] = 90

            # Age score
            if vehicle.purchaseDate:
                purchase_date = datetime.strptime(vehicle.purchaseDate, '%Y-%m-%d')
                age_years = (datetime.now() - purchase_date).days / 365
                if age_years > 7:
                    score -= 25
                    components['age'] = 50
                    recommendations.append('Older vehicle - increased maintenance frequency recommended')
                elif age_years > 4:
                    score -= 10
                    components['age'] = 75
                else:
                    components['age'] = 95

            # Maintenance status score
            if vehicle.nextPM:
                next_pm = float(vehicle.nextPM) if vehicle.nextPM else 0
                current_mileage = float(vehicle.mileage) if vehicle.mileage else 0
                if next_pm > 0:
                    remaining = next_pm - current_mileage
                    if remaining < 1000:
                        score -= 20
                        components['maintenance'] = 60
                        recommendations.append('Maintenance overdue - schedule immediately')
                    elif remaining < 5000:
                        score -= 10
                        components['maintenance'] = 80
                    else:
                        components['maintenance'] = 95

            # Determine trend
            trend = 'stable'
            if score < 70:
                trend = 'declining'
            elif score > 85:
                trend = 'improving'

            return AssetHealthScore(
                assetId=vehicle.id or '',
                assetType='vehicle',
                overallScore=max(0, min(100, score)),
                components=components,
                lastCalculated=datetime.now(),
                trend=trend,
                recommendations=recommendations
            )

        except (ValueError, TypeError) as e:
            logger.error(f"Error calculating health score for vehicle {vehicle.id}: {str(e)}")
            return AssetHealthScore(
                assetId=vehicle.id or '',
                assetType='vehicle',
                overallScore=50.0,
                components={'error': 50},
                lastCalculated=datetime.now(),
                trend='stable',
                recommendations=['Unable to calculate health score']
            )

    async def send_maintenance_alerts(self, alerts: List[PredictiveMaintenanceAlert], recipients: List[str]):
        """Send maintenance alert emails to specified recipients"""
        for alert in alerts:
            for recipient in recipients:
                try:
                    await send_maintenance_alert_email(
                        recipient_email=recipient,
                        alert=alert
                    )
                except Exception as e:
                    logger.error(f"Failed to send maintenance alert email: {str(e)}")

# Global service instance
maintenance_alert_service = MaintenanceAlertService()
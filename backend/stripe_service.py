import stripe
import os
from typing import Dict, Optional, List
from datetime import datetime, timedelta
import logging
from dotenv import load_dotenv
from models import User, UserTier, SubscriptionPlan, SubscriptionCreate

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class StripeService:
    def __init__(self):
        # Initialize Stripe with your secret key
        stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')
        self.publishable_key = os.environ.get('STRIPE_PUBLISHABLE_KEY')
        
        # Subscription plans
        self.subscription_plans = {
            'monthly': {
                'price_id': 'price_monthly_999',  # Create this in Stripe Dashboard
                'amount': 999,  # $9.99 in cents
                'interval': 'month',
                'name': 'THREE11 MOTION TECH Monthly'
            },
            'yearly': {
                'price_id': 'price_yearly_7999',  # Create this in Stripe Dashboard
                'amount': 7999,  # $79.99 in cents
                'interval': 'year',
                'name': 'THREE11 MOTION TECH Yearly'
            }
        }
        
        # Premium pack products
        self.premium_packs = {
            'luxury_fashion': {
                'price_id': 'price_luxury_fashion_499',
                'amount': 499,  # $4.99
                'name': 'Luxury Fashion Pack'
            },
            'pro_athlete': {
                'price_id': 'price_pro_athlete_399',
                'amount': 399,  # $3.99
                'name': 'Pro Athlete Pack'
            },
            'music_producer': {
                'price_id': 'price_music_producer_599',
                'amount': 599,  # $5.99
                'name': 'Music Producer Pack'
            },
            'professional_writer': {
                'price_id': 'price_professional_writer_699',
                'amount': 699,  # $6.99
                'name': 'Professional Writer Pack'
            },
            'event_space_pro': {
                'price_id': 'price_event_space_pro_899',
                'amount': 899,  # $8.99
                'name': 'Event Space Pro Pack'
            }
        }

    async def create_customer(self, user: User) -> str:
        """Create a Stripe customer"""
        try:
            customer = stripe.Customer.create(
                email=user.email,
                name=user.name,
                metadata={
                    'user_id': user.id,
                    'platform': 'THREE11_MOTION_TECH'
                }
            )
            return customer.id
        except Exception as e:
            logger.error(f"Error creating Stripe customer: {e}")
            raise

    async def create_subscription(self, customer_id: str, plan_type: str) -> Dict:
        """Create a subscription for a customer"""
        try:
            if plan_type not in self.subscription_plans:
                raise ValueError(f"Invalid plan type: {plan_type}")
            
            plan = self.subscription_plans[plan_type]
            
            subscription = stripe.Subscription.create(
                customer=customer_id,
                items=[{
                    'price': plan['price_id'],
                }],
                metadata={
                    'plan_type': plan_type,
                    'platform': 'THREE11_MOTION_TECH'
                }
            )
            
            return {
                'subscription_id': subscription.id,
                'status': subscription.status,
                'current_period_start': datetime.fromtimestamp(subscription.current_period_start),
                'current_period_end': datetime.fromtimestamp(subscription.current_period_end),
                'plan_type': plan_type
            }
        except Exception as e:
            logger.error(f"Error creating subscription: {e}")
            raise

    async def create_payment_intent(self, amount: int, currency: str = 'usd', customer_id: str = None) -> Dict:
        """Create a payment intent for one-time purchases"""
        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                customer=customer_id,
                metadata={
                    'platform': 'THREE11_MOTION_TECH'
                }
            )
            
            return {
                'client_secret': payment_intent.client_secret,
                'payment_intent_id': payment_intent.id,
                'amount': amount,
                'currency': currency
            }
        except Exception as e:
            logger.error(f"Error creating payment intent: {e}")
            raise

    async def create_premium_pack_purchase(self, customer_id: str, pack_id: str) -> Dict:
        """Create a payment intent for premium pack purchase"""
        try:
            if pack_id not in self.premium_packs:
                raise ValueError(f"Invalid premium pack: {pack_id}")
            
            pack = self.premium_packs[pack_id]
            
            payment_intent = stripe.PaymentIntent.create(
                amount=pack['amount'],
                currency='usd',
                customer=customer_id,
                metadata={
                    'platform': 'THREE11_MOTION_TECH',
                    'pack_id': pack_id,
                    'pack_name': pack['name']
                }
            )
            
            return {
                'client_secret': payment_intent.client_secret,
                'payment_intent_id': payment_intent.id,
                'amount': pack['amount'],
                'pack_name': pack['name']
            }
        except Exception as e:
            logger.error(f"Error creating premium pack purchase: {e}")
            raise

    async def cancel_subscription(self, subscription_id: str) -> Dict:
        """Cancel a subscription"""
        try:
            subscription = stripe.Subscription.modify(
                subscription_id,
                cancel_at_period_end=True
            )
            
            return {
                'subscription_id': subscription.id,
                'status': subscription.status,
                'cancel_at_period_end': subscription.cancel_at_period_end,
                'current_period_end': datetime.fromtimestamp(subscription.current_period_end)
            }
        except Exception as e:
            logger.error(f"Error canceling subscription: {e}")
            raise

    async def get_subscription_status(self, subscription_id: str) -> Dict:
        """Get subscription status"""
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            
            return {
                'subscription_id': subscription.id,
                'status': subscription.status,
                'current_period_start': datetime.fromtimestamp(subscription.current_period_start),
                'current_period_end': datetime.fromtimestamp(subscription.current_period_end),
                'cancel_at_period_end': subscription.cancel_at_period_end
            }
        except Exception as e:
            logger.error(f"Error getting subscription status: {e}")
            raise

    async def create_billing_portal_session(self, customer_id: str, return_url: str) -> str:
        """Create a billing portal session for customer self-service"""
        try:
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=return_url,
            )
            
            return session.url
        except Exception as e:
            logger.error(f"Error creating billing portal session: {e}")
            raise

    async def handle_webhook(self, payload: str, signature: str) -> Dict:
        """Handle Stripe webhook events"""
        try:
            webhook_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')
            event = stripe.Webhook.construct_event(
                payload, signature, webhook_secret
            )
            
            # Handle different event types
            if event['type'] == 'payment_intent.succeeded':
                return await self._handle_payment_success(event['data']['object'])
            elif event['type'] == 'invoice.payment_succeeded':
                return await self._handle_subscription_payment(event['data']['object'])
            elif event['type'] == 'customer.subscription.updated':
                return await self._handle_subscription_update(event['data']['object'])
            elif event['type'] == 'customer.subscription.deleted':
                return await self._handle_subscription_cancel(event['data']['object'])
            
            return {'status': 'unhandled', 'event_type': event['type']}
            
        except Exception as e:
            logger.error(f"Error handling webhook: {e}")
            raise

    async def _handle_payment_success(self, payment_intent: Dict) -> Dict:
        """Handle successful payment"""
        try:
            metadata = payment_intent.get('metadata', {})
            
            if 'pack_id' in metadata:
                # Premium pack purchase
                return {
                    'status': 'premium_pack_purchased',
                    'pack_id': metadata['pack_id'],
                    'customer_id': payment_intent['customer'],
                    'amount': payment_intent['amount']
                }
            else:
                # One-time payment
                return {
                    'status': 'payment_succeeded',
                    'customer_id': payment_intent['customer'],
                    'amount': payment_intent['amount']
                }
                
        except Exception as e:
            logger.error(f"Error handling payment success: {e}")
            raise

    async def _handle_subscription_payment(self, invoice: Dict) -> Dict:
        """Handle subscription payment"""
        try:
            return {
                'status': 'subscription_payment_succeeded',
                'customer_id': invoice['customer'],
                'subscription_id': invoice['subscription'],
                'amount': invoice['amount_paid']
            }
        except Exception as e:
            logger.error(f"Error handling subscription payment: {e}")
            raise

    async def _handle_subscription_update(self, subscription: Dict) -> Dict:
        """Handle subscription update"""
        try:
            return {
                'status': 'subscription_updated',
                'subscription_id': subscription['id'],
                'customer_id': subscription['customer'],
                'status_changed': subscription['status']
            }
        except Exception as e:
            logger.error(f"Error handling subscription update: {e}")
            raise

    async def _handle_subscription_cancel(self, subscription: Dict) -> Dict:
        """Handle subscription cancellation"""
        try:
            return {
                'status': 'subscription_cancelled',
                'subscription_id': subscription['id'],
                'customer_id': subscription['customer']
            }
        except Exception as e:
            logger.error(f"Error handling subscription cancel: {e}")
            raise

    async def get_customer_payments(self, customer_id: str) -> List[Dict]:
        """Get customer payment history"""
        try:
            charges = stripe.Charge.list(customer=customer_id, limit=100)
            
            payments = []
            for charge in charges.data:
                payments.append({
                    'id': charge.id,
                    'amount': charge.amount,
                    'currency': charge.currency,
                    'status': charge.status,
                    'created': datetime.fromtimestamp(charge.created),
                    'description': charge.description
                })
            
            return payments
        except Exception as e:
            logger.error(f"Error getting customer payments: {e}")
            raise

    def get_publishable_key(self) -> str:
        """Get Stripe publishable key for frontend"""
        return self.publishable_key

# Create global Stripe service instance
stripe_service = StripeService()
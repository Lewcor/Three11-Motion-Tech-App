# Stripe Setup Guide - THREE11 MOTION TECH

## 🔧 Complete Stripe Integration Setup

This guide will help you complete the Stripe payment integration for your THREE11 MOTION TECH platform.

---

## Step 1: Complete Your Stripe Configuration

### Required API Keys

You need to add your **Stripe Secret Key** to complete the payment integration:

1. **Go to your Stripe Dashboard**: https://dashboard.stripe.com/
2. **Navigate to**: Developers → API Keys
3. **Copy your Secret Key** (starts with `sk_live_`)
4. **Add it to your environment variables**:

```bash
# In your .env file, replace:
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE

# With your actual secret key:
STRIPE_SECRET_KEY=sk_live_51Ly0wLDZIccfHPWQ...
```

### Current Configuration Status
✅ **Publishable Key**: Already configured  
❌ **Secret Key**: Needs to be added  
❌ **Webhook Secret**: Needs to be configured  

---

## Step 2: Create Stripe Products and Prices

### Premium Subscription Plans

Create these products in your Stripe Dashboard:

#### Monthly Plan
- **Product Name**: THREE11 MOTION TECH Monthly
- **Price**: $9.99 USD
- **Billing**: Monthly recurring
- **Price ID**: `price_monthly_999` (use this exact ID)

#### Yearly Plan
- **Product Name**: THREE11 MOTION TECH Yearly
- **Price**: $79.99 USD
- **Billing**: Yearly recurring
- **Price ID**: `price_yearly_7999` (use this exact ID)

### Premium Content Packs

Create these one-time purchase products:

#### Luxury Fashion Pack
- **Product Name**: Luxury Fashion Pack
- **Price**: $4.99 USD
- **Type**: One-time payment
- **Price ID**: `price_luxury_fashion_499`

#### Pro Athlete Pack
- **Product Name**: Pro Athlete Pack
- **Price**: $3.99 USD
- **Type**: One-time payment
- **Price ID**: `price_pro_athlete_399`

#### Music Producer Pack
- **Product Name**: Music Producer Pack
- **Price**: $5.99 USD
- **Type**: One-time payment
- **Price ID**: `price_music_producer_599`

#### Professional Writer Pack
- **Product Name**: Professional Writer Pack
- **Price**: $6.99 USD
- **Type**: One-time payment
- **Price ID**: `price_professional_writer_699`

#### Event Space Pro Pack
- **Product Name**: Event Space Pro Pack
- **Price**: $8.99 USD
- **Type**: One-time payment
- **Price ID**: `price_event_space_pro_899`

---

## Step 3: Set Up Webhooks

### Create Webhook Endpoint

1. **Go to**: Stripe Dashboard → Developers → Webhooks
2. **Click**: "Add endpoint"
3. **Endpoint URL**: `https://your-domain.com/api/payments/webhook`
4. **Events to send**:
   - `payment_intent.succeeded`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.created`

### Configure Webhook Secret

1. **Copy the webhook signing secret** from your webhook endpoint
2. **Add it to your environment variables**:

```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

---

## Step 4: Test Your Integration

### Test Credit Cards

Use these test cards in your development environment:

- **Visa**: 4242 4242 4242 4242
- **Visa (debit)**: 4000 0566 5566 5556
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 8224 6310 005
- **Declined**: 4000 0000 0000 0002

### Test Scenarios

1. **Monthly Subscription**: Create and cancel monthly subscription
2. **Yearly Subscription**: Create yearly subscription
3. **Premium Pack**: Purchase individual content packs
4. **Payment Failure**: Test declined cards
5. **Webhook Processing**: Verify webhook events are received

---

## Step 5: Go Live Configuration

### Switch to Live Mode

1. **Toggle to Live mode** in your Stripe Dashboard
2. **Get your Live API keys**:
   - Live Publishable Key: `pk_live_...`
   - Live Secret Key: `sk_live_...`
3. **Update your environment variables**:

```bash
STRIPE_PUBLISHABLE_KEY=pk_live_51Ly0wLDZIccfHPWQ...
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
```

### Production Checklist

- ✅ Live API keys configured
- ✅ Products and prices created
- ✅ Webhooks configured
- ✅ SSL certificate active
- ✅ Payment forms tested
- ✅ Subscription flows tested
- ✅ Refund process tested

---

## Step 6: Frontend Integration

### Update Frontend Environment

Add to your frontend `.env` file:

```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_51Ly0wLDZIccfHPWQ...
```

### Test Payment Flow

1. **Visit your premium page**
2. **Click "Upgrade to Premium"**
3. **Enter test card details**
4. **Complete payment**
5. **Verify account upgrade**

---

## Step 7: Customer Management

### Billing Portal

Your customers can:
- **Update payment methods**
- **View billing history**
- **Cancel subscriptions**
- **Download invoices**

Access via: `/api/payments/billing-portal`

### Customer Support

Common payment issues:
- **Card declined**: Update payment method
- **Subscription not active**: Check webhook processing
- **Refund request**: Process via Stripe Dashboard
- **Billing questions**: Access billing portal

---

## Step 8: Revenue Tracking

### Stripe Dashboard Analytics

Monitor:
- **Monthly Recurring Revenue (MRR)**
- **Customer Lifetime Value (CLV)**
- **Churn Rate**
- **Payment Success Rate**
- **Popular Premium Packs**

### Business Intelligence

Track:
- **Conversion Rates**: Free to Premium
- **Pack Performance**: Which packs sell best
- **Platform Growth**: User acquisition
- **Revenue Trends**: Monthly/yearly growth

---

## Step 9: Security Best Practices

### API Key Security

- **Never commit keys to version control**
- **Use environment variables only**
- **Rotate keys regularly**
- **Monitor for suspicious activity**

### Webhook Security

- **Verify webhook signatures**
- **Use HTTPS only**
- **Implement rate limiting**
- **Log webhook events**

### Customer Data

- **PCI compliance**: Stripe handles card data
- **Data encryption**: Encrypt sensitive data
- **Access controls**: Limit data access
- **Audit trails**: Track data access

---

## Step 10: Troubleshooting

### Common Issues

#### "Invalid API Key"
- **Solution**: Check your secret key in .env file
- **Verify**: Key starts with `sk_live_`

#### "Webhook Verification Failed"
- **Solution**: Check webhook secret in .env file
- **Verify**: Webhook endpoint URL is correct

#### "Payment Failed"
- **Solution**: Check card details and try again
- **Verify**: Using test cards in test mode

#### "Subscription Not Created"
- **Solution**: Check webhook processing
- **Verify**: Price IDs match Stripe Dashboard

### Getting Help

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com
- **THREE11 MOTION TECH Support**: support@three11motiontech.com

---

## Final Steps

### Once Everything is Set Up:

1. ✅ **Add your Stripe Secret Key** to the .env file
2. ✅ **Create products and prices** in Stripe Dashboard
3. ✅ **Set up webhooks** for payment processing
4. ✅ **Test the complete payment flow**
5. ✅ **Go live** with your THREE11 MOTION TECH platform!

### Your Revenue Streams:

- **Monthly Subscriptions**: $9.99/month
- **Yearly Subscriptions**: $79.99/year
- **Premium Packs**: $3.99-$8.99 each
- **Future Add-ons**: Additional revenue opportunities

---

**🎉 Congratulations! Your payment system is ready to generate revenue!**

*Need help with Stripe setup? Contact support@three11motiontech.com*
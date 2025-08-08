# Yandex Webmaster Tools Setup Guide

## Overview
Yandex is Russia's largest search engine and important for international SEO. Setting up Yandex Webmaster Tools will help with search visibility in Russian-speaking markets.

## Step-by-Step Setup Process

### Step 1: Create Yandex Account (if needed)
1. Go to [Yandex Webmaster](https://webmaster.yandex.com/)
2. Click "Sign in" or "Create account"
3. Follow the registration process

### Step 2: Add Your Website
1. Log in to Yandex Webmaster
2. Click the "+" button or "Add site"
3. Enter: `https://app.gentag.ai`
4. Click "Add"

### Step 3: Choose Verification Method

#### Option A: Meta Tag Verification (Recommended)
1. Select "Meta tag" verification method
2. Yandex will provide a meta tag like:
   ```html
   <meta name="yandex-verification" content="abc123def456ghi789" />
   ```
3. **I'll add this to your index.html** once you provide the verification code

#### Option B: HTML File Verification
1. Yandex will provide an HTML file to upload
2. **Not recommended** due to the same static file serving issue we had with Google

#### Option C: DNS Verification
1. Add a TXT record to your DNS (similar to Google)
2. More complex but most reliable

### Step 4: Current Status
✅ **Already prepared in index.html:**
```html
<meta name="yandex-verification" content="YANDEX_VERIFICATION_CODE_PENDING" />
```

🔄 **What I need from you:**
- The actual verification code from Yandex Webmaster Tools

### Step 5: After Verification
Once verified, you'll be able to:
- Submit sitemap: `https://app.gentag.ai/sitemap.xml`
- Monitor search performance in Russian markets
- Check indexing status
- View Yandex-specific SEO recommendations

## Benefits of Yandex Webmaster
- **Market reach**: Russia, Belarus, Kazakhstan, Ukraine
- **Search visibility**: Better rankings in Yandex search
- **Analytics**: Yandex-specific search data
- **Technical SEO**: Yandex crawling insights

## Integration with Current SEO
✅ Sitemap.xml already configured  
✅ Robots.txt allows YandexBot  
✅ Meta tags optimized  
✅ Site structure ready  

## Next Steps
1. **You**: Set up Yandex Webmaster account and get verification code
2. **Me**: Add the verification code to index.html
3. **You**: Complete verification in Yandex Webmaster
4. **Both**: Submit sitemap and monitor performance

## Alternative: DNS Verification
If you prefer DNS verification (like Google):
1. Add TXT record to gentag.ai DNS
2. Record format: `yandex-verification=your-verification-code`
3. More reliable but requires DNS access

## Current Preparation Status
✅ Meta tag placeholder ready  
✅ Robots.txt allows YandexBot  
✅ Sitemap accessible  
⏳ Waiting for verification code  

Let me know the verification code and I'll complete the setup immediately!
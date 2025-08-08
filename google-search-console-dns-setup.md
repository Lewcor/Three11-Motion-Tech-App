# Google Search Console DNS Verification Setup Guide

## Current Status
- ✅ Domain: `app.gentag.ai`
- ✅ Website is live and accessible
- ✅ Sitemap.xml is accessible at: https://app.gentag.ai/sitemap.xml
- ✅ Robots.txt is accessible at: https://app.gentag.ai/robots.txt
- ❌ HTML file verification not working on custom domain (serves React app instead)

## DNS Verification Process (Recommended)

### Step 1: Access Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click "Add Property" or "+" button

### Step 2: Choose Domain Property Type
1. Select **"Domain"** property type (not URL prefix)
2. Enter: `gentag.ai` (without the app. subdomain - this will verify all subdomains)
3. Click "Continue"

### Step 3: Get DNS TXT Record
Google will provide you with a TXT record that looks like:
```
google-site-verification=abcd1234efgh5678ijkl9012mnop3456qrst7890
```

### Step 4: Add TXT Record to DNS
You need to add this TXT record to your domain's DNS settings. This is done through your domain registrar or DNS provider (where you purchased/manage gentag.ai).

**DNS Record Details:**
- **Record Type:** TXT
- **Name/Host:** @ (or leave blank, or use "gentag.ai")
- **Value:** The full verification string from Google
- **TTL:** 3600 (or default)

### Step 5: Verify DNS Propagation
After adding the TXT record, you can check if it's propagated:
```bash
nslookup -type=TXT gentag.ai
```
Or use online tools like: https://mxtoolbox.com/txtlookup.aspx

### Step 6: Verify in Search Console
1. Return to Google Search Console
2. Click "Verify"
3. If it fails, wait 30-60 minutes for DNS propagation and try again

## Alternative: URL Prefix Method (Backup)
If domain verification doesn't work, you can try URL prefix verification:

1. In Search Console, select **"URL prefix"** instead
2. Enter: `https://app.gentag.ai`
3. Choose **"Domain name provider"** method
4. Add the provided TXT record to your DNS

## Common DNS Providers
- **Cloudflare:** DNS tab → Add record → TXT
- **GoDaddy:** DNS Management → Add → TXT
- **Namecheap:** Advanced DNS → Add new record → TXT Record
- **Google Domains:** DNS → Custom records → TXT

## Expected Result
Once verified, you'll be able to:
- ✅ Submit sitemap: https://app.gentag.ai/sitemap.xml
- ✅ Monitor search performance
- ✅ Check indexing status
- ✅ View search queries and clicks

## Next Steps After Verification
1. Submit sitemap in Search Console
2. Request indexing for key pages
3. Monitor for crawl errors
4. Check mobile usability
5. Set up performance monitoring

## Current Meta Tags (Already in place)
The following is already configured in index.html:
```html
<meta name="google-site-verification" content="K-bf3RIZmMm9cBJ5qsNeWWidUO7A7OkEJds8MV4oyqo" />
```

## Need Help?
If you encounter issues:
1. Check if you're accessing the correct DNS management area
2. Ensure the TXT record value is exactly as provided by Google
3. Wait for DNS propagation (can take up to 48 hours, usually much faster)
4. Try using different DNS lookup tools to verify the record

## Status Tracking
- [ ] DNS TXT record added
- [ ] DNS propagation confirmed
- [ ] Google Search Console verification completed
- [ ] Sitemap submitted
- [ ] Key pages indexed
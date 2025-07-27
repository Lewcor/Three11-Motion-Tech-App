#!/bin/bash

# DNS Verification Checker for Google Search Console
# Usage: ./check-dns-verification.sh

echo "🔍 Checking DNS TXT records for gentag.ai domain..."
echo "=============================================="

echo ""
echo "📋 Current TXT records:"
nslookup -type=TXT gentag.ai 2>/dev/null | grep -v "^$" | grep -v "Non-authoritative answer" | grep -v "gentag.ai" | head -10

echo ""
echo "🔍 Looking for Google verification record..."
nslookup -type=TXT gentag.ai 2>/dev/null | grep -i "google-site-verification" && echo "✅ Google verification TXT record found!" || echo "❌ Google verification TXT record not found yet"

echo ""
echo "🕐 Note: DNS propagation can take 5-60 minutes"
echo "📋 You can also check online at: https://mxtoolbox.com/txtlookup.aspx?domain=gentag.ai"
echo ""
#!/usr/bin/env python3
"""
Focused test for Advanced AI Provider functionality
"""

import asyncio
import aiohttp
import json
from datetime import datetime

BACKEND_URL = "https://be3b742e-03e4-41ba-8bac-a87f56836504.preview.emergentagent.com/api"

async def test_ai_providers():
    """Test the new Advanced AI Provider functionality"""
    print("🤖 Testing Advanced AI Provider Functionality")
    print("=" * 60)
    
    async with aiohttp.ClientSession() as session:
        
        # Test 1: AI Providers List
        print("\n1. Testing AI Providers List Endpoint")
        try:
            async with session.get(f"{BACKEND_URL}/ai/providers") as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ PASS: Retrieved {data.get('total_providers', 0)} providers")
                    print(f"   Available providers: {data.get('available_providers', 0)}")
                    
                    # Check for expected providers
                    providers = data.get('providers', [])
                    provider_names = [p.get('provider') for p in providers]
                    expected = ['openai', 'anthropic', 'gemini', 'perplexity']
                    
                    if all(p in provider_names for p in expected):
                        print(f"✅ All expected providers present: {provider_names}")
                    else:
                        missing = [p for p in expected if p not in provider_names]
                        print(f"❌ Missing providers: {missing}")
                else:
                    print(f"❌ FAIL: Status {response.status}")
        except Exception as e:
            print(f"❌ FAIL: {e}")
        
        # Test 2: Individual Provider Details
        print("\n2. Testing Individual Provider Details")
        providers_to_test = ['openai', 'anthropic', 'gemini', 'perplexity']
        
        for provider in providers_to_test:
            try:
                async with session.get(f"{BACKEND_URL}/ai/providers/{provider}") as response:
                    if response.status == 200:
                        data = await response.json()
                        model = data.get('model', '')
                        available = data.get('available', False)
                        
                        # Check for latest models
                        expected_models = {
                            'openai': 'gpt-4o',
                            'anthropic': 'claude-3-5-sonnet-20241022',
                            'gemini': 'gemini-2.0-flash-exp',
                            'perplexity': 'sonar-pro'
                        }
                        
                        if model == expected_models.get(provider):
                            print(f"✅ {provider}: Latest model {model} ({'Available' if available else 'Unavailable'})")
                        else:
                            print(f"❌ {provider}: Wrong model. Expected {expected_models.get(provider)}, got {model}")
                    else:
                        print(f"❌ {provider}: Status {response.status}")
            except Exception as e:
                print(f"❌ {provider}: {e}")
        
        # Test 3: Provider Capabilities
        print("\n3. Testing Provider Capabilities Structure")
        try:
            async with session.get(f"{BACKEND_URL}/ai/providers") as response:
                if response.status == 200:
                    data = await response.json()
                    providers = data.get('providers', [])
                    
                    capabilities_complete = 0
                    for provider_data in providers:
                        provider_name = provider_data.get('provider')
                        required_fields = ['name', 'description', 'strengths', 'best_for']
                        
                        if all(field in provider_data for field in required_fields):
                            if (provider_data.get('name') and 
                                provider_data.get('description') and 
                                isinstance(provider_data.get('strengths'), list) and 
                                isinstance(provider_data.get('best_for'), list)):
                                capabilities_complete += 1
                                print(f"✅ {provider_name}: Complete capability information")
                            else:
                                print(f"❌ {provider_name}: Incomplete capability data")
                        else:
                            missing = [f for f in required_fields if f not in provider_data]
                            print(f"❌ {provider_name}: Missing fields: {missing}")
                    
                    print(f"\n📊 Capabilities Summary: {capabilities_complete}/{len(providers)} providers complete")
                else:
                    print(f"❌ FAIL: Status {response.status}")
        except Exception as e:
            print(f"❌ FAIL: {e}")
        
        # Test 4: Provider Availability Logic
        print("\n4. Testing Provider Availability Logic")
        try:
            async with session.get(f"{BACKEND_URL}/ai/providers") as response:
                if response.status == 200:
                    data = await response.json()
                    providers = data.get('providers', [])
                    
                    # Expected: OpenAI, Anthropic, Gemini should be available (have API keys)
                    # Perplexity should be unavailable (no API key)
                    expected_available = ['openai', 'anthropic', 'gemini']
                    expected_unavailable = ['perplexity']
                    
                    available_providers = [p['provider'] for p in providers if p.get('available', False)]
                    unavailable_providers = [p['provider'] for p in providers if not p.get('available', True)]
                    
                    print(f"Available providers: {available_providers}")
                    print(f"Unavailable providers: {unavailable_providers}")
                    
                    # Note: All might show as unavailable if API keys are not properly configured
                    if len(unavailable_providers) == 4:
                        print("⚠️  All providers unavailable - API keys might not be configured")
                    elif 'perplexity' in unavailable_providers:
                        print("✅ Perplexity correctly unavailable (no API key)")
                    else:
                        print("❌ Unexpected availability pattern")
                else:
                    print(f"❌ FAIL: Status {response.status}")
        except Exception as e:
            print(f"❌ FAIL: {e}")
        
        print("\n" + "=" * 60)
        print("🎯 ADVANCED AI PROVIDER FUNCTIONALITY TEST COMPLETE")
        print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_ai_providers())
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Crown, Check, Zap, Star, Sparkles, ArrowRight, Heart, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { mockData } from '../mock';

const PremiumPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [selectedPacks, setSelectedPacks] = useState([]);

  const plans = {
    monthly: {
      price: '$29.99',
      period: 'month',
      savings: null,
      popular: true
    },
    yearly: {
      price: '$299.99',
      period: 'year',
      savings: 'Save 17%',
      popular: false
    }
  };

  const premiumFeatures = [
    { icon: '🚀', title: 'Unlimited Generations', description: 'No daily limits - create as much as you want' },
    { icon: '🎯', title: 'THREE11 MOTION TECH', description: 'Access to all three AI providers simultaneously' },
    { icon: '📈', title: 'Trending Analytics', description: 'Real-time hashtag performance insights' },
    { icon: '💎', title: 'Premium Content Packs', description: 'Exclusive templates for luxury, pro, and niche markets' },
    { icon: '⚡', title: 'Priority Processing', description: 'Faster generation with priority queue access' },
    { icon: '🎨', title: 'Advanced Customization', description: 'Fine-tune AI responses to match your brand voice' },
    { icon: '📱', title: 'Multi-Platform Optimization', description: 'Optimized content for each platform\'s algorithm' },
    { icon: '🔄', title: 'Auto-Updates', description: 'Always current with latest trends and platform changes' },
    { icon: '📊', title: 'Performance Tracking', description: 'Track which captions perform best' },
    { icon: '🎭', title: 'Brand Voice Learning', description: 'AI learns and adapts to your unique style' },
    { icon: '🏆', title: 'Premium Support', description: '24/7 priority customer support' },
    { icon: '🎪', title: 'Early Access', description: 'First access to new features and AI models' }
  ];

  const handlePurchasePlan = (plan) => {
    toast.success(`Redirecting to checkout for ${plan} plan...`);
    // In real app, integrate with Stripe or payment processor
  };

  const handlePurchasePack = (pack) => {
    if (selectedPacks.includes(pack.id)) {
      setSelectedPacks(selectedPacks.filter(id => id !== pack.id));
      toast.info(`${pack.name} removed from cart`);
    } else {
      setSelectedPacks([...selectedPacks, pack.id]);
      toast.success(`${pack.name} added to cart`);
    }
  };

  const getTotalPackPrice = () => {
    return selectedPacks.reduce((total, packId) => {
      const pack = mockData.premiumPacks.find(p => p.id === packId);
      return total + parseFloat(pack.price.replace('$', ''));
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full mb-6">
          <Crown className="h-4 w-4 text-amber-600 mr-2" />
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
            Premium Features
          </span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
          Unlock Your Creative Potential
        </h1>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Get unlimited access to THREE11 MOTION TECH, premium content packs, and advanced features
        </p>
      </div>

      {/* Pricing Plans */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
        
        <div className="flex justify-center mb-8">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-1 flex">
            <Button
              variant={selectedPlan === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPlan('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={selectedPlan === 'yearly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPlan('yearly')}
            >
              Yearly
              <Badge className="ml-2 bg-green-500 text-white">Save 33%</Badge>
            </Button>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <Card className={`relative ${plans[selectedPlan].popular ? 'ring-2 ring-blue-500' : ''}`}>
            {plans[selectedPlan].popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Premium Plan</CardTitle>
              <CardDescription>Everything you need to create viral content</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plans[selectedPlan].price}</span>
                <span className="text-slate-600 dark:text-slate-300">/{plans[selectedPlan].period}</span>
                {plans[selectedPlan].savings && (
                  <div className="text-green-600 font-semibold mt-1">{plans[selectedPlan].savings}</div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {premiumFeatures.slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">{feature.title}</span>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={() => handlePurchasePlan(selectedPlan)}
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
              
              <p className="text-center text-xs text-slate-500 mt-2">
                Cancel anytime • 30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All Premium Features */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">All Premium Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Premium Packs */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Premium Content Packs</h2>
        <p className="text-center text-slate-600 dark:text-slate-300 mb-8">
          Specialized content for specific niches and professional use cases
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockData.premiumPacks.map((pack) => (
            <Card key={pack.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{pack.name}</CardTitle>
                  <Badge variant="secondary">{pack.price}</Badge>
                </div>
                <CardDescription>
                  {mockData.contentCategories.find(c => c.id === pack.category)?.name} Category
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 mb-4">
                  {pack.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant={selectedPacks.includes(pack.id) ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => handlePurchasePack(pack)}
                >
                  {selectedPacks.includes(pack.id) ? 'Remove from Cart' : 'Add to Cart'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {selectedPacks.length > 0 && (
          <Card className="mt-8 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Cart Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {selectedPacks.map(packId => {
                  const pack = mockData.premiumPacks.find(p => p.id === packId);
                  return (
                    <div key={packId} className="flex justify-between">
                      <span className="text-sm">{pack.name}</span>
                      <span className="text-sm font-medium">{pack.price}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t pt-2 mb-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${getTotalPackPrice().toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full">
                <ArrowRight className="mr-2 h-4 w-4" />
                Checkout
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CTA Section */}
      <div className="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
        <Crown className="h-16 w-16 mx-auto mb-6 text-amber-300" />
        <h2 className="text-3xl font-bold mb-4">Ready to Go Premium?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of creators who've upgraded their content game
        </p>
        <Button 
          size="lg" 
          variant="secondary" 
          className="group"
          onClick={() => handlePurchasePlan(selectedPlan)}
        >
          <Crown className="mr-2 h-5 w-5" />
          Start Premium Today
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default PremiumPage;
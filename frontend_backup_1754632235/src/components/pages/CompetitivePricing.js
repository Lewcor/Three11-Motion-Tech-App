import React from 'react';
import { Link } from 'react-router-dom';

const CompetitivePricing = () => {
  const pricingPlans = [
    {
      name: 'Basic Plan',
      price: '$9.99',
      yearlyPrice: '$99.99',
      yearlyDiscount: 'Save $19.89!',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      popular: false,
      description: 'Perfect for individual creators and small businesses',
      features: [
        '10,000 captions per month',
        'All 9 content categories',
        '4 platform optimization',
        'Basic hashtag suggestions',
        'Standard AI processing',
        'Email support'
      ]
    },
    {
      name: 'Unlimited Plan',
      price: '$29',
      yearlyPrice: '$299',
      yearlyDiscount: 'Save $49!',
      color: 'orange',
      gradient: 'from-yellow-500 to-orange-500',
      popular: true,
      description: 'Everything you need to dominate social media',
      features: [
        'UNLIMITED captions & content',
        'All 30+ premium features',
        'Voice Studio access',
        'Real-time trends analysis',
        'Priority AI processing',
        'Advanced analytics',
        'Team collaboration',
        'API access',
        'Priority support'
      ]
    },
    {
      name: 'Enterprise',
      price: '$179.99',
      yearlyPrice: '$179.99',
      yearlyDiscount: 'Annual billing only',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      popular: false,
      description: 'For teams and enterprise organizations',
      features: [
        'Everything in Unlimited',
        'Unlimited team access codes',
        'White label solutions',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'Training & onboarding',
        'Custom reporting'
      ]
    }
  ];

  const competitorComparison = [
    { name: 'ChatGPT Plus', price: '$20/month', features: '1 AI model, General purpose', limitation: 'Not optimized for social media' },
    { name: 'Copy.ai', price: '$49/month', features: 'Basic templates', limitation: 'Limited platform optimization' },
    { name: 'Jasper AI', price: '$59/month', features: 'Writing assistant', limitation: 'No social media focus' },
    { name: 'ContentStudio', price: '$25/month', features: 'Scheduling only', limitation: 'No AI content generation' },
    { name: 'Hootsuite', price: '$99/month', features: 'Social management', limitation: 'No content creation' },
  ];

  const freeAppComparison = [
    { name: 'Free AI Apps', price: 'Free', pros: 'No cost', cons: 'Limited features, ads, poor quality, no support', rating: '2.3/5' },
    { name: 'THREE11 Basic', price: '$9.99', pros: 'Professional quality, 3 AI models, platform-optimized', cons: 'Small monthly fee', rating: '4.9/5' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🏆 Competitive Pricing That 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Wins</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">Beat free AI apps with premium quality at unbeatable prices</p>
          
          {/* Pricing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-full p-1 shadow-lg">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium transition-colors">
                Monthly
              </button>
              <button className="px-6 py-2 text-gray-700 rounded-full font-medium hover:bg-gray-100 transition-colors">
                Yearly (Save up to 17%)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl shadow-lg p-8 relative ${
                  plan.popular ? 'border-4 border-yellow-400 transform scale-105' : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== 'Custom' && plan.price.includes('$') && (
                      <span className="text-xl text-gray-600">{plan.name === 'Enterprise' ? '/year' : '/month'}</span>
                    )}
                  </div>
                  
                  {plan.price !== 'Custom' && plan.name !== 'Enterprise' && (
                    <div className="text-sm text-gray-500 mb-4">
                      <span className="line-through">${plan.price === '$9.99' ? '119.88' : '348'}</span> {plan.yearlyPrice}/year ({plan.yearlyDiscount})
                    </div>
                  )}
                  
                  {plan.name === 'Enterprise' && (
                    <div className="text-sm text-gray-500 mb-4">
                      {plan.yearlyDiscount}
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <button className={`w-full py-3 px-6 bg-gradient-to-r ${plan.gradient} text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 ${plan.popular ? 'text-lg py-4' : ''}`}>
                    {plan.name === 'Enterprise' ? 'Start Enterprise Plan' : 'Start Free Trial'}
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-3">7-day free trial • Cancel anytime</p>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competitor Comparison */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">📊 How We Compare</h2>
            <p className="text-xl text-gray-600">THREE11 MOTION TECH vs. Premium Competitors</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Platform</th>
                  <th className="px-6 py-4 text-left font-bold">Price</th>
                  <th className="px-6 py-4 text-left font-bold">Features</th>
                  <th className="px-6 py-4 text-left font-bold">Limitations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-green-50">
                  <td className="px-6 py-4 font-bold text-green-700">THREE11 MOTION TECH</td>
                  <td className="px-6 py-4 font-bold text-green-700">$29/month</td>
                  <td className="px-6 py-4 text-green-700">30+ features, 3 AI models, All platforms</td>
                  <td className="px-6 py-4 text-green-700">None - Complete solution</td>
                </tr>
                {competitorComparison.map((competitor, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{competitor.name}</td>
                    <td className="px-6 py-4 text-red-600 font-bold">{competitor.price}</td>
                    <td className="px-6 py-4">{competitor.features}</td>
                    <td className="px-6 py-4 text-red-600">{competitor.limitation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Free vs Paid Comparison */}
      <div className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">🆚 Free Apps vs. THREE11</h2>
            <p className="text-xl text-gray-600">Why $9.99 beats free every time</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {freeAppComparison.map((item, index) => (
              <div key={index} className={`rounded-2xl p-8 shadow-lg ${index === 1 ? 'bg-green-500 text-white border-4 border-green-400' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">{item.name}</h3>
                  <div className="text-2xl font-bold">{item.price}</div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className={`font-bold mb-2 ${index === 1 ? 'text-green-100' : 'text-green-700'}`}>✅ Pros:</h4>
                    <p className={index === 1 ? 'text-green-100' : ''}>{item.pros}</p>
                  </div>
                  
                  <div>
                    <h4 className={`font-bold mb-2 ${index === 1 ? 'text-green-200' : 'text-red-700'}`}>❌ Cons:</h4>
                    <p className={index === 1 ? 'text-green-200' : ''}>{item.cons}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-opacity-20">
                    <div className="flex justify-between items-center">
                      <span className={`font-bold ${index === 1 ? 'text-green-100' : ''}`}>User Rating:</span>
                      <span className={`text-xl font-bold ${index === 1 ? 'text-yellow-300' : item.rating.includes('4.9') ? 'text-green-600' : 'text-red-600'}`}>
                        {item.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">💰 ROI Calculator</h2>
          <p className="text-xl text-gray-600 mb-12">See how THREE11 pays for itself</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Time Saved</h3>
              <div className="text-4xl font-bold mb-2">20 hrs</div>
              <div className="text-blue-100">per week</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Value Created</h3>
              <div className="text-4xl font-bold mb-2">$2,000</div>
              <div className="text-green-100">per month</div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">ROI</h3>
              <div className="text-4xl font-bold mb-2">6,800%</div>
              <div className="text-yellow-100">return</div>
            </div>
          </div>
          
          <div className="mt-12">
            <Link 
              to="/premium"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Start Your Free Trial Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitivePricing;
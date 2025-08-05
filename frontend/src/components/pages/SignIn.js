import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [showAccessCode, setShowAccessCode] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log('Sign in attempted:', { email, password, accessCode });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img 
            src="https://customer-assets.emergentagent.com/job_sidebar-nav-fix/artifacts/891136ci_THREE11%20-%20LOGO.png" 
            alt="THREE11 MOTION TECH"
            className="w-16 h-16 object-contain mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Sign in to your THREE11 MOTION TECH account</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSignIn}>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {/* Access Code Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="has-access-code"
                  type="checkbox"
                  checked={showAccessCode}
                  onChange={(e) => setShowAccessCode(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="has-access-code" className="ml-2 block text-sm text-gray-700">
                  I have an access code
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-500">
                Forgot password?
              </Link>
            </div>

            {/* Access Code Field */}
            {showAccessCode && (
              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Team Access Code
                </label>
                <input
                  id="accessCode"
                  name="accessCode"
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-4 py-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-purple-50"
                  placeholder="THREE11-CEO-2025"
                />
                <p className="mt-1 text-sm text-purple-600">
                  👑 Enter your unlimited access code for premium features
                </p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
            >
              Sign In to THREE11 MOTION TECH
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Sign In */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-purple-600 hover:text-purple-500">
                Start your free trial
              </Link>
            </p>
          </div>

          {/* Access Code Help */}
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <h4 className="text-sm font-medium text-purple-900 mb-2">👑 Have a Team Access Code?</h4>
            <p className="text-xs text-purple-700">
              If you're part of the THREE11 MOTION TECH team, use your unlimited access code for premium features.
            </p>
            <Link 
              to="/team-access" 
              className="text-xs text-purple-600 hover:text-purple-500 font-medium"
            >
              View all access codes →
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">Join 50K+ creators using THREE11 MOTION TECH</p>
          <div className="flex justify-center space-x-6 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <span>✨</span>
              <span>30+ Features</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🤖</span>
              <span>3 AI Providers</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>📱</span>
              <span>4 Platforms</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>⭐</span>
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
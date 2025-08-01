import React, { useState, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Google,
  Shield,
  Key,
  Users
} from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTeamCode, setShowTeamCode] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    teamCode: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            email: formData.email, 
            password: formData.password, 
            name: formData.name,
            team_code: formData.teamCode || undefined
          };

      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setSuccess(isLogin ? 'Login successful! Redirecting...' : 'Account created successfully! Redirecting...');
        
        // Redirect to main app
        setTimeout(() => {
          window.location.href = '/generator';
        }, 1500);
      } else {
        setError(data.detail || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamCodeCheck = async () => {
    if (!formData.teamCode) return;
    
    try {
      const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/auth/team-code/${formData.teamCode}`);
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(`Team code valid! ${data.remaining_uses} uses remaining.`);
      } else {
        setError('Invalid team code');
      }
    } catch (err) {
      setError('Failed to verify team code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-10 w-10 text-yellow-500 mr-2" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              THREE11 MOTION TECH
            </h1>
          </div>
          <p className="text-gray-600">The Ultimate AI-Powered Social Media Automation Platform</p>
        </div>

        {/* Main Auth Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isLogin ? 'Welcome Back' : 'Join THREE11 MOTION TECH'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Sign in to access all your AI-powered features' 
                : 'Create your account and start automating your social media'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Name Field (Signup only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Team Code Field (Signup only) */}
              {!isLogin && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Team Code (Optional)</label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTeamCode(!showTeamCode)}
                      className="text-xs"
                    >
                      {showTeamCode ? 'Hide' : 'Have a team code?'}
                    </Button>
                  </div>
                  
                  {showTeamCode && (
                    <div className="space-y-2">
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="teamCode"
                          value={formData.teamCode}
                          onChange={handleInputChange}
                          onBlur={handleTeamCodeCheck}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter team code for unlimited access"
                        />
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Shield className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-purple-700">
                            <strong>Team Code Benefits:</strong>
                            <ul className="mt-1 space-y-1">
                              <li>• Unlimited AI generations</li>
                              <li>• Access to all premium features</li>
                              <li>• Team collaboration tools</li>
                              <li>• Full admin privileges</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-green-700 text-sm">{success}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {loading 
                  ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                  : (isLogin ? 'Sign In' : 'Create Account')
                }
              </Button>
            </form>

            {/* Google Login Placeholder */}
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-3"
                disabled
              >
                <Google className="h-4 w-4 mr-2" />
                Google (Coming Soon)
              </Button>
            </div>

            {/* Toggle Login/Signup */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                    setFormData({ email: '', password: '', name: '', teamCode: '' });
                  }}
                  className="ml-1 p-0 h-auto text-blue-600 font-semibold"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials Card */}
        <Card className="mt-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Crown className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="font-semibold text-yellow-800">Admin Access</h3>
              </div>
              <div className="space-y-2 text-sm text-yellow-700">
                <p><strong>Email:</strong> lewcor311@gmail.com</p>
                <p><strong>Password:</strong> THREE11admin2025!</p>
                <p><strong>Team Code:</strong> THREE11-UNLIMITED-2025</p>
              </div>
              <Badge className="mt-3 bg-yellow-600 text-white">
                <Users className="h-3 w-3 mr-1" />
                10 Team Member Slots Available
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-3">What you'll get access to:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">50+ Features</Badge>
            <Badge variant="secondary">4 AI Models</Badge>
            <Badge variant="secondary">Team Collaboration</Badge>
            <Badge variant="secondary">Social Automation</Badge>
            <Badge variant="secondary">Advanced Analytics</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
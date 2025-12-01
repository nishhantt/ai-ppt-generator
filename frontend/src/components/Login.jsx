import React, { useEffect } from 'react';
import { Presentation, Sparkles } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { 
            theme: 'filled_blue', 
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 350
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential,
          clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('✅ Login successful:', data.user.name);
        
        // Call parent callback
        onLoginSuccess(data.user, data.token);
      } else {
        console.error('Login failed:', data.error);
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Presentation className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI PowerPoint Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Create stunning presentations in seconds
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600">
              Sign in to continue creating amazing presentations
            </p>
          </div>

          {/* Google Sign-In Button */}
          <div className="flex justify-center mb-6">
            <div id="google-signin-button"></div>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-4">
              What you'll get:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI-powered presentation generation</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Save and access your presentations</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Edit slides via chat commands</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
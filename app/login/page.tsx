'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      if (!data.token) {
        throw new Error('Authentication token not received');
      }

      // Save token in storage
      if (rememberMe) {
        localStorage.setItem('authToken', data.token);
      } else {
        sessionStorage.setItem('authToken', data.token);
      }

      // Save user info (excluding sensitive data)
      if (data.user) {
        sessionStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          phone: data.user.phone,
          role: data.user.role
        }));
      }

      toast.success('Login successful! Redirecting...');
      router.push('/');
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-800 p-4">
      <div className="bg-white rounded-2xl p-6 md:p-10 shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full mb-4 flex items-center justify-center shadow-md">
            <span className="text-3xl text-orange-600">SE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-orange-700">Samrat Online Bookingsssss</h1>
        </div>

        <h2 className="text-lg font-bold text-center mb-6">Login to your account</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden hover:border-orange-400 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-400 transition-all">
            <span className="px-3 text-gray-600">📱</span>
            <Input 
              type="tel" 
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full py-3 px-3 focus:outline-none border-0" 
              required
              pattern="[0-9]{10}"
              title="Please enter a 10-digit phone number"
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden hover:border-orange-400 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-400 transition-all">
            <span className="px-3 text-gray-600">🔒</span>
            <Input 
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full py-3 px-3 focus:outline-none border-0"
              required
              minLength={6}
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="px-3 text-gray-600 hover:text-orange-700"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </Button>
          </div>

          <div className="flex items-center justify-between text-sm flex-wrap gap-2">
            <label className="flex items-center cursor-pointer">
              <Checkbox 
                checked={rememberMe}
                onCheckedChange={() => setRememberMe(!rememberMe)}
                className="mr-2 text-orange-600 border-gray-400" 
              /> 
              <span className="text-gray-700">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-orange-700 hover:text-orange-500 hover:underline font-medium">
              Forgot Password?
            </a>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-orange-700 hover:bg-orange-600 text-white py-3 rounded-lg font-bold text-lg shadow-md transition-colors disabled:opacity-70"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : 'LOGIN'}
          </Button>
        </form>

        <div className="my-6 text-center relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">OR</span>
          </div>
        </div>

        <div className="flex items-center justify-center border border-gray-300 rounded-lg p-3 hover:border-orange-400 transition-all cursor-pointer">
          <span className="text-orange-600 mr-2">📞</span>
          <span className="text-gray-800 font-medium">+91-8602966827</span>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-orange-700 hover:underline font-medium">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

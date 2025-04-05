'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      // Redirect user to dashboard or home
      router.push('/dashboard');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
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
          <h1 className="text-2xl md:text-3xl font-bold text-orange-700">Saffron Exch</h1>
        </div>

        <h2 className="text-lg font-bold text-center mb-6 flex items-center justify-center gap-2">
          <span className="text-xl">🔑</span> Login to your account
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden hover:border-orange-400 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-400 transition-all">
            <span className="px-3 text-gray-600">👤</span>
            <Input 
              type="text" 
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full py-3 px-3 focus:outline-none border-0" 
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden hover:border-orange-400 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-400 transition-all">
            <span className="px-3 text-gray-600">🔒</span>
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-3 focus:outline-none border-0"
              required 
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="px-3 text-gray-600 hover:text-orange-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </Button>
          </div>

          <div className="flex items-center justify-between text-sm flex-wrap gap-2">
            <label className="flex items-center cursor-pointer">
              <Checkbox className="mr-2 text-orange-600 border-gray-400" /> 
              <span className="text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-orange-700 hover:text-orange-500 hover:underline font-medium">Forgot Password?</a>
          </div>

          {error && (
            <div className="text-sm text-red-600 font-medium text-center">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-orange-700 hover:bg-orange-600 text-white py-3 rounded-lg font-bold text-lg shadow-md transition-colors"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
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
          <span className="text-gray-800 font-medium">+91-1234589623</span>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account? <a href="#" className="text-orange-700 hover:underline font-medium">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

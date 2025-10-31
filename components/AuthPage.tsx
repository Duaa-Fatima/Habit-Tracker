import React, { useState } from 'react';
import { signIn, signUp } from '../services/authService';
import { User } from '../types';
import { AuraLogo } from './icons';

interface AuthPageProps {
    onLoginSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const result = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

    if (result.success && result.user) {
        onLoginSuccess(result.user);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };
  
  const toggleForm = () => {
      setIsLogin(!isLogin);
      setError(null);
      setEmail('');
      setPassword('');
  }

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-base-100 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex flex-col items-center">
          <AuraLogo className="h-12 w-12" />
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome Back to Aura' : 'Create Your Account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? 'Sign in to continue your journey.' : 'Start building better habits today.'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-danger text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </div>
        </form>
         <p className="text-center text-sm text-black">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={toggleForm} className="font-medium text-purple-600 hover:text-purple-500 ml-1">
                {isLogin ? 'Sign Up' : 'Sign In'}
            {/* Fix: Corrected the closing tag from a typo 'tr-button' to 'button'. */}
            </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
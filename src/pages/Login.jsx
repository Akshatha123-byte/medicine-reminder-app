import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const { login, signup } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLogin && !formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      if (isLogin) {
        login({ email: formData.email, password: formData.password });
      } else {
        signup({ name: formData.name, email: formData.email, password: formData.password });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-medical-light flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-medical-blue p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <HeartPulse size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">MedMinder</h1>
          <p className="text-blue-100 text-sm">Your Personal Health & Medicine Assistant</p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue transition-colors outline-none"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue transition-colors outline-none"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue transition-colors outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue transition-colors outline-none"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-medical-blue hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors mt-6 shadow-md shadow-blue-500/30"
            >
              <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-medical-blue hover:underline font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

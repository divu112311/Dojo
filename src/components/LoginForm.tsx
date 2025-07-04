import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { isSupabaseConfigured } from '../lib/supabase';
import doughjoMascot from '../assets/doughjo-mascot.png';

const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, loading, authError } = useAuth();

  // Set error from auth hook
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Please set up your environment variables.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isLogin) {
        await signIn(formState.email, formState.password);
      } else {
        if (!formState.firstName.trim() || !formState.lastName.trim()) {
          setError('First name and last name are required');
          setIsSubmitting(false);
          return;
        }
        await signUp(formState.email, formState.password, formState.firstName.trim(), formState.lastName.trim());
      }
    } catch (err: any) {
      // Error is already set by the auth hook
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] via-[#F5F4F0] to-[#EBE9E4] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo & Header */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-16 h-16 mr-3"
            >
              <img 
                src={doughjoMascot} 
                alt="DoughJo Mascot" 
                className="w-full h-full object-contain rounded-full"
              />
            </motion.div>
            <h1 className="text-4xl font-serif font-bold text-[#333333]">DoughJo</h1>
          </div>
          <p className="text-[#666666] text-lg">Your AI Financial Sensei</p>
          <p className="text-[#888888] text-sm mt-2">Master your money with ancient wisdom and modern AI</p>
        </motion.div>

        {/* Supabase Configuration Warning */}
        {!isSupabaseConfigured && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">Supabase Not Configured</h4>
                <p className="text-sm text-yellow-800">
                  Your Supabase environment variables are not properly set up. Please check your .env file and make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correctly configured.
                </p>
                <p className="text-sm text-yellow-800 mt-2">
                  You can use the "Connect to Supabase" button in the top right of the editor to set up your project.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200"
        >
          {/* Toggle Buttons */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin
                  ? 'bg-white text-[#2A6F68] shadow-sm'
                  : 'text-gray-600 hover:text-[#2A6F68]'
              }`}
            >
              <LogIn className="h-4 w-4 inline mr-2" />
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isLogin
                  ? 'bg-white text-[#2A6F68] shadow-sm'
                  : 'text-gray-600 hover:text-[#2A6F68]'
              }`}
            >
              <UserPlus className="h-4 w-4 inline mr-2" />
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all bg-white/50"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all bg-white/50"
                    placeholder="Last name"
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all bg-white/50"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formState.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all bg-white/50"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
              >
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || isSubmitting || !isSupabaseConfigured}
              className="w-full bg-[#2A6F68] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#235A54] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                isLogin ? 'Begin Your Journey' : 'Join the Dojo'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              "The way of the warrior is to stop trouble before it starts" - DoughJo Wisdom
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
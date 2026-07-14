"use client";
import React, { useState } from 'react';
import { Mail, Lock, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  // REAL Custom Credentials Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false, // Don't let NextAuth handle the redirect, we will do it manually to check role
        email,
        password,
      });

      if (result?.error) {
        alert("Invalid email or password!");
        setIsLoading(false);
      } else {
        // Since we are using NextAuth, it will automatically handle the session cookie.
        // We fetch the session client-side to check the role.
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        if (sessionData?.user && sessionData.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      alert('An error occurred during login.');
      setIsLoading(false);
    }
  };

  // REAL Google Login
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    // Google sign in handles redirection automatically based on the NextAuth config
    await signIn('google', { callbackUrl: '/' }); 
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-md p-8 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-6 relative overflow-hidden">
            <Zap size={32} className="text-white relative z-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
            Welcome to Nexus
          </h1>
          <p className="text-gray-400 text-sm">
            Sign in to access your student portal
          </p>
        </div>

        {/* Glassmorphism Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center space-x-3 bg-white text-black font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors mb-6"
          >
            {isGoogleLoading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-gray-500 font-medium">OR USE EMAIL</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nexus.edu"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-gray-300">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full relative flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">Sign In Securely</span>
                  <ArrowRight size={18} className="relative z-10" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-2 text-xs text-gray-500">
            <ShieldCheck size={14} className="text-emerald-500/70" />
            <span>Protected by Nexus Enterprise Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
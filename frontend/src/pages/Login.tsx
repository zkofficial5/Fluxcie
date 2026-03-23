 import React, { useState, useEffect } from 'react';
 import { motion } from 'framer-motion';
 import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
 import { useNavigate, Link } from 'react-router-dom';
 import { useAuth } from '@/context/AuthContext';
 import AuroraBackground from '@/components/chat/AuroraBackground';
 import { Input } from '@/components/ui/input';
 import { Button } from '@/components/ui/button';
 import { Checkbox } from '@/components/ui/checkbox';
 
 const Login: React.FC = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [rememberMe, setRememberMe] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   
   const { login, isAuthenticated } = useAuth();
   const navigate = useNavigate();
 
   useEffect(() => {
     if (isAuthenticated) {
       navigate('/');
     }
   }, [isAuthenticated, navigate]);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');
     setIsLoading(true);
 
     const success = await login(email, password);
     
     if (success) {
       navigate('/');
     } else {
       setError('Invalid credentials. Please try again.');
     }
     setIsLoading(false);
   };
 
   return (
     <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
       <AuroraBackground />
       
       <motion.div
         initial={{ opacity: 0, y: 20, scale: 0.95 }}
         animate={{ opacity: 1, y: 0, scale: 1 }}
         transition={{ duration: 0.5, ease: 'easeOut' }}
         className="w-full max-w-md mx-4 relative z-10"
       >
         <div className="rounded-3xl p-8 shadow-2xl" style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px hsl(262 83% 58% / 0.1)' }}>
           {/* Logo/Header */}
           <motion.div
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-center mb-8"
           >
             <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary-soft flex items-center justify-center glow-primary">
               <svg
                 className="w-8 h-8 text-primary-foreground"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
               >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   strokeWidth={2}
                   d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                 />
               </svg>
             </div>
             <h1 className="text-2xl font-bold gradient-text">Welcome Back</h1>
             <p className="text-muted-foreground mt-2">Sign in to continue to Chat</p>
           </motion.div>
 
           {/* Form */}
           <form onSubmit={handleSubmit} className="space-y-5">
             {error && (
               <motion.div
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm"
               >
                 {error}
               </motion.div>
             )}
 
             <div className="space-y-2">
               <label className="text-sm font-medium text-foreground">Email</label>
               <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                 <Input
                   type="email"
                   placeholder="Enter your email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="pl-11 h-12 bg-glass border-glass-border/30 focus:border-primary/50 rounded-xl"
                   required
                 />
               </div>
             </div>
 
             <div className="space-y-2">
               <label className="text-sm font-medium text-foreground">Password</label>
               <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                 <Input
                   type={showPassword ? 'text' : 'password'}
                   placeholder="Enter your password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="pl-11 pr-11 h-12 bg-glass border-glass-border/30 focus:border-primary/50 rounded-xl"
                   required
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                 >
                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                 </button>
               </div>
             </div>
 
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Checkbox
                   id="remember"
                   checked={rememberMe}
                   onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                 />
                 <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                   Remember me
                 </label>
               </div>
               <Link
                 to="#"
                 className="text-sm text-primary hover:text-primary/80 transition-colors"
               >
                 Forgot password?
               </Link>
             </div>
 
             <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
               <Button
                 type="submit"
                 disabled={isLoading}
                 className="w-full h-12 rounded-xl gradient-primary-soft text-primary-foreground font-semibold glow-primary"
               >
                 {isLoading ? (
                   <Loader2 className="w-5 h-5 animate-spin" />
                 ) : (
                   <>
                     <LogIn className="w-5 h-5 mr-2" />
                     Sign In
                   </>
                 )}
               </Button>
             </motion.div>
           </form>
 
           {/* Footer */}
           <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="text-center mt-6 text-muted-foreground"
           >
             Don't have an account?{' '}
             <Link to="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
               Sign up
             </Link>
           </motion.p>
         </div>
       </motion.div>
     </div>
   );
 };
 
 export default Login;